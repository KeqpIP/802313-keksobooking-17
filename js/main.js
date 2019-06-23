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

// тут добавляю disabled состояние для фильтра объявлений

filterSelectors.forEach(disableElement);

// тут добавляю disabled состояние для создания нового объявления

adFields.forEach(disableElement);

var onMainPinMouseUp = function () {
  var x = mainPinButton.offsetLeft + MainPin.WIDTH / 2;
  var y = mainPinButton.offsetTop + MainPin.HEIGHT;
  var cords = x + ' , ' + y;
  addressInput.value = cords;

  mainPinButton.removeEventListener('mouseup', onMainPinMouseUp);
};

var onMainPinClick = function () {

  mapElement.classList.remove('map--faded');

  adForm.classList.remove('ad-form--disabled');

  filterSelectors.forEach(enableElement);

  adFields.forEach(enableElement);

  addPins(mapPins, getPins(OFFERS_NUM));

  mainPinButton.removeEventListener('click', onMainPinClick);
};

mainPinButton.addEventListener('click', onMainPinClick);
mainPinButton.addEventListener('mouseup', onMainPinMouseUp);

