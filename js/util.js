'use strict';

(function (DEBOUNCE_INTERVAL) {
  var isEscapeKey = function (evt) {
    return evt.key === 'Escape' || evt.key === 'Esc';
  };

  var isEnterKey = function (evt) {
    return evt.key === 'Enter';
  };

  var setDisabled = function (element) {
    element.disabled = true;
  };

  var unsetDisabled = function (element) {
    element.disabled = false;
  };

  var showElement = function (element) {
    element.classList.remove('hidden');
  };

  var hideElement = function (element) {
    element.classList.add('hidden');
  };

  var removeElement = function (element) {
    element.remove();
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
            start.y + moveEvt.clientY - evt.clientY
        );
      };

      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();
        document.removeEventListener('mousemove', onMouseMove);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp, {once: true});
    };
  };

  var makeDragOnce = function (onDrag) {
    return function (evt) {
      evt.preventDefault();

      var onMouseDrag = function (dragEvt) {
        dragEvt.preventDefault();
        document.removeEventListener('mousemove', onMouseDrag);
        document.removeEventListener('mouseup', onMouseDrag);
        onDrag(dragEvt);
      };

      document.addEventListener('mousemove', onMouseDrag);
      document.addEventListener('mouseup', onMouseDrag);
    };
  };

  var makeFragmentRender = function (render) {
    return function (dataList) {
      var fragment = document.createDocumentFragment();
      dataList.forEach(function (data) {
        fragment.appendChild(render(data));
      });
      return fragment;
    };
  };

  var removeActivePin = function () {
    var activePin = document.querySelector('.map__pin--active');
    if (activePin !== null) {
      activePin.classList.remove('map__pin--active');
    }
  };

  var debounce = function (cb) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };

  window.util = {
    isEscEvent: function (evt, action) {
      return isEscapeKey(evt) && action();
    },

    isEnterEvent: function (evt, action) {
      return isEnterKey && action();
    },

    makeDragStart: makeDragStart,
    makeDragOnce: makeDragOnce,
    setDisabled: setDisabled,
    unsetDisabled: unsetDisabled,
    makeFragmentRender: makeFragmentRender,
    showElement: showElement,
    hideElement: hideElement,
    removeElement: removeElement,
    removeActivePin: removeActivePin,
    debounce: debounce,
  };
})(window.constants.DEBOUNCE_INTERVAL);
