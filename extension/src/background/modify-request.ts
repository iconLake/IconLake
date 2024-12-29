import Browser, { DeclarativeNetRequest } from "webextension-polyfill";

type Rule = DeclarativeNetRequest.Rule;

const Domains = [Browser.runtime.id, 'iconlake.com', '127.0.0.1', 'localhost'];

async function getRequestRefererFromStorage(): Promise<{
  [key: string]: string;
}> {
  const { requestReferers } = await Browser.storage.local.get('requestReferers');
  return requestReferers || {};
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
  for (const [hostname, referer] of Object.entries(requestReferers)) {
    rules.push({
      id: rules.length + 1,
      priority: 1,
      action: {
        requestHeaders: [
          { header: 'Referer', operation: 'set', value: referer },
          { header: 'Origin', operation: 'set', value: referer },
        ],
        type: 'modifyHeaders'
      },
      condition: {
        domains: Domains,
        urlFilter: hostname,
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
    const hostname = new URL(e.url).hostname;
    const referer = new URL(e.referer).origin;

    if (!hostname || !referer) {
      return;
    }

    if (!referers[hostname]) {
      referers[hostname] = referer;
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
