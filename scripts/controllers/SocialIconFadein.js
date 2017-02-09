import { Tweak } from '@squarespace/core';

/*
 * Handles fading the social icons in the header in to match the staggered nav link fade in.
 */
function SocialIconFadein (element) {
  const headerIconsWithNav = element.querySelector('.header-social-icons-with-nav');

  if (!headerIconsWithNav) {
    return;
  }

  const navToggle = element.querySelector('.nav-toggle');
  const socialIconsOverlay = element.querySelector('.header-social-icons--overlay');
  const nextToLastNavItem = element.querySelector('.nav-item:nth-last-child(2)');
  // get 2nd to last since the cart is always the last, but isn't always visible.
  const isNavOnRight = Tweak.getValue('tweak-nav-position').toLowerCase() === 'right';

  /*
   * Vendor prefix fix for transitionEnd event.
   */
  const whichTransitionEvent = () => {
    const el = document.createElement('transition-tester');

    const transitions = {
      'transition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'MozTransition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd'
    };

    for (const t in transitions){
      if (el.style[t] !== undefined){
        return transitions[t];
      }
    }
  };

  const vendorTransitionEvent = whichTransitionEvent();

  const fadeIn = (e) => {
    if (e.propertyName === 'opacity') {
      if (document.body.classList.contains('nav-open')) {
        headerIconsWithNav.classList.add('show');
        socialIconsOverlay.classList.add('show');
      } else {
        headerIconsWithNav.classList.remove('show');
        socialIconsOverlay.classList.remove('show');
      }
      nextToLastNavItem.removeEventListener(vendorTransitionEvent, fadeIn);
    }
  };

  const transitionListener = () => {
    if (!isNavOnRight || document.body.classList.contains('mobile-style-nav')) {
      nextToLastNavItem.addEventListener(vendorTransitionEvent, fadeIn);
    } else if (document.body.classList.contains('nav-open')) {
      headerIconsWithNav.classList.add('show');
    } else {
      headerIconsWithNav.classList.remove('show');
    }
  };

  const destroy = () => {
    navToggle.removeEventListener('click', transitionListener);
    nextToLastNavItem.removeEventListener(vendorTransitionEvent, fadeIn);
  };

  navToggle.addEventListener('click', transitionListener);

  return {
    destroy
  };
}

export default SocialIconFadein;
