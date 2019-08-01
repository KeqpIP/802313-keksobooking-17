'use strict';
(function (makeDragStart, makeDragOnce, activate, MapArea, MainPinSize) {
  var mainPin = document.querySelector('.map__pin--main');
  var address = document.querySelector('#address');
  var mainPinDefaultPosition = {
    x: mainPin.style.left,
    y: mainPin.style.top,
  };

  var renderMainPin = function (x, y) {
    mainPin.style.left = x + 'px';
    mainPin.style.top = y + 'px';
  };

  var getMainPinCoords = function (point) {
    return {
      x: mainPin.offsetLeft + MainPinSize.RADIUS,
      y: mainPin.offsetTop + point,
    };
  };

  var renderAddress = function (coords) {
    address.value = coords.x + ', ' + coords.y;
  };

  var onPinStart = function () {
    return {
      x: mainPin.offsetLeft,
      y: mainPin.offsetTop,
    };
  };

  var onPinMove = function (x, y) {
    x = Math.min(Math.max(x, MapArea.LEFT), MapArea.RIGHT);
    y = Math.min(Math.max(y, MapArea.TOP), MapArea.BOTTOM);

    renderMainPin(x, y);
    renderAddress(getMainPinCoords(MainPinSize.HEIGHT));
  };

  var onPinDragStart = makeDragStart(onPinStart, onPinMove);

  var onPinChange = function () {
    activate();
    renderAddress(getMainPinCoords(MainPinSize.HEIGHT));
  };

  var onPinDragOnce = makeDragOnce(onPinChange);

  var setDefault = function () {
    mainPin.style.left = mainPinDefaultPosition.x;
    mainPin.style.top = mainPinDefaultPosition.y;
    renderAddress(getMainPinCoords(MainPinSize.RADIUS));
    mainPin.addEventListener('mousedown', onPinDragOnce, {once: true});
  };

  mainPin.addEventListener('mousedown', onPinDragOnce, {once: true});
  mainPin.addEventListener('mousedown', onPinDragStart);

  window.mainPin = {
    renderAddress: renderAddress,
    getMainPinCoords: getMainPinCoords,
    setDefault: setDefault,
    onPinDragOnce: onPinDragOnce,
  };

})(window.util.makeDragStart, window.util.makeDragOnce, window.init.activate, window.constants.MapArea, window.constants.MainPinSize);
