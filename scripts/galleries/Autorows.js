import debounce from 'lodash/debounce';
import { ImageLoader } from '@squarespace/core';

const MODULE_CLASSES = {
  wrapperSelector: 'autorows-wrapper',
  childSelector: 'autorows-item-wrapper',
  imgWrapperSelector: 'autorows-image-wrapper'
};

const MODULE_DEFAULTS = {
  columns: 4,
  gutter: 5,
  autoLoadImages: false,
  isFullWidthLandscape: false
};

/*
 * Autorows layouts
 * This uses a custom version rather than a module since the template requires
 * custom isFullWidthLandscape tweak, where it makes the first image in a row
 * full-width if it's landscape.
 */
class Autorows {
  constructor(rootNode, config = {}) {
    this.rootNode = rootNode;
    this.config = Object.assign({}, MODULE_DEFAULTS, config);

    if (!this.rootNode.nodeName) {
      throw new Error('No root element given');
    }
    if (!rootNode.classList.contains(MODULE_CLASSES.wrapperSelector)) {
      this.rootNode.classList.add(MODULE_CLASSES.wrapperSelector);
    }

    this.items = this.setupItems();
    this.debouncedResize = debounce(this.resize.bind(this), 120);
    window.addEventListener('resize', this.debouncedResize);
  }

  /**
   * Add necessary classes to elements.
   *
   * @method setupItems
   */
  setupItems() {
    const configSelectorArray = Array.from(this.rootNode.querySelectorAll('.' + this.config.childSelector));
    configSelectorArray.forEach((selector) => {
      selector.classList.add(MODULE_CLASSES.childSelector);
      selector.querySelector('.' + this.config.imgWrapperSelector).classList.add(MODULE_CLASSES.imgWrapperSelector);
    });
  }

  /**
   * Load a given image.
   *
   * @method loadImage
   */
  loadImage(img) {
    ImageLoader.load(img, {
      mode: null,
      load: true
    });
  }

  /**
   * Gets the aspect ratio of an image.
   *
   * @param {Node} img
   * @method getImageRatio
   * @return {Integer} (height/width) * 100
   *                   100 = square
   *                   < 100 = landscape
   *                   > 100 = portrait
   */
  getImageRatio(img) {
    // this conditional is a hack to get around the fact that system placeholder
    // images get their data-image-dimensions attr set late
    if (img.getAttribute('data-image-dimensions') !== '') {
      const [ x, y ] = img.getAttribute('data-image-dimensions').split('x').map(dim => parseFloat(dim, 10));
      return 100 * y / x;
    } else {
      return 100;
    }
  }

  /**
   * Set an intrinsic padding on image wrapper.
   *
   * @param {Node} imgWrapper
   * @method setIntrinsicPadding
   */
  setIntrinsicPadding(imgWrapper) {
    const imgRatio = this.getImageRatio(imgWrapper.querySelector('img'));
    imgWrapper.style.paddingBottom = imgRatio + '%';
  }

  /**
   * Determine the relative widths of the images in a row when their heights are normalized.
   *
   * @param {Node List} imgs
   * @method getRowWidthRatios
   * @return {Array}
   */
  getRowWidthRatios(array) {
    let totalWidth = 0;
    const heightNorm = 600;

    // Push the widths and heights of the images into an array.
    const dimsArray = array.map((img) => {
      let dims;
      // this conditional is a hack to get around the fact that system placeholder
      // images get their data-image-dimensions attr set late
      if (img.getAttribute('data-image-dimensions') !== '') {
        dims = JSON.parse('[' + img.getAttribute('data-image-dimensions').split('x') + ']');
      } else {
        dims = [100, 100];
      }
      // See what the total width of the row is when all images are set to 600px tall.
      totalWidth += dims[0] * heightNorm / dims[1];
      return dims;
    });

    // Return an array with each image's width relative to the total width
    // when all image heights are normalized.
    return dimsArray.map((imgDims) => {
      let multiplier = heightNorm / imgDims[1];
      return (imgDims[0] * multiplier) / totalWidth;
    });
  }

  /**
   * Place grid items in a row.
   *
   * @param {Array} itemsArray
   * @param {Array} widthRatios
   * @param {Integer} availableWidth (total width of row/container)
   * @param {Integer} topPos (current top for row)
   * @method positionItemsInRow
   */
  positionItemsInRow(rowItemsArray, rowWidthRatios, availableWidth, topPos) {
    let left = 0;
    rowItemsArray.forEach((itemNode, i) => {
      itemNode.style.width = (rowWidthRatios[i] * availableWidth) + 'px';
      itemNode.style.left = left + 'px';
      itemNode.style.top = topPos + 'px';
      left += Math.floor(rowWidthRatios[i] * availableWidth + this.config.gutter);
    });
  }

