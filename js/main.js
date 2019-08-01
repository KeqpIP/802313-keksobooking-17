'use strict';
(function () {
  window.init.disactivate();
  window.form.initForm();
  window.mainPin.renderAddress(window.mainPin.getMainPinCoords(window.constants.MainPinSize.RADIUS));
})();
