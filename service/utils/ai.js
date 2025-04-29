import OpenAI from 'openai'
import { getConfig } from '../config/index.js'
import { Usage } from '../models/usage.js'
import { format } from 'date-fns'

const config = getConfig()

const hunyuanClient = new OpenAI({
  apiKey: config.ai.hunyuan.apiKey,
  baseURL: config.ai.hunyuan.endpoint
})

export const AI_MODELS = {
  HUNYUAN: 'hunyuan'
}

export function getAI (model) {
  const models = {
    hunyuan: {
      model: 'hunyuan-turbos-vision',
      client: hunyuanClient
    }
  }
  return model ? models[model] : models
}

export async function getAIUsage ({ userId }) {
  let usage = await Usage.findOne({ user: userId }, 'ai.tokens ai.monthly ai.daily')
  if (!usage) {
    usage = new Usage({ user: userId })
    await usage.save()
  }
  return usage.ai
}

/**
 * @param {{ model: string; promptTokens: number; completionTokens: number; userId: string; }} params
 **/
export async function recordUsage ({ model, promptTokens, completionTokens, userId }) {
  const aiUsage = await getAIUsage({ userId })
  const createTime = new Date()
  const dayKey = `${model}_${format(createTime, 'yyyy_MM_dd')}`
  const monthKey = `${model}_${format(createTime, 'yyyy_MM')}`
  const $inc = {
    [`ai.daily.${dayKey}.promptTokens`]: promptTokens,
    [`ai.daily.${dayKey}.completionTokens`]: completionTokens,
    [`ai.monthly.${monthKey}.promptTokens`]: promptTokens,
    [`ai.monthly.${monthKey}.completionTokens`]: completionTokens,
    'ai.tokens.used': promptTokens + completionTokens
  }
  const $set = {}
  if (!aiUsage.daily.get(dayKey)?.model) {
    $set[`ai.daily.${dayKey}.model`] = model
    $set[`ai.daily.${dayKey}.createTime`] = createTime
  }
  if (!aiUsage.monthly.get(monthKey)?.model) {
    $set[`ai.monthly.${monthKey}.model`] = model
    $set[`ai.monthly.${monthKey}.createTime`] = createTime
  }
  const $push = {
    'ai.history': {
      model,
      promptTokens,
      completionTokens,
      createTime
    }
  }
  const res = await Usage.updateOne({ user: userId }, { $inc, $set, $push })
  return res
}

/**
 * @param {{ model: string; imgUrl: string; type: 'good' | 'normal' | 'bad' | 'great'; locale: string; userId: string; }} params
 **/
export async function aiAppreciate ({ model, imgUrl, type, locale, userId }) {
  const ai = getAI(model)
  if (!model) {
    throw new Error('AI model not found')
  }

  const aiUsage = await getAIUsage({ userId })
  const totalTokens = aiUsage.tokens.total || config.ai.hunyuan.freeQuota
  if (totalTokens <= aiUsage.tokens.used) {
    throw new Error('resourceExhausted')
  }

  let prompt = {
    good: '你是给好评的艺术评论家，从主题、构图、色彩、技法、情感、创新性等方面对画作进行评价，即使作品很烂也能给与积极的鼓励',
    normal: '你是中肯的艺术评论家，从主题、构图、色彩、技法、情感、创新性等方面对画作进行评价，针对作品给出不偏不倚的恰到好处的评价，并指出作品的改进点',
    bad: '你是给差评的艺术评论家，从主题、构图、色彩、技法、情感、创新性等方面对画作进行评价，吹毛求疵，不留情面',
    great: '你是马屁精艺术评论家，疯狂夸赞作品，使用大量华丽的辞藻进行歇斯底里地吹捧，而且从主题、构图、色彩、技法、情感、创新性等各个方面对画作进行全方位吹捧'
  }[type]

  if (locale === 'en-us') {
    prompt += '\n用英语写'
  }

  const completion = await ai.client.chat.completions.create({
    model: ai.model,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt
          },
          {
            type: 'image_url',
            image_url: {
              url: imgUrl
            }
          }
        ]
      }
    ]
  })

  recordUsage({
    model,
    promptTokens: completion.usage.prompt_tokens,
    completionTokens: completion.usage.completion_tokens,
    userId
  }).catch(console.error)

  return completion.choices[0].message.content
}
