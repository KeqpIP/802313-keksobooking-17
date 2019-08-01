'use strict';
(function (offerTypeToMinPrice, PalaceCode, showElement, hideElement, setDefault, removePins, closeCard, resetUploadedPics, save, disactivate, showSuccess, showError) {
  var adForm = document.querySelector('.ad-form');
  var filtersForm = document.querySelector('.map__filters');
  var placeTypeInput = adForm.querySelector('#type');
  var priceInput = adForm.querySelector('#price');
  var timeInSelect = adForm.querySelector('#timein');
  var timeOutSelect = adForm.querySelector('#timeout');
  var roomNumberInput = adForm.querySelector('#room_number');
  var capacityInput = adForm.querySelector('#capacity');
  var cleanFormButton = adForm.querySelector('.ad-form__reset');

  // определяем минимальное значение цены

  var onTypeChange = function () {
    var minPrice = offerTypeToMinPrice[placeTypeInput.value];
    priceInput.min = minPrice;
    priceInput.placeholder = minPrice;
  };

  // синхронизация времени заезда и времени выезда

  var onTimeInChange = function () {
    timeOutSelect.value = timeInSelect.value;
  };

  var onTimeOutChange = function () {
    timeInSelect.value = timeOutSelect.value;
  };

  var onCapacityChange = function () {
    validateGuests();
  };

  // зависимость количества гостей от количества комнат

  var onRoomChange = function () {
    var roomNumber = +roomNumberInput.value;
    for (var i = 0; i < capacityInput.options.length; i++) {
      var capacityOption = capacityInput.options[i];
      if (+capacityOption.value > roomNumber) {
        hideElement(capacityOption);
      } else {
        showElement(capacityOption);
      }
      if (roomNumber === PalaceCode.ROOMS) {
        showElement(capacityInput.options[capacityInput.options.length - 1]);
      }
    }
    validateGuests();
  };

  var validateGuests = function () {
    if (checkCapacity() === false) {
      capacityInput.setCustomValidity('Некорректное соотношение гостей и комнат');
    } else {
      capacityInput.setCustomValidity('');
    }
  };

  var checkCapacity = function () {
    var roomNumber = +roomNumberInput.value;
    var capacity = +capacityInput.value;
    if (roomNumber === PalaceCode.ROOMS) {
      if (capacity === PalaceCode.CAPACITY) {
        return true;
      } else {
        return false;
      }
    } else {
      if (capacity <= roomNumber) {
        return true;
      } else {
        return false;
      }
    }
  };

  var initForm = function () {
    onTypeChange();
    onTimeInChange();
    onRoomChange();
  };

  var resetPage = function () {
    adForm.reset();
    resetUploadedPics();
    filtersForm.reset();
    cleanMap();
    disactivate();
    setDefault();
  };

  var onClearFormClick = function () {
    resetPage();
  };

  var cleanMap = function () {
    removePins();
    closeCard();
  };

  var onSuccess = function () {
    resetPage();
    showSuccess();
  };

  var onError = function () {
    showError(save, new FormData(adForm), onSuccess, onError);
  };

  placeTypeInput.addEventListener('change', onTypeChange);
  timeInSelect.addEventListener('change', onTimeInChange);
  timeOutSelect.addEventListener('change', onTimeOutChange);
  roomNumberInput.addEventListener('change', onRoomChange);
  capacityInput.addEventListener('change', onCapacityChange);
  cleanFormButton.addEventListener('click', onClearFormClick);
  adForm.addEventListener('submit', function (evt) {
    save(new FormData(adForm), onSuccess, onError);
    evt.preventDefault();
  });

  window.form = {
    initForm: initForm,
  };

})(window.constants.offerTypeToMinPrice,
    window.constants.PalaceCode,
    window.util.showElement,
    window.util.hideElement,
    window.mainPin.setDefault,
    window.advertPin.removePins,
    window.advertCard.closeCard,
    window.fileUpload.resetUploadedPics,
    window.backend.save,
    window.init.disactivate,
    window.notification.showSuccess,
    window.notification.showError);

