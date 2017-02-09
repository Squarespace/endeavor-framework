import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';
import imagesLoaded from 'imagesloaded';

/**
 * 1. Hides the index nav under the content until you start to scroll to keep
 *    it from bleeding through.
 * 2. keeps the index nav from being scrollable until you are 20 pixels from the
 *    bottom of the page, so you don't end up with 2 scrollable elements.
 */
function IndexNavScroll (element) {
  let pageScrollHeight;

  const respondToScroll = () => {
    const pos = window.pageYOffset;

    if (pos >= pageScrollHeight - 20) {
      element.classList.add('scrollable');
    } else {
      element.classList.remove('scrollable');
    }
  };

  const throttleScroll = throttle(respondToScroll, 10);

  const init = () => {
    pageScrollHeight = document.querySelector('.content-outer-wrapper').offsetHeight;
    window.addEventListener('scroll', throttleScroll);
  };

  const resizeHandler = () => {
    window.removeEventListener('scroll', throttleScroll);
    init();
  };

  const debouncedResize = debounce(resizeHandler, 120);

  const destroy = () => {
    window.removeEventListener('scroll', throttleScroll);
    window.removeEventListener('resize', debouncedResize);
  };

  window.addEventListener('resize', debouncedResize);

  imagesLoaded(document.querySelector('.content-outer-wrapper'), () => {
    init();
  });

  return {
    destroy
  };

}

export default IndexNavScroll;
