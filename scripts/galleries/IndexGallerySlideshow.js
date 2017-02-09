import { setActive, removeActive, getCurrentLink } from '../utils/indexUtils';

const collectionNavSelector = '.collection-nav';

/**
 * Makes the Index List view rotate between all its "slides" (including the
 * collection mainImage, if relevant).
 */
class IndexGallerySlideshow {

  /**
   * @param  {HTMLElement}  rootNode                 Element from controller
   * @param  {Object}       config
   * @param  {Number}       config.slideshowDelay    Amount of time for each slide in ms
   * @param  {String}       config.selector          image container selector
   * @param  {String}       config.titleCardSelector selector for the title card
   */
  constructor(rootNode, config = {}) {
    this.rootNode = rootNode;
    this.config = config;

    this.imageWrappers = Array.from(rootNode.querySelectorAll(config.selector));
    this.collectionNav = rootNode.querySelector(collectionNavSelector);
    this.collectionLinks = Array.from(rootNode.querySelectorAll(collectionNavSelector + ' div'));
    this.slideInterval = null;
    this._currentSlide = 0;

    this.boundHandleMouseover = this.handleMouseover.bind(this);
    this.boundHandleMouseleave = this.handleMouseleave.bind(this);
  }

  /**
   * Getter for this._currentSlide
   * @return {Number} Current slide index
   */
  get currentSlide() {
    return this._currentSlide;
  }

  /**
   * Setter for this._currentSlide. Sets the private property, removes active
   * state from all els and applies to current el.
   * @param {Number} slide  Index to set the currentSlide to
   */
  set currentSlide(slide) {
    this._currentSlide = slide || 0;

    this.imageWrappers.forEach(removeActive);
    this.collectionLinks.forEach(removeActive);

    setActive(this.imageWrappers[slide]);
    setActive(getCurrentLink(this.imageWrappers[slide], this.collectionLinks));

    if (typeof this.config.afterSetSlide === 'function') {
      this.config.afterSetSlide(this.imageWrappers[slide], slide);
    }
  }

  /**
   * Start playing the slideshow. Can be called at init, or after pausing.
   */
  startSlideshow() {
    this.rootNode.classList.remove('animation-paused');

    this.slideInterval = setInterval(() => {
      if (typeof this.currentSlide === 'number' && this.currentSlide < this.imageWrappers.length - 1) {
        this.currentSlide++;
      } else {
        this.currentSlide = 0;
      }
    }, this.config.slideshowDelay);
  }

  /**
   * Mouseover handler. Pauses slideshow when hovering over link.
   * @param  {Object} e   eventObject from event handler
   */
  handleMouseover(e) {
    if (e.target.classList.contains('collection-nav-item-span')) {
      if (this.slideInterval) {
        clearInterval(this.slideInterval);
      }
      this.rootNode.classList.add('animation-paused');
    }
  }

  /**
   * Mouseleave handler. Resumes slideshow.
   */
  handleMouseleave() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    setActive(this.imageWrappers[this.currentSlide]);
    setActive(getCurrentLink(this.imageWrappers[this._currentSlide], this.collectionLinks));
    this.startSlideshow();
  }

  /**
   * Destructor. Unbinds event listeners, remove active classnames, clears interval.
   */
  destroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    this.collectionNav.removeEventListener('mouseover', this.boundHandleMouseover);
    this.collectionNav.removeEventListener('mouseleave', this.boundHandleMouseleave);
  }

  /**
   * Initializer. Starts slideshow and adds event listeners.
   */
  init() {
    this.startSlideshow();
    this.collectionNav.addEventListener('mouseover', this.boundHandleMouseover);
    this.collectionNav.addEventListener('mouseleave', this.boundHandleMouseleave);
  }
}

module.exports = IndexGallerySlideshow;
