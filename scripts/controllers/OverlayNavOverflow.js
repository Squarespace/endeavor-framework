import debounce from 'lodash/debounce';

/*
 * Handles cases where the overlay nav overflows the viewport.
 */
function OverlayNavOverflow (element) {
  const overlayNavWrapper = element.querySelector('.overlay-nav-wrapper');
  const overlayNavInnerWrapper = element.querySelector('.overlay-nav-inner-wrapper');
  const header = element.querySelector('.site-header');
  const hasFolders = element.querySelector('.overlay-nav-inner-wrapper .folder');

  const init = () => {
    const overlayNavHeight = overlayNavInnerWrapper.offsetHeight;
    const headerHeight = header.offsetHeight;
    // Use 2x the header height to save the same amount of space below the nav.
    const availableHeight = window.innerHeight - 2 * headerHeight;

    if (overlayNavHeight > availableHeight) {
      overlayNavWrapper.classList.add('too-tall');
      overlayNavWrapper.style.paddingTop = headerHeight + 'px';
    }
  };

  const resizeHandler = () => {
    overlayNavWrapper.classList.remove('too-tall');
    overlayNavWrapper.style.paddingTop = '';
    init();
  };

  const handleFolderClick = (e) => {
    if (e.target.parentNode.classList.contains('folder')) {
      resizeHandler();
    }
  };

  const debouncedResize = debounce(resizeHandler, 120);

  const destroy = () => {
    overlayNavWrapper.classList.remove('too-tall');
    overlayNavWrapper.style.paddingTop = '';
    overlayNavWrapper.removeEventListener('click', handleFolderClick);
    window.removeEventListener('resize', debouncedResize);
  };

  window.addEventListener('resize', debouncedResize);

  if (hasFolders) {
    overlayNavWrapper.addEventListener('click', handleFolderClick);
  }

  init();

  return {
    destroy
  };
}

export default OverlayNavOverflow;
