/**
  * Creates a new image lightbox
  * @constructor
  */
function ImageLightbox() {
  /** @private */ this.lightboxData = [];
  /** @private */ this.lightboxPage = 0;
  /** @private */ this.lightbox = document.querySelector('.gg__lightbox');
  /** @private */ this.pagerButtons = this.lightbox.querySelectorAll('.gg__button--small');

  this._setEventListeners();
}


/**
  * Public setter for setting lightboxData
  * @param {object} imageData An object containing url and source
  */
ImageLightbox.prototype.setLightboxData = function(imageData) {
  this.lightboxData = imageData;
}


/**
  * Opens the lightbox and begins transition to the first item in lightboxData
  */
ImageLightbox.prototype.openLightbox = function() {
  this.lightbox.className = 'gg__lightbox';
  this.lightbox.setAttribute('aria-hidden', 'false');
  this.lightbox.setAttribute('tabindex', '0');

  this.lightbox.querySelector('[data-lightbox-role="image"]').addEventListener('load', this._resetImageLoadingState.bind(this));
}


/**
  * Closes the lightbox, resets initial state.
  */
ImageLightbox.prototype.closeLightbox = function() {
  this.lightbox.className = 'gg__lightbox gg__lightbox--hidden';
  this.lightbox.setAttribute('aria-hidden', 'true');
  this.lightbox.setAttribute('tabindex', '-1');

  this._setLightboxPage(0);
  this.setLightboxData([])

  this.lightbox.querySelector('[data-lightbox-role="image"]').removeEventListener('load', this._resetImageLoadingState);
  this.lightbox.querySelector('.gg__lightbox__close').removeEventListener('click', this.closeLightbox);

  document.querySelector('[data-lightbox-role="title"]').innerHTML = '';
  document.querySelector('[data-lightbox-role="image"]').setAttribute('src', '');
  document.querySelector('[data-lightbox-role="image-source"]').innerHTML = '';
}


/**
  * Updates the lightbox DOM to show the next or previous image
  * @param {number} page How many pages to increment/decrement
  */
ImageLightbox.prototype.pageLightbox = function(page) {
  this._setLightboxPage(this.lightboxPage += page);

  var imageData = this.lightboxData[this.lightboxPage - 1];

  document.querySelector('[data-lightbox-role="title"]').innerHTML = 'Gif ' + this.lightboxPage + ' of ' + this.lightboxData.length;
  document.querySelector('[data-lightbox-role="image"]').setAttribute('src', imageData.url);
  document.querySelector('[data-lightbox-role="image-source"]').innerHTML = 'Source: ' + imageData.source;

  if (this.lightboxPage === 1) {
    document.querySelector('[data-lightbox-page-direction="previous"]').style.display = 'none';
    return;
  }

  if (this.lightboxPage === this.lightboxData.length) {
    document.querySelector('[data-lightbox-page-direction="next"]').style.display = 'none';
    return;
  }

  document.querySelector('[data-lightbox-page-direction="previous"]').style.display = 'inline-block';
  document.querySelector('[data-lightbox-page-direction="next"]').style.display = 'inline-block';
}


/**
  * Resets the image class name to no longer include loading state modifier
  * @private
  */
ImageLightbox.prototype._resetImageLoadingState = function() {
  this.lightbox.querySelector('.gg__lightbox__image-container').className = 'gg__lightbox__image-container';
}


/**
  * Sets up event listeners for lightbox
  * @private
  */
ImageLightbox.prototype._setEventListeners = function() {

  this.pagerButtons.forEach(function(pager) {
    pager.addEventListener('click', this._startLightboxTransition.bind(this));
  }.bind(this));

  this.lightbox.querySelector('.gg__lightbox__close').addEventListener('click', this.closeLightbox.bind(this));
}


/**
  * Begings the process of paging to the appropriate lightbox item
  * @private
  * @param {Event} event native HTML event
  */
ImageLightbox.prototype._startLightboxTransition = function(event) {
  var increment = Number(event.target.dataset.pageAmount);
  this.lightbox.querySelector('.gg__lightbox__image-container').className = 'gg__lightbox__image-container gg__lightbox__image-container--loading';

  this.pageLightbox(increment);
}


/**
  * Updates private param lightboxPage
  * @private
  * @param {number} page new page number
  */
ImageLightbox.prototype._setLightboxPage = function(page) {
  this.lightboxPage = page;
}
