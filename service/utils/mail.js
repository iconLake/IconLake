import nodemailer from 'nodemailer'
import { getConfig } from '../config/index.js'

const config = getConfig()

const transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  secure: true,
  auth: {
    user: config.mail.user,
    pass: config.mail.pass
  }
})

/**
 * 发送邮件
 * @param {Object} options - 邮件发送选项
 * @param {string} [options.from] - 发件人名称，默认为配置中的用户邮箱
 * @param {string} [options.sender] - 发件人地址，默认为配置中的用户邮箱
 * @param {string} options.to - 收件人地址
 * @param {string} options.subject - 邮件主题
 * @param {string} options.text - 邮件正文
 * @param {string} [options.html] - 邮件正文（HTML）
 * @returns {Promise<Object>} 返回邮件发送结果信息
 */
async function send ({ from, sender, to, subject, text, html }) {
  const info = await transporter.sendMail({
    from: from || `${config.mail.user} <${config.mail.user}>`,
    sender: sender || config.mail.user,
    to,
    subject,
    text,
    html
  })

  return info
}

export const mail = {
  send
}
