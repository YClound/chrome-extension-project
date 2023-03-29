console.log('33333 monitor-helper')
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  const { ctoken, ALIPAYJSESSIONID} = req || {};
  ctoken && ALIPAYJSESSIONID && fetch(`/advertising/manage/light/crawler/account/save?ctoken=${ctoken}&ALIPAYJSESSIONID=${ALIPAYJSESSIONID}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-referer-url': 'base.test'
    }
  })
  sendResponse('接收成功')
})