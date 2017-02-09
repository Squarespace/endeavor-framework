import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';
import { Tweak } from '@squarespace/core';

/*
 * Handles positioning of title/desc in overlay on collections
 * as well as the scroll and click listeners that dismiss the overlay.
 */
function TitleCardHandler (element) {
  const tweaksToWatch = [
    'tweak-show-gallery-title-overlay',
    'tweak-show-page-title-overlay',
    'tweak-header-outer-padding',
    'tweak-display-social-icons',
    'tweak-site-title-font',
    'tweak-site-tagline-font',
    'tweak-logo-height',
    'tweak-nav-font',
    'tweak-menu-icon-size',
    'tweak-nav-style',
    'tweak-template-social-icon-size',
    'tweak-gallery-title-position',
    'tweak-page-title-position'
  ];

  const titleDescInerWrapper = element.querySelector('.title-desc-inner-wrapper');
  const titleCard = element.querySelector('.title-card');
  const isGallery = document.body.classList.contains('collection-type-gallery');

  const getHeaderHeight = () => {
    return document.querySelector('.site-header').offsetHeight;
  };

  const setMarginIfTop = () => {
    // are you in a gallery or other collection?
    const tweakName = isGallery ? 'tweak-gallery-title-position' : 'tweak-page-title-position';
    const titleIsTop = Tweak.getValue(tweakName).toLowerCase().indexOf('top') >= 0;

    // if the title/desc are not positioned on the top, no need to set padding.
    if (!titleIsTop) {
      titleDescInerWrapper.style.marginTop = '';
      return;
    }

    titleDescInerWrapper.style.marginTop = getHeaderHeight() + 'px';
  };

  /*
   * Dismiss the overlay once you start scrolling and re-show when you scroll
   * back to the top of the page.
   */
  const hideTitleCardOnScroll = () => {
    if (window.pageYOffset > 0) {
      element.classList.add('hide-title-card');
    } else {
      element.classList.remove('hide-title-card');
    }
  };

  /*
   * Dismiss the overlay when you click it.
   */
  const handleTitleCardClick = () => {
    element.classList.add('hide-title-card');
  };

  const debouncedResize = debounce(setMarginIfTop, 120);
  const throttledScroll = throttle(hideTitleCardOnScroll, 10);

  const bindEventListeners = () => {
    window.addEventListener('scroll', throttledScroll);
    titleCard.addEventListener('click', handleTitleCardClick);
    window.addEventListener('resize', debouncedResize);
  };

  const determineEventListeners = () => {
    const titleOverlaySetting = isGallery ?
      Tweak.getValue('tweak-show-gallery-title-overlay').toLowerCase() :
      Tweak.getValue('tweak-show-page-title-overlay').toLowerCase();

    if (titleOverlaySetting !== 'never') {
      bindEventListeners();
    }
  };

  const destroy = () => {
    window.removeEventListener('scroll', throttledScroll);
    titleCard.removeEventListener('click', handleTitleCardClick);
    window.removeEventListener('resize', debouncedResize);
  };

  const init = () => {
    setMarginIfTop();
  };

  init();
  determineEventListeners();

  Tweak.watch(tweaksToWatch, (tweak) => {
    if (tweak.name === 'tweak-show-gallery-title-overlay' || tweak.name === 'tweak-show-page-title-overlay') {
      destroy();

      if (tweak.value.toLowerCase() !== 'never') {
        bindEventListeners();
      }
    } else {
      setMarginIfTop();
    }
  });

  return {
    destroy
  };
}

export default TitleCardHandler;
