import debounce from 'lodash/debounce';
import '@squarespace/polyfills/Element/closest';
import hasTouch from '../utils/hasTouch';
import { Tweak, ImageLoader } from '@squarespace/core';
import { setActive, removeActive, getCurrentLink } from '../utils/indexUtils';

// NOTE:
// The title of the 'tweak-index-inactive-on-load' tweak no longer accurately
// describes what it's doing. See README for more info.
const tweaksToWatch = [
  'tweak-index-inactive-on-load',
  'tweak-index-slideshow-on',
  'tweak-hide-index-desc-on-hover'
];

/**
 * Indicates whether an element is the initially active element. This is useful
 * for index nav, where on mouseleave, the active state reverts to the initially
 * active element.
 *
 * NOTE: .active-page refers to the initially active element, while .active
 * refers to the currently active element.
 *
 * @param  {HTMLElement} el   Element to check
 * @return {Boolean}          Whether or not it's initially active
 */
const isInitiallyActive = (el) => el.classList.contains('active-page');

/*
 * Set up the Index view, whether on Index List (index.list) or Index Nav
 * (index-navigation.block, which displays at the bottom of pages that appear
 * within the index).
 */
function IndexSetup(element) {
  const collectionNav = element.querySelector('.collection-nav');
  const links = Array.from(element.querySelectorAll('.collection-nav-item'));
  const imageContainers = Array.from(element.querySelectorAll('.collection-images .image-container'));
  const images = Array.from(element.querySelectorAll('.collection-images .image-container img[data-src]'));
  const hideDescOnHover = Tweak.getValue('tweak-hide-index-desc-on-hover') === 'true';
  const slideshowActive = Tweak.getValue('tweak-index-slideshow-on') === 'true';

  const initiallyActiveLink = links.find(isInitiallyActive);
  const initiallyActiveImageContainer = imageContainers.find(isInitiallyActive);

  /**
   * Whether or not you should show the first element i.e. is the tweak checked,
   * and is it the Index List?
   * @return {Boolean}
   */
  const shouldShowTitleCard = () => {
    const tweakOn = Tweak.getValue('tweak-index-inactive-on-load') === 'true';
    return tweakOn && !element.classList.contains('index-item-navigation');
  };

  /**
   * Mouseover handler. If the target is one of the spans inside the link, set
   * that to active and remove the active state from the rest of the elements.
   *
   * @param  {Object} e   event object
   */
  const handleMouseover = (e) => {
    if (e.target.classList.contains('collection-nav-item-span')) {
      const currentLink = e.target.closest('[data-url-id]');
      const urlId = currentLink.getAttribute('data-url-id');
      const currentImage = element.querySelector(`.collection-images .image-container[data-url-id="${urlId}"]`);

      links.forEach(removeActive);
      imageContainers.forEach(removeActive);

      setActive(currentLink);
      setActive(currentImage);
      element.classList.add('nav-hovered');
      if (hideDescOnHover) {
        element.classList.add('hide-desc');
      }
    }
  };

  /**
   * Mouse leave handler. Remove all active states, and revert back to initial.
   * If we're on Index List and the tweak for first-image is checked, revert
   * back to the first image. If this is Index Nav, go back to the link that was
   * initially active (i.e. the current collection within the index).
   */
  const handleMouseleave = () => {
    links.forEach(removeActive);
    imageContainers.forEach(removeActive);

    if (!slideshowActive || element.classList.contains('index-item-navigation')) {
      if (initiallyActiveLink) {
        setActive(initiallyActiveLink);
        setActive(initiallyActiveImageContainer);
      } else if (shouldShowTitleCard()) {
        setActive(imageContainers[0]);
      } else {
        setActive(imageContainers[1]);
        setActive(getCurrentLink(imageContainers[1], links));
      }
    }
    element.classList.remove('nav-hovered');
    if (!slideshowActive) {
      element.classList.remove('hide-desc');
    }
  };

  /**
   * Load all images in the images array.
   */
  const loadImages = () => {
    images.forEach((image) => {
      ImageLoader.load(image, {
        mode: 'fill',
        load: true
      });
    });
  };

  const resizeHandler = () => {
    element.style.height = window.innerHeight + 'px';
    loadImages();
  };

  const debouncedResize = debounce(resizeHandler, 120);

  const bindListeners = () => {
    collectionNav.addEventListener('mouseover', handleMouseover);
    collectionNav.addEventListener('mouseleave', handleMouseleave);
    window.addEventListener('resize', debouncedResize);
  };

  const destroy = () => {
    collectionNav.removeEventListener('mouseover', handleMouseover);
    collectionNav.removeEventListener('mouseleave', handleMouseleave);
    window.removeEventListener('resize', debouncedResize);
  };

  /**
   * Init. Set a height for the element, bind event listeners, load images, and,
   * if we should show the first image, set the first image to active.
   */
  const init = () => {
    if (hasTouch()) {
      element.classList.add('has-touch');
    }
    element.style.height = window.innerHeight + 'px';
    bindListeners();
    loadImages();
    if (element.classList.contains('index-item-navigation') && initiallyActiveLink) {
      setActive(initiallyActiveLink);
      setActive(initiallyActiveImageContainer);
    } else if (shouldShowTitleCard()) {
      setActive(imageContainers[0]);
    } else {
      setActive(imageContainers[1]);
      setActive(getCurrentLink(imageContainers[1], links));
    }
  };

  const updateOnTweakChange = () => {
    destroy();
    bindListeners();
    links.forEach(removeActive);
    imageContainers.forEach(removeActive);
    if (shouldShowTitleCard()) {
      setActive(imageContainers[0]);
    } else {
      setActive(imageContainers[1]);
      setActive(getCurrentLink(imageContainers[1], links));
    }
  };

  Tweak.watch(tweaksToWatch, updateOnTweakChange);

  init();

  return {
    destroy
  };
}

export default IndexSetup;
