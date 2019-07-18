'use strict';

var OFFERS_NUM = 8;

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

var offerTypeToMinPrice = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000,
};

var MainPinSize = {
  WIDTH: 62,
  HEIGHT: 58,
  HEIGHT_WITH_POINTER: 80,
  WIDTH_HALF: 31,
  HEIGHT_HALF: 29,
};

var MainPinRect = {
  TOP: 130,
  RIGHT: 1200 - MainPinSize.WIDTH_HALF,
  BOTTOM: 630,
  LEFT: -MainPinSize.WIDTH_HALF,
};

var offerTypes = Object.keys(offerTypeToMinPrice); // ['bungalo', 'flat', 'house', 'palace']


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
      type: getRandomItem(offerTypes),
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
  var minPrice = offerTypeToMinPrice[evt.target.value];
  priceInput.min = minPrice;
  priceInput.placeholder = minPrice;
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

var renderMainPin = function (x, y) {
  mainPinButton.style.left = x + 'px';
  mainPinButton.style.top = y + 'px';
};

var getMainPinCoords = function () {
  return {
    x: mainPinButton.offsetLeft + MainPinSize.WIDTH / 2,
    y: mainPinButton.offsetTop + MainPinSize.HEIGHT,
  };
};

var onPinStart = function () {
  return {
    x: mainPinButton.offsetLeft,
    y: mainPinButton.offsetTop,
  };
};

var onPinMove = function (x, y) {
  x = Math.min(Math.max(x, MainPinRect.LEFT), MainPinRect.RIGHT);
  y = Math.min(Math.max(y, MainPinRect.TOP), MainPinRect.BOTTOM);

  renderMainPin(x, y);
  renderAddress(getMainPinCoords(MainPinSize.HEIGHT_WITH_POINTER));
};


var onMouseDown = function (evtDown) {
  activatePage();
  evtDown.preventDefault();
};


var makeDragStart = function (onStart, onMove) {

  return function (evt) {
    evt.preventDefault();

    var start = onStart(evt);
    start.x = start.x || 0;
    start.y = start.y || 0;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      onMove(
        start.x + moveEvt.clientX - evt.clientX,
        start.y + moveEvt.clientY - evt.clientY,
      );
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      addPins(mapPins, getPins(OFFERS_NUM));
      mapElement.removeEventListener('mousemove', onMouseMove);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp, {once: true});
  };
};


var onPinDragStart = makeDragStart(
  onPinStart,
  onPinMove,
);

mainPinButton.addEventListener('mousedown', onPinDragStart);

var renderAddress = function (coords) {
  addressInput.value = coords.x + ' , ' + coords.y;
};







  mapElement.addEventListener('mousemove', onMouseMove);
  mapElement.addEventListener('mouseup', onMouseUp);
  mainPinButton.removeEventListener('mousedown', onMouseDown);

/*
mainPinButton.addEventListener('mousedown', onMouseDown); */

deactivatePage();
