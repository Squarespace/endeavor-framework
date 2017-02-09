import debounce from 'lodash/debounce';
import { Tweak } from '@squarespace/core';
import FontsLoaded from '@squarespace/fonts-loaded';
import constants from '../constants';

/**
 * Determines if the index elements (nav and description) are too tall for the
 * viewport and sets positions/styles if necessary.
 */
function IndexNavOverflow (element) {
  const collectionNavWrapper = element.querySelector('.collection-nav');
  const collectionNavDescWrapper = element.querySelector('.collection-nav-desc-wrapper');
  const collectionDesc = element.querySelector('.collection-desc');
  const siteHeader = document.querySelector('.site-header');

  const getSettings = () => {
    return {
      descPosition: Tweak.getValue('tweak-index-desc-position').toLowerCase(),
      descVisible: Tweak.getValue('tweak-show-index-desc') === 'true',
      hasDescription: collectionDesc !== null,
      menuDescSpacing: parseFloat(Tweak.getValue('tweak-index-menu-desc-spacing')),
      menuPadding: parseFloat(Tweak.getValue('tweak-index-menu-padding')),
      menuPosition: Tweak.getValue('tweak-index-nav-position').toLowerCase(),
      spacingMultiplier: window.innerWidth <= constants.tabletBreakpoint ? 1.5 : 1
    };
  };

  const tweaksToWatch = [
    'tweak-header-outer-padding',
    'tweak-logo-height',
    'tweak-index-menu-font',
    'tweak-site-outer-padding',
    'tweak-index-menu-font-min',
    'tweak-index-desc-font',
    'tweak-index-desc-font-min',
    'tweak-index-nav-position',
    'tweak-index-nav-layout',
    'tweak-index-menu-max-width',
    'tweak-index-menu-spacing',
    'tweak-index-menu-padding',
    'tweak-index-desc-position',
    'tweak-index-desc-max-width',
    'tweak-index-menu-desc-spacing',
    'tweak-show-index-desc'
  ];

  /**
   * Determines if content is too tall for its available space
   *
   * @method isTooTall
   * @param {Object} settings
   * @param {Boolean} isAllMiddle - are the desc and nav both set to center/middle?
   * @return {Boolean}
   */
  const isTooTall = (settings, isAllMiddle) => {
    const headerHeight = siteHeader.offsetHeight;
    const menuPadding = settings.menuPadding * window.innerWidth / 100; // converted to vw
    const windowHeight = window.innerHeight;
    const wrapper = isAllMiddle ? collectionNavDescWrapper : collectionNavWrapper;
    // if isAllMiddle, then use the whole wrapper; otherwise use the nav wrapper,
    // since if they're all middle, then desc and nav share a wrapper for positioning.

    const menuPositionMiddle = settings.menuPosition === 'left' || settings.menuPosition === 'center';

    // this will cover when both are centered vertically together or
    // when the nav is on the bottom and the desc is hidden or missing
    let availableHeight = windowHeight - headerHeight - menuPadding;

    if (settings.descVisible && settings.hasDescription && settings.descPosition === 'middle' && !isAllMiddle) {
      // desc centered vertically, nav on the bottom
      availableHeight = (windowHeight / 2) - (collectionDesc.offsetHeight / 2) - menuPadding;
    } else if (settings.descVisible && settings.hasDescription && menuPositionMiddle && !isAllMiddle) {
      // desc on the top and nav centered vertically
      availableHeight = windowHeight - (2 * collectionDesc.getBoundingClientRect().bottom);
    } else if (settings.descVisible && settings.hasDescription && !isAllMiddle) {
      // desc on the top and nav on the bottom
      availableHeight = windowHeight - collectionDesc.getBoundingClientRect().bottom - menuPadding;
    } else if (!settings.descVisible && menuPositionMiddle) {
      // desc hidden or missing and menu centered vertically
      availableHeight = windowHeight - (2 * headerHeight);
    }

    const menuHeight = wrapper.offsetHeight;
    return menuHeight > availableHeight;
  };

  const resetStyles = () => {
    collectionNavDescWrapper.classList.remove('too-tall', 'show');
    collectionNavWrapper.style.cssText = '';
    collectionNavDescWrapper.style.cssText = '';
  };

  /**
   * Repositions elements if necessary
   *
   * @method respositionIfContentTooTall
   */
  const respositionIfContentTooTall = () => {
    const settings = getSettings();
    // are both the desc and nav centered vertically?
    const isAllMiddle = settings.descPosition === 'middle' && (settings.menuPosition === 'left' || settings.menuPosition === 'center');

    // set the deafult top to the bottom of the header
    let newTop = siteHeader.offsetHeight;

    if (settings.descVisible && settings.hasDescription && settings.descPosition === 'middle' && !isAllMiddle) {
      // desc centered vertically and nav on the bottom
      newTop = (window.innerHeight / 2) + (collectionDesc.offsetHeight / 2);
    } else if (settings.descVisible && settings.hasDescription && !isAllMiddle) {
      // desc on the top and nav in either position
      newTop = collectionDesc.getBoundingClientRect().bottom;
    }

    if (isTooTall(settings, isAllMiddle)) {
      // if both are centered vertically, then use the wrapper around both to set the position;
      // otherwise, position them separately
      const wrapper = isAllMiddle ? collectionNavDescWrapper : collectionNavWrapper;

      collectionNavDescWrapper.classList.add('too-tall');
      wrapper.style.top = newTop + 'px';
      wrapper.style.bottom = 'auto';
      wrapper.style.paddingBottom = settings.menuPadding + 'vw';
    }
    // after re-positioning, then reveal
    collectionNavDescWrapper.classList.add('show');
  };

  const resizeHandler = () => {
    resetStyles();
    respositionIfContentTooTall();
  };

  const debouncedResize = debounce(resizeHandler, 120);

  const destroy = () => {
    window.removeEventListener('resize', debouncedResize);
  };

  const init = () => {
    // wait until fonts are loaded, as this will affect the sizes of elements
    const fontsLoaded = new FontsLoaded([element.querySelector('.collection-nav')]);
    fontsLoaded.check().then(respositionIfContentTooTall);
    window.addEventListener('resize', debouncedResize);
  };

  init();

  Tweak.watch(tweaksToWatch, (tweak) => {
    resetStyles();
    respositionIfContentTooTall();
  });

  return {
    destroy
  };
}

export default IndexNavOverflow;
