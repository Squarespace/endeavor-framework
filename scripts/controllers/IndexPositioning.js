import debounce from 'lodash/debounce';
import { Tweak } from '@squarespace/core';

/*
 * Positions the Index Description below the fixed header.
 */
function IndexPositioning (element) {
  const collectionDesc = element.querySelector('.collection-desc');
  const siteHeader = document.querySelector('.site-header');

  const setDescPosition = () => {
    collectionDesc.style.top = siteHeader.offsetHeight + 'px';
  };

  const debouncedResize = debounce(setDescPosition, 120);

  const tweakChangeHandler = (tweak) => {
    collectionDesc.style.top = '';
    window.removeEventListener('resize', debouncedResize);
    if (tweak.value.toLowerCase() === 'top') {
      setDescPosition();
      window.addEventListener('resize', debouncedResize);
    }
  };

  const destroy = () => {
    window.removeEventListener('resize', debouncedResize);
  };

  const init = () => {
    const descPositionTop = Tweak.getValue('tweak-index-desc-position').toLowerCase() === 'top';

    if (collectionDesc && descPositionTop) {
      setDescPosition();
      window.addEventListener('resize', debouncedResize);
    }
  };

  init();

  Tweak.watch('tweak-index-desc-position', tweakChangeHandler);

  return {
    destroy
  };
}

export default IndexPositioning;
