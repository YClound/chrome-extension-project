/**
 * 重写ajax方法，以便在请求结束后通知content_script
 * inject_script无法直接与background通信，所以先传到content_script，再通过他传到background
 */
(function (xhr) {
  var XHR = xhr.prototype;
  var send = XHR.send;

  // 同send进行patch 获取responseData.
  XHR.send = function () {
    this.addEventListener('load', function () {
      var myUrl = this.responseURL ? this.responseURL.toLowerCase() : this.responseURL;
      if (myUrl && myUrl.includes('.alipay.com')) {
        window.postMessage({
          'url': myUrl,
          "responseHeader": {
            'Content-Type': this.getResponseHeader('Content-Type'),
            // 'req-cost-time': this.getResponseHeader('req-cost-time'),
          }
        }, '*');
      }
    });
    return send.apply(this, arguments);
  };

})(XMLHttpRequest);

(function (fetch) {
  window.fetch = async (...args) => {
    let [resource, config] = args;
    let response = await fetch(resource, {...config, headers: {...config?.headers, 'Access-Control-Expose-Headers': 'set-cookie'}});

    if (response.url.includes('service.do')) {
      console.log('fetch', args, response, response.headers.values().next())
      for (var pair of response.headers.entries()) {
        console.log(pair[0] + ': ' + pair[1], response.headers.get(pair[0]));
      }

      for (var pair1 of response.headers.values()) {
        console.log(pair1, response.headers.get('set-cookie'));
      }

      response.headers.forEach((value, key) => {
        console.log(value, key)
      })
    }

    return response;
  }
})(fetch)