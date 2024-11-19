import Browser, { DeclarativeNetRequest } from "webextension-polyfill";

type Rule = DeclarativeNetRequest.Rule;

async function getRequestRulesFromStorage(): Promise<Rule[]> {
  const { requestRules = [] } = await Browser.storage.local.get('requestRules');
  return requestRules;
}

async function saveRequestRulesToStorage(rules: Rule[]): Promise<void> {
  await Browser.storage.local.set({ requestRules: rules });
}

async function updateRequestRules(rules: Rule[]): Promise<void> {
  await Browser.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: rules.map(r => r.id),
    addRules: rules,
  });
}

export function initModifyRequest() {
  Browser.runtime.onInstalled.addListener(async () => {
    const storedRules = await getRequestRulesFromStorage();
    if (storedRules.length > 0) {
      await updateRequestRules(storedRules);
      await saveRequestRulesToStorage(storedRules);
    }
  });
}

export async function handleModifyRequestReferer(message: {
  type: 'ModifyRequestReferer';
  data: {
    url: string;
    referer: string;
  }[];
}) {
  if (message.type !== 'ModifyRequestReferer') {
    return;
  }

  const data = message.data as {
    url: string;
    referer: string;
  }[];
  const existingRules = await getRequestRulesFromStorage();

  const rules: Rule[] = [...existingRules];

  data.forEach(e => {
    const urlFilter = new URL(e.url).hostname;
    const referer = new URL(e.referer).origin;

    if (!urlFilter || !referer) {
      return;
    }

    if (rules.length > 0 && rules.some(r => {
      if (r.condition.urlFilter === urlFilter) {
        if (r.action?.requestHeaders?.some(h => h.header === 'Referer' && h.value === referer)) {
          return true;
        }
      }
      return false;
    })) {
      return;
    }

    rules.push({
      id: rules.length + 1,
      priority: 1,
      action: { requestHeaders: [{ header: 'Referer', operation: 'set', value: referer }], type: 'modifyHeaders' },
      condition: {
        domains: [Browser.runtime.id],
        urlFilter,
        resourceTypes: ['image', 'media', 'xmlhttprequest'],
      }
    } as Rule);
  });

  if (rules.length === existingRules.length) {
    return { message: 'No rules to add.' };
  }

  await updateRequestRules(rules);
  await saveRequestRulesToStorage(rules);

  return { message: 'Rule added.' };
};
