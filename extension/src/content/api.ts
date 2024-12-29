const IconlakeRequestMsgTypePrefix = 'iconlakeRequest:'
const IconlakeResponseMsgTypePrefix = 'iconlakeResponse:'

async function callBackground(type: string, params: any[]) {
  return await browser.runtime.sendMessage({
      type,
      params
    })
}

function responseToFrontend(e: {
  type: string;
  id: string;
  response?: any;
  error?: any;
}) {
  window.postMessage({
    ...e,
    type: IconlakeResponseMsgTypePrefix + e.type,
  })
}

export function initApi() {
  window.addEventListener('message', (e) => {
    if (e.data && typeof e.data.type === 'string' && e.data.type.startsWith(IconlakeRequestMsgTypePrefix)) {
      const type = e.data.type.substring(IconlakeRequestMsgTypePrefix.length)
      const params = e.data.params instanceof Array ? e.data.params : [e.data.params]
      callBackground(type, params).then(response => {
        responseToFrontend({
          type,
          id: e.data.id,
          response
        })
      }).catch(error => {
        responseToFrontend({
          type,
          id: e.data.id,
          error
        })
      })
    }
  })
}
