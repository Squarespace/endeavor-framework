import debounce from 'lodash/debounce';
import Autocolumns from '@squarespace/layout-autocolumns';
import Autorows from '../galleries/Autorows';
import { Tweak, ImageLoader } from '@squarespace/core';
import hasTouch from '../utils/hasTouch.js';
import constants from '../constants';

function GalleryLayout (element) {
  const imagesArray = Array.from(element.querySelectorAll('.grid-image-wrapper img'));
  let grid;
  let infoHoverTimeout;
  const gridWrapper = element.querySelector('.grid-wrapper');
  let currentViewportWidth = document.documentElement.clientWidth;

  const tweaksToWatch = [
    'tweak-gallery-gutter',
    'tweak-gallery-style',
    'tweak-full-width-first-landscape',
    'tweak-show-gallery-image-captions',
    'tweak-site-outer-padding',
    'tweak-gallery-title-overlay'
  ];

  const getTweakVals = () => {
    return {
      galleryStyle: Tweak.getValue('tweak-gallery-style').toLowerCase(),
      titleOverlaySetting: Tweak.getValue('tweak-show-gallery-title-overlay').toLowerCase(),
      gutter: Tweak.getValue('tweak-gallery-gutter'),
      isFullWidthLandscape: Tweak.getValue('tweak-full-width-first-landscape') === 'true'
    };
  };

  /**
   * After all bricks are placed, remove the hidden class on each one at an interval.
   *
   * @method gridReveal
   * @param {Array} Items you want to reveal
   * @param {Integer} Delay between revealing items in ms
   */
  const gridReveal = () => {
    const items = element.querySelectorAll('.grid-hidden');
    let i = 0;
    const interval = setInterval(() => {
      if (items[i]) {
        items[i].classList.remove('grid-hidden');
        i++;
      } else {
        clearInterval(interval);
      }
    }, 130);
  };

  /**
   * Listen for hover over the caption indicator and show the caption
   */
  const infoButtonMouseoverHandler = (e) => {
    if (e.target.classList.contains('info-button')) {
      element.querySelector('.grid-image-wrapper').classList.remove('info-view');
      const hoveredInfoButton = `[data-slide-id="${e.target.getAttribute('data-slide-id')}"]`;
      if (infoHoverTimeout) {
        clearTimeout(infoHoverTimeout);
      }
      element.querySelector('.grid-image-wrapper' + hoveredInfoButton).classList.add('info-view');
    }
  };

  /**
   * Listen for mouseout on the caption indicator and hide the caption 200ms after
   */
  const infoButtonMouseoutHandler = (e) => {
    if (e.target.classList.contains('info-button')) {
      const hoveredInfoButton = `[data-slide-id="${e.target.getAttribute('data-slide-id')}"]`;
      if (infoHoverTimeout) {
        clearTimeout(infoHoverTimeout);
      }
      infoHoverTimeout = setTimeout(() => {
        element.querySelector('.grid-image-wrapper' + hoveredInfoButton).classList.remove('info-view');
      }, 200);
    }
  };

  /**
   * On touch devices, switch to click listener.
   */
  const infoButtonClickHandler = (e) => {
    if (e.target.classList.contains('info-button')) {
      const clickedInfoButton = `[data-slide-id="${e.target.getAttribute('data-slide-id')}"]`;
      element.querySelector('.grid-image-wrapper' + clickedInfoButton).classList.toggle('info-view');
    }
  };

  /**
   * On resize, re-convert the vw gutter to pixels to pass to grid script.
   */
  const updateGutterOnResize = () => {
    if (window.innerWidth > constants.mobileBreakpoint) {
      return window.innerWidth * parseFloat(getTweakVals().gutter) / 100;
    }
  };

  /**
   * Render the gallery.
   *
   * @method render
   * @param {Boolean} shouldDestroy true = delete grid object and rebuild in new style
   */
  const render = (shouldDestroy) => {
    if (shouldDestroy && grid) {
      grid.destroy();
      grid = null;
    }

    const tweakVals = getTweakVals();
    if (window.innerWidth <= constants.mobileBreakpoint) {
      // in this case, we force stacked on small devices.
      imagesArray.forEach(function (img) {
        ImageLoader.load(img, {
          mode: null,
          load: true
        });
      });
    } else if (tweakVals.galleryStyle === 'masonry') {
      grid = new Autocolumns(gridWrapper, {
        gutter: window.innerWidth * parseFloat(tweakVals.gutter) / 100, // essentially converted to vw units
        minColumns: 2,
        maxColumns: 2,
        childSelector: '.grid-item-wrapper',
        imageWrapperSelector: '.grid-image-wrapper',
        afterLayout: gridReveal,
        autoLoadImages: true
      });
      grid.layout();
    } else if (tweakVals.galleryStyle === 'horizontal') {
      grid = new Autorows(gridWrapper, {
        gutter: window.innerWidth * parseFloat(tweakVals.gutter) / 100, // essentially converted to vw units
        columns: 2,
        childSelector: 'grid-item-wrapper',
        imgWrapperSelector: 'grid-image-wrapper',
        isFullWidthLandscape: tweakVals.isFullWidthLandscape,
        afterLayout: gridReveal,
        autoLoadImages: true
      });
      grid.layout();
    } else {
      // in this case, the images are just stacked in a single column, so just load them.
      imagesArray.forEach(function (img) {
        ImageLoader.load(img, {
          mode: null,
          load: true
        });
      });
    }
  };

  const resizeHandler = (e) => {
    // this stops resize form running when zooming on ios.
    if (document.documentElement.clientWidth === currentViewportWidth) {
      return;
    }

    if (window.innerWidth <= constants.mobileBreakpoint) {
      if (grid) {
        grid.destroy();
        grid = null;
      }
      imagesArray.forEach(function (img) {
        ImageLoader.load(img, {
          mode: null,
          load: true
        });
      });
    } else if (grid) {
      const newGutter = updateGutterOnResize();
      grid.layout({ gutter: newGutter });
    } else {
      render(false);
    }

    currentViewportWidth = document.documentElement.clientWidth;
  };

  const debouncedResize = debounce(resizeHandler, 120);

  /**
   * Bind event listeners and tweak watcher.
   *
   * @method bind
   */
  const bindEventListeners = () => {
    window.addEventListener('resize', debouncedResize);

    if (hasTouch()) {
      gridWrapper.addEventListener('click', infoButtonClickHandler);
    } else {
      gridWrapper.addEventListener('mouseover', infoButtonMouseoverHandler);
      gridWrapper.addEventListener('mouseout', infoButtonMouseoutHandler);
    }
  };

  const sync = () => {
    render(false);
  };

  const init = () => {
    render(false);
    bindEventListeners();
  };

  const destroy = () => {
    debouncedResize.cancel();
    window.removeEventListener('resize', debouncedResize);
    gridWrapper.removeEventListener('mouseover', infoButtonMouseoverHandler);
    gridWrapper.removeEventListener('mouseout', infoButtonMouseoutHandler);
    gridWrapper.removeEventListener('click', infoButtonClickHandler);
  };

  init();

  Tweak.watch(tweaksToWatch, (tweak) => {
    const renderTriggeringTweaks = [
      'tweak-gallery-style',
      'tweak-gallery-gutter',
      'tweak-site-outer-padding',
      'tweak-full-width-first-landscape'
    ];
    const needsRenderUpdate = renderTriggeringTweaks.some((name) => {
      return tweak.name === name;
    });

    if (needsRenderUpdate) {
      render(true);
    }

    if (tweak.name === 'tweak-show-gallery-image-captions') {
      gridWrapper.removeEventListener('mouseover', infoButtonMouseoverHandler);
      gridWrapper.removeEventListener('mouseout', infoButtonMouseoutHandler);
      gridWrapper.removeEventListener('click', infoButtonClickHandler);

      if (tweak.value.toLowerCase() === 'on hover' && hasTouch()) {
        gridWrapper.addEventListener('click', infoButtonClickHandler);
      } else if (tweak.value.toLowerCase() === 'on hover') {
        gridWrapper.addEventListener('mouseover', infoButtonMouseoverHandler);
        gridWrapper.addEventListener('mouseout', infoButtonMouseoutHandler);
      }
    }
  });

  return {
    sync,
    destroy
  };
}

export default GalleryLayout;
