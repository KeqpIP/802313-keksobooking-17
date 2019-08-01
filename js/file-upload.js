'use strict';
(function (FILE_TYPES, DEFAULT_AVATAR, PicPreviewSize, removeElement) {
  var avaChooser = document.querySelector('#avatar');
  var picChooser = document.querySelector('#images');
  var avatar = document.querySelector('.ad-form-header__preview img');
  var photoContainer = document.querySelector('.ad-form__photo-container');
  var picPreviewTemplate = document.querySelector('.ad-form__photo');
  var picDropZone = document.querySelector('.ad-form__drop-zone');
  var avatarDropZone = document.querySelector('.ad-form-header__drop-zone');

  var loadFile = function (file, cb) {
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        cb(reader.result);
      });

      reader.readAsDataURL(file);
    }
  };

  var renderPicPreview = function (url) {
    var node = document.createElement('div');
    var pic = document.createElement('img');
    pic.width = PicPreviewSize.WIDTH;
    pic.height = PicPreviewSize.HEIGHT;
    pic.style.borderRadius = PicPreviewSize.BORDER_RADIUS + 'px';
    pic.src = url;
    pic.alt = 'Фотография жилья';
    node.appendChild(pic);
    node.classList.add('ad-form__photo');
    return node;
  };

  var resetUploadedPics = function () {
    var photos = document.querySelectorAll('.ad-form__photo');
    photos.forEach(removeElement);
    photoContainer.appendChild(picPreviewTemplate);
    avatar.src = DEFAULT_AVATAR;
  };

  var onAvatarLoad = function (src) {
    avatar.src = src;
  };

  var onPicLoad = function (src) {
    picPreviewTemplate.remove();
    photoContainer.appendChild(renderPicPreview(src));
  };

  avaChooser.addEventListener('change', function () {
    loadFile(avaChooser.files[0], onAvatarLoad);
  });

  picChooser.addEventListener('change', function () {
    loadFile(picChooser.files[0], onPicLoad);
  });

  var onDrag = function (evt) {
    evt.preventDefault();
  };

  var onPicDrop = function (evt) {
    evt.preventDefault();
    loadFile(evt.dataTransfer.files[0], onPicLoad);
  };

  var onAvatarDrop = function (evt) {
    evt.preventDefault();
    loadFile(evt.dataTransfer.files[0], onAvatarLoad);
  };

  picDropZone.addEventListener('dragenter', onDrag);
  picDropZone.addEventListener('dragover', onDrag);
  picDropZone.addEventListener('drop', onPicDrop);

  avatarDropZone.addEventListener('dragenter', onDrag);
  avatarDropZone.addEventListener('dragover', onDrag);
  avatarDropZone.addEventListener('drop', onAvatarDrop);


  window.fileUpload = {
    resetUploadedPics: resetUploadedPics,
  };

})(window.constants.FILE_TYPES, window.constants.DEFAULT_AVATAR, window.constants.PicPreviewSize, window.util.removeElement);
