'use strict';
(function (offerType, PhotoSize, removeActivePin, makeFragmentRender, removeElement) {
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var map = document.querySelector('.map');
  var filterContainer = map.querySelector('.map__filters-container');
  var currentCard = map.querySelector('.map__card');

  // функция отрисовки карточки на карте

  var removeOptions = function (element, option) {
    var options = element.querySelectorAll(option);
    options.forEach(removeElement);
  };

  var renderFeature = function (feature) {
    var node = document.createElement('li');
    node.classList = 'popup__feature popup__feature--' + feature;
    return node;
  };

  var renderPhoto = function (url) {
    var node = document.createElement('img');
    node.classList.add('popup__photo');
    node.width = PhotoSize.WIDTH;
    node.height = PhotoSize.HEIGHT;
    node.src = url;
    node.alt = 'Фотография жилья';
    return node;
  };

  var makeFeaturesFragment = makeFragmentRender(renderFeature);
  var makePhotosFragment = makeFragmentRender(renderPhoto);

  var setFeatures = function (featureList, features) {
    removeOptions(features, '.popup__feature');
    features.appendChild(makeFeaturesFragment(featureList));
  };

  var setPhotos = function (photoList, photos) {
    removeOptions(photos, '.popup__photo');
    photos.appendChild(makePhotosFragment(photoList));
  };

  var pluralize = function (num, one, two, five) {
    var mod100 = Math.abs(num) % 100;
    if (mod100 > 10 && mod100 < 20) {
      return five;
    }

    var mod10 = mod100 % 10;
    if (mod10 > 1 && mod10 < 5) {
      return two;
    }

    return mod10 === 1 ? one : five;
  };

  var getRoomEnding = function (offer) {
    return pluralize(offer.rooms, 'комната', 'комнаты', 'комнат');
  };

  var getGuestEnding = function (offer) {
    return pluralize(offer.guests, 'гостя', 'гостей', 'гостей');
  };

  var renderCard = function (ad) {
    var card = cardTemplate.cloneNode(true);
    var offer = ad.offer;

    card.querySelector('.popup__avatar').src = ad.author.avatar;
    card.querySelector('.popup__title').textContent = offer.title;
    card.querySelector('.popup__text--address').textContent = offer.address;
    card.querySelector('.popup__text--price').textContent = offer.price + ' ₽/ночь';
    card.querySelector('.popup__type').textContent = offerType[offer.type];
    card.querySelector('.popup__text--capacity').textContent = offer.rooms + ' ' + getRoomEnding(offer) + ' для '
                                                             + offer.guests + ' ' + getGuestEnding(offer);
    card.querySelector('.popup__text--time').textContent = 'Заезд после ' + offer.checkin + ', выезд до: ' + offer.checkout;
    card.querySelector('.popup__description').textContent = offer.description;
    card.dataset.index = ad.id;

    setFeatures(offer.features, card.querySelector('.popup__features'));
    setPhotos(offer.photos, card.querySelector('.popup__photos'));

    return card;
  };

  var closeCard = function () {
    var popupClose = document.querySelector('.popup__close');
    if (popupClose !== null) {
      map.querySelector('.map__card').remove();
      removeActivePin();
      document.removeEventListener('keydown', onCardEscPress);
      popupClose.removeEventListener('click', onCardClose);
    }
  };

  var onCardClose = function () {
    closeCard();
  };

  var onCardEscPress = function (evt) {
    window.util.isEscEvent(evt, onCardClose);
  };

  var showCard = function (data) {
    var card = renderCard(data);
    var popupClose = card.querySelector('.popup__close');

    currentCard = map.querySelector('.map__card');
    if (currentCard !== null) {
      currentCard.remove();
    }

    map.insertBefore(card, filterContainer);
    popupClose.addEventListener('click', onCardClose);
    document.addEventListener('keydown', onCardEscPress);
  };

  window.advertCard = {
    showCard: showCard,
    closeCard: closeCard,
  };
})(window.constants.offerType, window.constants.PhotoSize, window.util.removeActivePin, window.util.makeFragmentRender, window.util.removeElement);