  /**
   * After all bricks are placed, set the height on the wrapper and
   * run the afterLayout callback.
   *
   * @method afterLayout
   * @param {Integer} Final height of the wrapper
   */
  afterLayout(wrapperHeight) {
    this.rootNode.style.height = wrapperHeight + 'px';

    if (typeof this.config.afterLayout === 'function') {
      this.config.afterLayout();
    }
  }

  layout(updatedConfig = {}) {
    if (updatedConfig) {
      Object.keys(updatedConfig).forEach(prop => {
        if (this.config.hasOwnProperty(prop)) {
          this.config[prop] = updatedConfig[prop];
        }
      });
    }

    const availableWidth = this.rootNode.offsetWidth - (this.config.gutter * (this.config.columns - 1));
    const allItemsArray = Array.from(this.rootNode.querySelectorAll('.' + this.config.childSelector));
    const allImagesArray = Array.from(this.rootNode.querySelectorAll('.' + this.config.imgWrapperSelector + ' img'));

    let wrapperHeight = 0;
    let rowStart = 0;
    let rowEnd = this.config.columns;
    let topPos = 0;
    let rowItemsArray = allItemsArray.slice(rowStart, rowEnd);
    let rowImagesArray = allImagesArray.slice(rowStart, rowEnd);
    let totalItems = allItemsArray.length;

    while (totalItems > 0) {
      // If the first image in the row is a wide image, make it full-width.
      if (this.getImageRatio(rowImagesArray[0]) < 100 && this.config.isFullWidthLandscape || totalItems === 1) {
        this.setIntrinsicPadding(rowImagesArray[0].parentNode);
        rowItemsArray[0].style.width = Math.ceil(this.rootNode.offsetWidth) + 'px';
        rowItemsArray[0].style.left = '0px';
        rowItemsArray[0].style.top = topPos + 'px';

        // reset for next row
        topPos = Math.floor(rowItemsArray[0].offsetTop + rowItemsArray[0].offsetHeight + this.config.gutter - 1);
        rowStart = rowStart + 1;
        rowEnd = rowEnd + 1;
        rowItemsArray = allItemsArray.slice(rowStart, rowEnd);
        rowImagesArray = allImagesArray.slice(rowStart, rowEnd);
        totalItems--;
      } else {
        const rowWidthRatios = this.getRowWidthRatios(rowImagesArray);
        rowImagesArray.forEach((img) => {
          this.setIntrinsicPadding(img.parentNode);
        });
        this.positionItemsInRow(rowItemsArray, rowWidthRatios, availableWidth, topPos);

        // reset for next row
        topPos = Math.floor(rowItemsArray[0].offsetTop + rowItemsArray[0].offsetHeight + this.config.gutter - 1);
        rowStart = rowStart + this.config.columns;
        rowEnd = rowEnd + this.config.columns;
        totalItems -= this.config.columns;
        rowItemsArray = allItemsArray.slice(rowStart, rowEnd);
        rowImagesArray = allImagesArray.slice(rowStart, rowEnd);
      }

      wrapperHeight = topPos - this.config.gutter;
    }

    allImagesArray.forEach((img) => {
      if (this.config.autoLoadImages) {
        img.removeAttribute('data-load');
        this.loadImage(img);
      }
    });

    // Set the height of the wrapper
    // Run the afterLayout callback if provided
    this.afterLayout(wrapperHeight);
  }

  reset() {
    const children = this.rootNode.querySelectorAll('.' + this.config.childSelector);
    Array.from(children).forEach((child) => {
      child.style.top = '';
      child.style.left = '';
      child.style.width = '';
      child.querySelector('.' + this.config.imgWrapperSelector).style.paddingBottom = '';
    });

    this.rootNode.style.height = '';
  }

  resize() {
    if (typeof this.config.beforeResize === 'function') {
      this.config.beforeResize();
    }
    this.reset();
    this.layout();
  }

  destroy() {
    this.debouncedResize.cancel();
    window.removeEventListener('resize', this.debouncedResize);
    this.reset();
    this.rootNode.classList.remove(MODULE_CLASSES.wrapperSelector);
    const children = this.rootNode.querySelectorAll('.' + MODULE_CLASSES.childSelector);
    Array.from(children).forEach((child) => {
      child.classList.remove(MODULE_CLASSES.childSelector);
      child.querySelector('.' + this.config.imgWrapperSelector).classList.remove(MODULE_CLASSES.imgWrapperSelector);
    });
  }
}

export default Autorows;
