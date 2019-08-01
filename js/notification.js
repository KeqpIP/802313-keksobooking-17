'use strict';
(function () {
  var main = document.querySelector('main');
  var successMessageTemplate = document.querySelector('#success').content.querySelector('.success');
  var errorMessageTemplate = document.querySelector('#error').content.querySelector('.error');

  var showSuccess = function () {
    var closeSuccess = function () {
      document.removeEventListener('keydown', onSuccessEscPress);
      document.removeEventListener('click', closeSuccess);
      successMessageTemplate.remove();
    };

    var onSuccessClose = function () {
      closeSuccess();
    };

    var onSuccessEscPress = function (evt) {
      window.util.isEscEvent(evt, closeSuccess);
    };

    main.appendChild(successMessageTemplate);
    document.addEventListener('keydown', onSuccessEscPress);
    document.addEventListener('click', onSuccessClose);
  };

  var showError = function (action, data, onSuccess, onError) {
    var tryAgainButton = errorMessageTemplate.querySelector('.error__button');

    var closeError = function () {
      document.removeEventListener('keydown', onPopupEscPress);
      document.removeEventListener('click', onErrorClose);
      tryAgainButton.removeEventListener('click', action);
      errorMessageTemplate.remove();
    };

    var onErrorClose = function () {
      closeError();
    };

    var onPopupEscPress = function (evt) {
      window.util.isEscEvent(evt, closeError);
    };

    main.appendChild(errorMessageTemplate);
    document.addEventListener('keydown', onPopupEscPress);
    document.addEventListener('click', onErrorClose);
    tryAgainButton.addEventListener('click', function () {
      closeError();
      if (data === null) {
        action(onSuccess, onError);
      } else {
        action(data, onSuccess, onError);
      }
    });
  };

  window.notification = {
    showSuccess: showSuccess,
    showError: showError,
  };

})();
