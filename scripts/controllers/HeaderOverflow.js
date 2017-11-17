import debounce from 'lodash/debounce';
import { Tweak } from '@squarespace/core';
import FontsLoaded from '@squarespace/fonts-loaded';
import constants from '../constants';

/**
 * Determines if the elements in the header are too wide and
 * hides/moves them when appropriate.
 */
function HeaderOverflow (element) {
  const siteHeaderNode = element.querySelector('.site-header');
  let cachedNavWidth;

  const headerSelectors = {
    header: '.site-header',
    siteTitle: '.site-branding h1',
    siteTagline: '.site-tagline',
    icon: '.nav-toggle',
    nav: '.main-navigation',
    socialNav: '.header-social-icons-with-nav',
    socialRight: '.header-social-icons-right',
    cartIcon: '.Cart--icon',
    customerAccountsIcon: '.user-accounts-link--icon'
  };

  const tweaksToWatch = [
    'tweak-site-title-font',
    'tweak-site-tagline-font',
    'tweak-nav-font',
    'tweak-logo-height',
    'tweak-header-outer-padding',
    'tweak-header-element-spacing',
    'tweak-display-social-icons',
    'tweak-social-icons-on-right',
    'tweak-nav-link-spacing',
    'tweak-nav-style',
    'tweak-menu-icon-size',
    'tweak-template-social-icon-size',
    'tweak-cart-link-display'
  ];

  /**
   * Make sure the width from getComputedStyle is a pixel value and not "auto"
   *
   * @method widthToNumber
   * @param {string} style
   * @return {Number} 0 if auto, otherwise the value.
   */
  const widthToNumber = (style) => {
    const parseStyle = parseFloat(style);
    return Number.isNaN(parseStyle) ? 0 : parseStyle;
  };

  /**
   * Get the computed widths for all the header elements
   *
   * @method getHeaderElComputedWidths
   * @return {object} headerElWidths
   */
  const getHeaderElComputedWidths = (keys) => {
    const widths = {};
    keys.forEach((key) => {
      const el = element.querySelector(headerSelectors[key]);
      if (el) {
        widths[key] = widthToNumber(window.getComputedStyle(el).width);
      } else {
        widths[key] = 0;
      }
    });

    return widths;
  };

  /**
   * Detect when elements are overflowing the header and manage classes/styles.
   *
   * @method resolveOverflows
   */
  const resolveOverflows = () => {
    const socialIconsDisplayed = Tweak.getValue('tweak-display-social-icons') === 'true';
    const cartIconDisplayed = Tweak.getValue('tweak-cart-link-display').toLowerCase() === 'icon on right';
    const customerAccountsIconDisplayed = Tweak.getValue('tweak-user-account-link-position').toLowerCase() === 'icon on right';
    const spacingMultiplier = window.innerWidth <= constants.tabletBreakpoint ? 1.5 : 1;
    const elementSpacingTweak = parseFloat(Tweak.getValue('tweak-header-element-spacing'));
    const elementSpacingPixels = elementSpacingTweak * spacingMultiplier * window.innerWidth / 100;
    const widths = getHeaderElComputedWidths(Object.keys(headerSelectors));
    const brandingWidth = widths.siteTitle + widths.siteTagline;
    let availableWidth = widths.header;
    document.body.classList.remove('mobile-style-nav', 'hide-tagline', 'move-social');

    // max available width will always be header width - icon because
    // icon is the smallest possible width for the nav.
    availableWidth -= widths.icon + elementSpacingPixels;

    // if the social icons are displayed, subtract their width from the available width.
    if (socialIconsDisplayed) {
      availableWidth -= widths.socialRight + elementSpacingPixels;
    }

    // if the cart icon is displayed, subtract their width from the available width.
    if (cartIconDisplayed) {
      availableWidth -= widths.cartIcon + elementSpacingPixels;
    }

    // if the cart icon is displayed, subtract their width from the available width.
    if (customerAccountsIconDisplayed) {
      availableWidth -= widths.customerAccountsIcon + elementSpacingPixels;
    }

    // When site title + tagline + nav are wider than available space, switch to icon/mobile nav
    if (brandingWidth + cachedNavWidth + elementSpacingPixels > availableWidth) {
      document.body.classList.add('mobile-style-nav');
    }

    // already in icon/mobile nav here, so if title + tagline wider, hide the tagline
    if (brandingWidth + elementSpacingPixels > availableWidth) {
      document.body.classList.add('hide-tagline');
    }

    // if icon/mobile nav & tagline hidden and you run out of space, move the
    // social icons into the nav if they're on the right.
    if (widths.siteTitle > availableWidth) {
      document.body.classList.add('move-social');
    }

    siteHeaderNode.classList.add('show');
  };

  /**
   * Initial render on page load, run after fontCheck, i.e., fonts are loaded.
   *
   * @method render
   */
  const render = () => {
    // cache the nav width when it's not mobile style, i.e.,
    // when it's as wide as possible.
    const computedNavWidth = window.getComputedStyle(element.querySelector('.main-navigation')).width;
    cachedNavWidth = widthToNumber(parseInt(computedNavWidth, 10));
    resolveOverflows();
  };

  const handleResize = () => {
    siteHeaderNode.classList.remove('show');
    resolveOverflows();
  };

  const debouncedResolveOverflows = debounce(handleResize, 120);

  const destroy = () => {
    siteHeaderNode.classList.remove('show');
    window.removeEventListener('resize', debouncedResolveOverflows);
  };

  const init = () => {
    const fontsLoaded = new FontsLoaded([element.querySelector('.site-branding')]);
    fontsLoaded.check().then(render);
    window.addEventListener('resize', debouncedResolveOverflows);
  };

  init();

  Tweak.watch(tweaksToWatch, resolveOverflows);

  return {
    sync: render,
    destroy
  };
}

export default HeaderOverflow;
