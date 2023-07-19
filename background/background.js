// @ts-nocheck

chrome.runtime.onInstalled.addListener(function () {
  console.log("插件已被安装", chrome.tabs, chrome.webRequest, chrome);

  // chrome.devtools.network.onRequestFinished(function(detail) {
  //   console.log(detail)
  // })

  // storage中设置值
  chrome.storage.sync.set({ color: "#3aa757" }, function () {
    console.log("storage init color value");
  });

  // 为特定的网址显示图标
  // chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
  //   chrome.declarativeContent.onPageChanged.addRules([
  //     {
  //       conditions: [
  //         new chrome.declarativeContent.PageStateMatcher({
  //           pageUrl: { hostEquals: "baidu.com" },
  //         }),
  //       ],
  //       actions: [new chrome.declarativeContent.ShowPageAction()],
  //     },
  //   ]);
  // });
})

// chrome.webRequest.onCompleted.addListener(function (details) {
//   if (details.initiator && details.initiator.includes('alipay.com')) {
//     // console.log(details.type, details.url, 'onCompleted')
//   }
//   return { responseHeaders: details.responseHeaders };
// }, { urls: ["<all_urls>"] }, ['responseHeaders', 'extraHeaders'])

let tabId = '';

chrome.webRequest.onHeadersReceived.addListener(function (details) {
  const { responseHeaders, initiator, url } = details || {}
  if (initiator && initiator.includes('alipay.com') && url && url.includes('/login/homeB.htm')) {
    const [ctokenCookies = { value: '' }] = responseHeaders.filter(item => item.name === 'set-cookie' && item.value.includes('ctoken='));
    const [sessionCookies = { value: '' }] = responseHeaders.filter(item => item.name === 'set-cookie' && item.value.includes('ALIPAYJSESSIONID='));
    const [ctokenValue = ''] = ctokenCookies.value.split('; ').filter(item => item.includes('ctoken='));
    const [sessionValue = ''] = sessionCookies.value.split('; ').filter(item => item.includes('ALIPAYJSESSIONID='));
    const ctoken = ctokenValue.replace('ctoken=', '');
    const ALIPAYJSESSIONID = sessionValue.replace('ALIPAYJSESSIONID=', '')
    chrome.tabs.query({ active: true, currentWindow: true }).then(([tab = {}]) => {
      if (tab.id) { tabId = tab.id }
      chrome.tabs.sendMessage(tabId, { ctoken, ALIPAYJSESSIONID }, response => {
        console.log(response)
      })
    })
  }
  return { responseHeaders: details.responseHeaders };
}, { urls: ["<all_urls>"] }, ['responseHeaders', 'extraHeaders'])