import debounce from 'lodash/debounce';
import '@squarespace/polyfills/Element/matches';
import { Tweak } from '@squarespace/core';

/*
 * Positions the main content below the fixed header.
 */
function MainContentPositioning (element) {
  const mainContent = element.querySelector('.main-content');
  const siteHeader = element.querySelector('.site-header');

  const setMainContentTopPadding = () => {
    // gallery and index have unique layouts, so no need to position.
    const isGalleryOrIndex = element.classList.contains('collection-type-gallery') ||
                             element.classList.contains('collection-type-index');

    mainContent.style.paddingTop = '';

    // is there a banner image and is it visible based on tweaks?
    // main content sits below it if so, so no need to position.
    const isBannerVisible = element.matches('.tweak-show-page-banner-image-always.has-main-image:not(.view-item)') ||
      element.matches('.tweak-show-page-banner-image-in-index.has-index-nav.has-main-image:not(.view-item)') ||
      element.matches('.tweak-show-page-banner-image-not-in-index:not(.has-index-nav).has-main-image:not(.view-item)');

    if (isGalleryOrIndex || isBannerVisible) {
      return;
    }

    const headerHeight = siteHeader.offsetHeight;

    mainContent.style.paddingTop = headerHeight + 'px';
  };

  const debouncedResize = debounce(setMainContentTopPadding, 120);

  const tweaksToWatch = [
    'tweak-header-outer-padding',
    'tweak-display-social-icons',
    'tweak-site-title-font',
    'tweak-site-tagline-font',
    'tweak-logo-height',
    'tweak-nav-font',
    'tweak-menu-icon-size',
    'tweak-nav-style',
    'tweak-template-social-icon-size',
    'tweak-show-page-banner-image'
  ];

  const destroy = () => {
    window.removeEventListener('resize', debouncedResize);
  };

  setMainContentTopPadding();
  window.addEventListener('resize', debouncedResize);

  Tweak.watch(tweaksToWatch, setMainContentTopPadding);

  return {
    sync: setMainContentTopPadding,
    destroy
  };
}

export default MainContentPositioning;
