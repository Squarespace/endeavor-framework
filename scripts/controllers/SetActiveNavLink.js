import constants from '../constants';
import { Tweak } from '@squarespace/core';

/*
 * Set the active class on the main navigation when ajax loading pages.
 */
function SetActiveNavLink (element) {
  const isCoverPage = document.querySelector('.sqs-slide-container');
  const isAjaxLoaderEnabled = Tweak.getValue('tweak-site-ajax-loading-enable') === 'true' ? true : false;
  const siteTitleOrImage = element.querySelector('.site-branding .image') ? 'h1.image img' : '.site-title';

  const getClickedLink = (e) => {
    return e.target.parentNode.getAttribute('href');
  };

  const setActiveLink = (e) => {
    // click will be on inner span, so check the parent a for the href
    if (e.target.parentNode.hasAttribute('href')) {
      const clickedLink = 'a[href="' + getClickedLink(e) + '"]';

      // close all open folders
      if (element.querySelector('.folder-open')) {
        Array.from(element.querySelectorAll('.folder-open')).forEach((folder) => {
          folder.classList.remove('folder-open');
        });
      }

      if (element.querySelector('.main-navigation .active')) {
        // if there is already an active link, remove it.
        element.querySelector('.main-navigation .active').classList.remove('active');
        element.querySelector('.main-navigation--overlay .active').classList.remove('active');
      }
      if (element.querySelector('.main-navigation ' + clickedLink)) {
        // if there is a link in the nav that matches the clicked link, set it to active
        element.querySelector('.main-navigation ' + clickedLink).parentNode.classList.add('active');
      }
      if (element.querySelector('.main-navigation--overlay ' + clickedLink)) {
        // if there is a link in the overlay nav that matches the clicked link, set it to active
        element.querySelector('.main-navigation--overlay ' + clickedLink).parentNode.classList.add('active');
      }
    }
  };

  if (isAjaxLoaderEnabled && !constants.isAuthenticated && !isCoverPage) {
    element.querySelector('.main-navigation').addEventListener('click', setActiveLink);
    element.querySelector('.main-navigation--overlay').addEventListener('click', setActiveLink);
    element.querySelector(siteTitleOrImage).addEventListener('click', setActiveLink);
  }
}

export default SetActiveNavLink;
