import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';

/**
 * This controller listens to a scroll event and:
 * 1. determines if the header should be hidden or not
 *    - it's hidden if you're scrolled down the pageSize
 *    - it's un-hidden once you start scrolling back up or if you've reached the
 *      bottom of a page with the index nav
 * 2. swaps the header color when you reach the bottom of a page with an index nav
 *    since it will now be over an image (essentially mimicking the index itself).
 */
function HeaderScroll (element) {
  let startingScroll;
  const siteHeader = element.querySelector('.site-header');

  const respondToScroll = () => {
    const pos = window.pageYOffset;
    const pageScrollHeight = element.offsetHeight;

    if (pos > 0) {
      siteHeader.classList.add('hide-header');
    }

    if (pos < startingScroll || pos >= pageScrollHeight || pos === 0) {
      siteHeader.classList.remove('hide-header');
    }

    document.body.classList.remove('swap-header-color');
    if (pos >= pageScrollHeight - 40) {
      document.body.classList.add('swap-header-color');
    }

    startingScroll = window.pageYOffset;
  };

  const throttleScroll = throttle(respondToScroll, 10);

  const sync = () => {
    startingScroll = window.pageYOffset;
  };

  const resizeHandler = () => {
    window.removeEventListener('scroll', throttleScroll);
    sync();
    window.addEventListener('scroll', throttleScroll);
  };

  const debouncedResize = debounce(resizeHandler, 120);

  window.addEventListener('resize', debouncedResize);
  window.addEventListener('scroll', throttleScroll);

  const destroy = () => {
    siteHeader.classList.remove('hide-header');
    document.body.classList.remove('swap-header-color');
    window.removeEventListener('scroll', throttleScroll);
    window.removeEventListener('resize', debouncedResize);
  };

  window.onLoad = () => {
    sync();
  };

  return {
    sync,
    destroy
  };

}

export default HeaderScroll;
