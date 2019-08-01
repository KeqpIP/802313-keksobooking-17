'use strict';
(function (PinSize, makeFragmentRender, removeActivePin, removeElement, showCard) {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinContainer = document.querySelector('.map__pins');

  var renderPin = function (ad) {
    var pin = pinTemplate.cloneNode(true);
    var pinAvatar = pin.querySelector('img');

    pin.style.left = ad.location.x - PinSize.WIDTH_HALF + 'px';
    pin.style.top = ad.location.y - PinSize.HEIGHT + 'px';
    pin.dataset.index = ad.id;
    pinAvatar.src = ad.author.avatar;
    pinAvatar.alt = ad.offer.title;

    pin.addEventListener('click', function () {
      onPinClick(ad);
    });

    return pin;
  };

  var makePinsFragment = makeFragmentRender(renderPin);

  var renderPins = function (data) {
    pinContainer.appendChild(makePinsFragment(data.slice(0, 5)));
  };

  var onPinClick = function (ad) {
    var currentCard = document.querySelector('.map__card');
    var currentPin = document.querySelector('.map__pin[data-index="' + ad.id + '"]');

    if (currentCard === null || currentCard.dataset.index !== ad.id) {
      showCard(ad);
      removeActivePin();
      currentPin.classList.add('map__pin--active');
    }
  };

  var removePins = function () {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    pins.forEach(removeElement);
  };

  window.advertPin = {
    renderPins: renderPins,
    removeActivePin: removeActivePin,
    removePins: removePins,
  };
})(window.constants.PinSize, window.util.makeFragmentRender, window.util.removeActivePin, window.util.removeElement, window.advertCard.showCard);
