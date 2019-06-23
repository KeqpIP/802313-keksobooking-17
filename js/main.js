'use strict';

var OFFERS_NUM = 8;

var OFFER_TYPES = [
  'bungalo',
  'flat',
  'house',
  'palace',
];

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

var MIN_PRICES = {
  'bungalo': '0',
  'flat': '1000',
  'house': '5000',
  'palace': '10000'
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

var onTypeClickSelectChange = function (evt) {
  priceInput.placeholder = MIN_PRICES[evt.target.value];
  priceInput.min = MIN_PRICES[evt.target.value];
};

var onTimeClickSelectChange = function (evt) {
  if (evt.target.name === 'timein') {
    timeOutSelect.value = evt.target.value;
  } else {
    timeInSelect.value = evt.target.value;
  }
};

var changeTimeSelect = function () {
  timeInSelect.addEventListener('change', onTimeClickSelectChange);
  timeOutSelect.addEventListener('change', onTimeClickSelectChange);
};

var changeTypeRoomSelect = function () {
  typeSelect.addEventListener('change', onTypeClickSelectChange);
};

var activatePage = function () {
  mapElement.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  filterSelectors.forEach(enableElement);
  adFields.forEach(enableElement);
  addPins(mapPins, getPins(OFFERS_NUM));
  changeTimeSelect();
  changeTypeRoomSelect();
};

var deactivatePage = function () {
  filterSelectors.forEach(disableElement);
  adFields.forEach(disableElement);
};
deactivatePage();

var getCoordsPin = function () {
  return {
    x: mainPinButton.offsetLeft + MainPin.WIDTH / 2,
    y: mainPinButton.offsetTop + MainPin.HEIGHT,
  };
};

var renderAddress = function (cords) {
  addressInput.value = cords.x + ' , ' + cords.y;
};

var onMainPinMouseUp = function () {
  renderAddress(getCoordsPin());
  mainPinButton.removeEventListener('mouseup', onMainPinMouseUp);
};

var onMainPinClick = function () {
  activatePage();

  mainPinButton.removeEventListener('click', onMainPinClick);
};

mainPinButton.addEventListener('click', onMainPinClick);
mainPinButton.addEventListener('mouseup', onMainPinMouseUp);
