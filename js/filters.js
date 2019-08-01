'use strict';
(function (renderPins, PriceLimit, debounce) {
  var filters = document.querySelector('.map__filters');
  var housingTypeSelect = filters.querySelector('#housing-type');
  var housingPriceSelect = filters.querySelector('#housing-price');
  var housingRoomsSelect = filters.querySelector('#housing-rooms');
  var housingGuestsSelect = filters.querySelector('#housing-guests');
  var featureWifiCheckbox = filters.querySelector('#filter-wifi');
  var featureDishwasherCheckbox = filters.querySelector('#filter-dishwasher');
  var featureParkingCheckbox = filters.querySelector('#filter-parking');
  var featureWasherCheckbox = filters.querySelector('#filter-washer');
  var featureElevatorCheckbox = filters.querySelector('#filter-elevator');
  var featureConditionerCheckbox = filters.querySelector('#filter-conditioner');
  var adverts;

  var initFilters = function (data) {
    filters.reset();
    adverts = data;
  };

  var categorizePrice = function (price) {
    if (price < PriceLimit.MIDDLE_MIN) {
      return 'low';
    } else {
      if (price <= PriceLimit.MIDDLE_MAX) {
        return 'middle';
      } else {
        return 'high';
      }
    }
  };

  var filterHousingType = function (data) {
    if (housingTypeSelect.value === 'any') {
      return data;
    } else {
      return data.offer.type === housingTypeSelect.value;
    }
  };

  var filterHousingRooms = function (data) {
    if (housingRoomsSelect.value === 'any') {
      return data;
    } else {
      return data.offer.rooms === +housingRoomsSelect.value;
    }
  };

  var filterHousingGuests = function (data) {
    if (housingGuestsSelect.value === 'any') {
      return data;
    } else {
      return data.offer.guests === +housingGuestsSelect.value;
    }
  };

  var filterHousingPrice = function (data) {
    if (housingPriceSelect.value === 'any') {
      return data;
    } else {
      return categorizePrice(data.offer.price) === housingPriceSelect.value;
    }
  };

  var makeFeatureChecker = function (feature, code) {
    return function (data) {
      if (feature.checked) {
        return (data.offer.features.indexOf(code) !== -1);
      }
      return data;
    };
  };

  var filterWifi = makeFeatureChecker(featureWifiCheckbox, 'wifi');
  var filterDishwasher = makeFeatureChecker(featureDishwasherCheckbox, 'dishwasher');
  var filterParking = makeFeatureChecker(featureParkingCheckbox, 'parking');
  var filterWasher = makeFeatureChecker(featureWasherCheckbox, 'washer');
  var filterElevator = makeFeatureChecker(featureElevatorCheckbox, 'elevator');
  var filterConditioner = makeFeatureChecker(featureConditionerCheckbox, 'conditioner');

  var onFilterChange = debounce(
      function (evt) {
        evt.preventDefault();
        var filteredAds = adverts.filter(function (it) {
          return filterHousingType(it)
                  && filterHousingRooms(it)
                  && filterHousingGuests(it)
                  && filterHousingPrice(it)
                  && filterWifi(it)
                  && filterDishwasher(it)
                  && filterParking(it)
                  && filterWasher(it)
                  && filterElevator(it)
                  && filterConditioner(it);
        });
        window.advertPin.removePins();
        window.advertCard.closeCard();
        renderPins(filteredAds);
      });

  window.filters = {
    initFilters: initFilters,
  };

  filters.addEventListener('change', onFilterChange);

})(window.advertPin.renderPins, window.constants.PriceLimit, window.util.debounce);
