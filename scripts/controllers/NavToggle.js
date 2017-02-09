import hasTouch from '../utils/hasTouch';

function NavToggle (element) {
  const touchDeviceOverlayNav = () => hasTouch() && document.body.classList.contains('mobile-style-nav');
  const overlayNavWrapper = element.querySelector('.overlay-nav-wrapper');

  /*
   * If the overlay nav wrapper is not scrollable, prevent scrolling on touch devices.
   * This makes it so the body doesn't scroll under the overlay.
   */
  const handleTouchmove = (e) => {
    if (!overlayNavWrapper.classList.contains('too-tall')) {
      e.preventDefault();
    }
  };

  /*
   * Open or close the nav.
   * If on a touch device and the overlay nav is active, prevent scrolling if necessary.
   */
  const setOverlayNavState = () => {
    if (document.body.classList.contains('nav-open')) {
      overlayNavWrapper.removeEventListener('touchmove', handleTouchmove, false);
      document.body.classList.remove('nav-open');
    } else {
      if (touchDeviceOverlayNav()) {
        overlayNavWrapper.addEventListener('touchmove', handleTouchmove, false);
      }
      document.body.classList.add('nav-open');
    }
  };

  element.querySelector('.nav-toggle').addEventListener('click', setOverlayNavState);
}

export default NavToggle;
