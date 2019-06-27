'use strict';

var OFFERS_NUM = 8;

var OFFER_TYPES = [
  'bungalo',
  'flat',
  'house',
  'palace',
];

// тут создаю переменные для создания границ перемещения пина, чтоб он не мог наехать на фильтр внизу карты
var ACTIVE_MAP_START = 100;
var ACTIVE_MAP_FINISH = 620;

var MapScope = {
  X: {MIN: 0, MAX: 1200},
  Y: {MIN: 130, MAX: 630},
};

var Pin = {
  WIDTH: 50,
  HEIGHT: 70,
};

var MainPin = {
  WIDTH: 62,
  HEIGHT: 84,
};

var OfferMinPrice = {
  BUNGALO: 0,
  FLAT: 1000,
  HOUSE: 5000,
  PALACE: 10000,
};

var mapPins = document.querySelector('.map__pins');
var mapPin = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');

var filterSelectors = document.querySelectorAll('.map__filter');
var adFields = document.querySelectorAll('.ad-form__element');
var mainPinButton = document.querySelector('.map__pin--main');
var mapElement = document.querySelector('.map');
var adForm = document.querySelector('.ad-form');
var addressInput = adForm.querySelector('#address');
var priceInput = adForm.querySelector('#price');
var typeSelect = adForm.querySelector('#type');
var timeInSelect = adForm.querySelector('#timein');
var timeOutSelect = adForm.querySelector('#timeout');

var getRandomItem = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var getPinIds = function (number) {
  return Array(number).fill(null).map(function (_, index) {
    index += 1;
    return index < 10
      ? '0' + index
      : String(index);
  });
};

var makePin = function (id) {
  return {
    author: {
      avatar: 'img/avatars/user' + id + '.png',
    },
    offer: {
      type: getRandomItem(OFFER_TYPES),
    },
    location: {
      x: getRandomNumber(MapScope.X.MIN, MapScope.X.MAX),
      y: getRandomNumber(MapScope.Y.MIN, MapScope.Y.MAX),
    },
  };
};

var getPins = function (number) {
  return getPinIds(number).map(makePin);
};

var renderPin = function (pin) {
  var clone = mapPin.cloneNode(true);
  var image = clone.querySelector('img');

  clone.style.left = (pin.location.x - Pin.WIDTH / 2) + 'px';
  clone.style.top = (pin.location.y - Pin.HEIGHT) + 'px';
  image.src = pin.author.avatar;
  image.alt = pin.offer.type;

  return clone;
};

var addPins = function (target, pins) {
  var fragment = document.createDocumentFragment();
  pins.forEach(function (pin) {
    fragment.appendChild(renderPin(pin));
  });

  target.appendChild(fragment);
};


var disableElement = function (element) {
  element.disabled = true;
};

var enableElement = function (element) {
  element.disabled = false;
};

var onPriceChange = function (evt) {
  var price = OfferMinPrice[evt.target.value.toUpperCase()];
  priceInput.min = price;
  priceInput.placeholder = price;
};

var onTimeInChange = function (evt) {
  timeOutSelect.value = evt.target.value;
};

var onTimeOutChange = function (evt) {
  timeInSelect.value = evt.target.value;
};

var activatePage = function () {
  mapElement.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  filterSelectors.forEach(enableElement);
  adFields.forEach(enableElement);

  timeInSelect.addEventListener('change', onTimeInChange);
  timeOutSelect.addEventListener('change', onTimeOutChange);
  typeSelect.addEventListener('change', onPriceChange);
};

var deactivatePage = function () {
  filterSelectors.forEach(disableElement);
  adFields.forEach(disableElement);
};


/* var getMainPinCoords = function () {
  return {
    x: mainPinButton.offsetLeft + MainPin.WIDTH / 2,
    y: mainPinButton.offsetTop + MainPin.HEIGHT,
  };
};

 var renderAddress = function (coords) {
  addressInput.value = coords.x + ' , ' + coords.y;
}; */


var onMainPinMouseDown = function (evtDown) {
  activatePage();
  evtDown.preventDefault();

  var startCoords = {
    x: evtDown.clientX,
    y: evtDown.clientY
  };

  var onMainPinMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };
    startCoords = {
      x: Math.min(Math.max(moveEvt.clientX, mapElement.offsetLeft), mapElement.offsetWidth + mapElement.offsetLeft),
      y: Math.min(Math.max(moveEvt.clientY, ACTIVE_MAP_START - window.scrollY - mainPinButton.offsetHeight), ACTIVE_MAP_FINISH - window.scrollY)
    };

    //вот с этим кодом мне помог знакомый
    mainPinButton.style.top = Math.min(Math.max((mainPinButton.offsetTop - shift.y), ACTIVE_MAP_START - mainPinButton.offsetHeight), ACTIVE_MAP_FINISH) + 'px';
    mainPinButton.style.left = Math.min(Math.max((mainPinButton.offsetLeft - shift.x), 0 - (mainPinButton.offsetWidth / 2)), mapElement.offsetWidth - (mainPinButton.offsetWidth / 2)) + 'px';
    addressInput.value = Math.round((mainPinButton.offsetWidth / 2) + parseInt(mainPinButton.style.left, 10)) + ', ' + parseInt(mainPinButton.style.top, 10);
  };

  var onMainPinMouseUp = function (upEvt) {
    upEvt.preventDefault();
    addPins(mapPins, getPins(OFFERS_NUM));
    document.removeEventListener('mousemove', onMainPinMouseMove);
    document.removeEventListener('mouseup', onMainPinMouseUp);

    onMapPinMainMouseup();
  };

  document.addEventListener('mousemove', onMainPinMouseMove);
  document.addEventListener('mouseup', onMainPinMouseUp);
  mainPinButton.removeEventListener('mousedown', onMainPinMouseDown);
};

mainPinButton.addEventListener('mousedown', onMainPinMouseDown);

deactivatePage();
