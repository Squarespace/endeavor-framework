import { Tweak } from '@squarespace/core';
import IndexGallerySlideshow from '../galleries/IndexGallerySlideshow';
import hasTouch from '../utils/hasTouch';

const shouldShowTitleCard = () => Tweak.getValue('tweak-index-inactive-on-load') === 'true';
const hideDescDuringSlideshow = () => Tweak.getValue('tweak-hide-index-desc-on-hover') === 'true';
const isSlideshowOn = () => Tweak.getValue('tweak-index-slideshow-on') === 'true';
const isSlideshowTouchOn = () => Tweak.getValue('tweak-index-slideshow-touch-on') === 'true';
const getSlideshowDelay = () => parseFloat(Tweak.getValue('tweak-index-slideshow-delay')) * 1000;

const getGallerySlideshowSelector = () => {
  if (shouldShowTitleCard()) {
    return '.collection-images .image-container';
  }
  return '.collection-images .image-container:not(.index-main-image)';
};

/**
 * Passthrough controller that initializes an instance of IndexGallerySlideshow,
 * which makes the Index List view rotate between each of its "slides".
 */
function IndexGallery(element) {
  let slideshow;

  // NOTE:
  // The title of the 'tweak-index-inactive-on-load' tweak no longer accurately
  // describes what it's doing. See README for more info.
  const tweaksToWatch = [
    'tweak-site-outer-padding',
    'tweak-index-slideshow-on',
    'tweak-index-slideshow-delay',
    'tweak-index-inactive-on-load'
  ];

  const titleCard = element.querySelector('.index-main-image');

  const syncSlideshow = () => {
    element.classList.remove('hide-desc');
    if (isSlideshowOn() || hasTouch() && isSlideshowTouchOn()) {
      if (slideshow) {
        slideshow.destroy();
      }
      slideshow = new IndexGallerySlideshow(element, {
        selector: getGallerySlideshowSelector(),
        slideshowDelay: getSlideshowDelay(),
        afterSetSlide: (currentSlide) => {
          const isTitleCard = currentSlide === titleCard;
          if (hideDescDuringSlideshow() && !isTitleCard) {
            element.classList.add('hide-desc');
          } else {
            element.classList.remove('hide-desc');
          }
        }
      });
      slideshow.init();
    } else if (slideshow) {
      slideshow.destroy();
    }
  };

  const destroy = () => {
    if (slideshow) {
      slideshow.destroy();
    }
  };

  Tweak.watch(tweaksToWatch, syncSlideshow);

  syncSlideshow();

  return {
    destroy
  };
}

export default IndexGallery;
