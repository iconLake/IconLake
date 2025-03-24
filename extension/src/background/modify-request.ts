import Browser, { DeclarativeNetRequest } from "webextension-polyfill";

type Rule = DeclarativeNetRequest.Rule;

const Domains = [Browser.runtime.id, 'iconlake.com', '127.0.0.1', 'localhost'];

async function getRequestRefererFromStorage(): Promise<{
  [key: string]: string;
}> {
  const { requestReferers } = await Browser.storage.local.get('requestReferers');
  return {
    'https://huaban.com': 'https://huaban.com',
    'https://www.iconfont.cn': 'https://www.iconfont.cn',
    'https://www.zcool.com.cn': 'https://www.zcool.com.cn',
    ...(requestReferers || {})
  };
}

async function saveRequestReferersToStorage(requestReferers: { [key: string]: string }): Promise<void> {
  await Browser.storage.local.set({ requestReferers });
}

async function updateRequestRules(rules: Rule[]): Promise<void> {
  await Browser.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: rules.map(r => r.id),
    addRules: rules,
  });
}

function getRules(requestReferers: { [key: string]: string }) {
  const rules: Rule[] = [];
  for (const [target, referer] of Object.entries(requestReferers)) {
    rules.push({
      id: rules.length + 1,
      priority: 1,
      action: {
        requestHeaders: [
          { header: 'Referer', operation: 'set', value: referer },
          { header: 'Origin', operation: 'set', value: referer },
        ],
        responseHeaders: [
          { header: 'Access-Control-Allow-Origin', operation: 'set', value: '*' },
        ],
        type: 'modifyHeaders'
      },
      condition: {
        domains: Domains,
        urlFilter: target,
        resourceTypes: ['image', 'media', 'xmlhttprequest'],
      }
    } as Rule);
  }
  return rules;
}

export function initModifyRequest() {
  Browser.runtime.onInstalled.addListener(async () => {
    const referers = await getRequestRefererFromStorage();
    if (Object.keys(referers).length > 0) {
      await updateRequestRules(getRules(referers));
    }
  });
}

export async function handleModifyRequestReferer(data: {
  url: string;
  referer: string;
}[]) {
  const referers = await getRequestRefererFromStorage();
  let isNew = false;

  data.forEach(e => {
    const target = new URL(e.url).origin;
    const referer = new URL(e.referer).origin;

    if (!target || !referer) {
      return;
    }

    if (!referers[target]) {
      referers[target] = referer;
      isNew = true;
    }
  });

  if (!isNew) {
    return { message: 'Existed.' };
  }

  await updateRequestRules(getRules(referers));
  await saveRequestReferersToStorage(referers);

  return { message: 'Added.' };
};
