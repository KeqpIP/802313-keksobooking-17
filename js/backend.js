'use strict';

(function () {
  var Url = {
    POST: 'https://js.dump.academy/keksobooking',
    GET: 'https://js.dump.academy/keksobooking/data',
  };

  var Method = {
    GET: 'GET',
    POST: 'POST',
  };

  var TIMEOUT = 10000;

  var createRequest = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = TIMEOUT;
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status < 200 || xhr.status > 300) {
        onError('Данные не загрузились. Причин: ' + xhr.status + ' ' + xhr.statusText);
        return;
      }
      onLoad(xhr.response);
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    return xhr;
  };

  window.backend = {
    load: function (onLoad, onError) {
      var req = createRequest(onLoad, onError);
      req.open(Method.GET, Url.GET);
      req.send();
    },

    save: function (data, onLoad, onError) {
      var req = createRequest(onLoad, onError);
      req.open(Method.POST, Url.POST);
      req.send(data);
    },

  };
})();
