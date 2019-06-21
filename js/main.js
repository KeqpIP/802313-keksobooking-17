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

var mapPins = document.querySelector('.map__pins');
var mapPin = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');

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



//тут добавляю disabled состояние для фильтра объявлений
var inputMapStatus = document.querySelectorAll('.map__filter');
  inputMapStatus.forEach(function(element) {
    element.setAttribute('disabled', 'disabled');
  });

//тут добавляю disabled состояние для создания нового объявления
var inputAdFormStatus = document.querySelectorAll('.ad-form__element');
  inputAdFormStatus.forEach(function(element) {
    element.setAttribute('disabled', 'disabled');
  });

var mapOpen = document.querySelector('.map__pin--main');

mapOpen.addEventListener('click', function(evt) {
  document.querySelector('.map').classList.remove('map--faded');

  document.querySelector('.ad-form').classList.remove('ad-form--disabled');
//не смог придумать как сделать так, чтобы этот скрипт не запускался до момента нажатия
// + потом снова не загружался каждый раз при нажатии на pin-main
// думал про проверку через if, но не смог придумать подходящее условие
  new addPins(mapPins, getPins(OFFERS_NUM));

  inputMapStatus.forEach(function(element) {
    element.removeAttribute('disabled');
  });

  inputAdFormStatus.forEach(function(element) {
    element.removeAttribute('disabled');
  });
});

mapOpen.addEventListener('mouseup', function(evt) {
    var box = mapOpen.getBoundingClientRect();
    var topPin = box.top + pageYOffset;
    var leftPin = (box.left / 2)  + pageXOffset;
    document.getElementById('address').value = leftPin  + ' , ' + topPin; //не понял почему у меня координаты слевой стороны показывают не 570
  });

