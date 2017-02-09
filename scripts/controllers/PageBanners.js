import debounce from 'lodash/debounce';
import { Tweak, ImageLoader } from '@squarespace/core';

/*
 * Load page banner images if necessary.
 */
function PageBanners (element) {
  let bannerImage;

  const resizeHandler = () => {
    if (bannerImage) {
      ImageLoader.load(bannerImage, {
        mode: 'fill',
        load: true
      });
    }
  };

  const debouncedResize = debounce(resizeHandler, 120);

  const sync = () => {
    bannerImage = element.querySelector('.page-banner-wrapper img');

    if (bannerImage) {
      ImageLoader.load(bannerImage, {
        mode: 'fill',
        load: true
      });
    }
  };

  const destroy = () => {
    window.removeEventListener('resize', debouncedResize);
  };

  sync();
  window.addEventListener('resize', debouncedResize);

  Tweak.watch(['tweak-page-banner-image-height', 'tweak-show-page-banner-image'], (tweak) => {
    if (bannerImage) {
      ImageLoader.load(bannerImage, {
        mode: 'fill',
        load: true
      });
    }
  });

  return {
    sync,
    destroy
  };
}

export default PageBanners;
