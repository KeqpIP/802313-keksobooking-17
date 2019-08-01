'use strict';
(function (load, renderPins, initFilters, showError) {

  var successHandler = function (data) {
    data.forEach(function (item, i) {
      item.id = i;
    });
    renderPins(data);
    initFilters(data);
  };

  var errorHandler = function () {
    showError(loadData, null, successHandler, errorHandler);
  };

  var loadData = function () {
    load(successHandler, errorHandler);
  };

  window.loading = {
    loadData: loadData,
  };

})(window.backend.load, window.advertPin.renderPins, window.filters.initFilters, window.notification.showError);
