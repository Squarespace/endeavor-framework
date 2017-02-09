import constants from '../constants';
import controller from '@squarespace/controller';
import { Lifecycle, Tweak } from '@squarespace/core';
import Mercury from '@squarespace/mercury';

function MercuryLoader (element) {
  const isCoverPage = document.querySelector('.sqs-slide-container');
  const isAjaxLoaderEnabled = Tweak.getValue('tweak-site-ajax-loading-enable') === 'true' ? true : false;

  if (isAjaxLoaderEnabled && !constants.isAuthenticated && !isCoverPage) {
    const mercury = new Mercury({
      enableCache: true,
      updateMatrix: [
        {
          selector: 'body',
          updateHTML: false,
          updateAttrs: true
        },
        {
          selector: 'head meta',
          updateHTML: false,
          updateAttrs: true
        },
        {
          selector: 'head title',
          updateHTML: true,
          updateAttrs: true
        },
        {
          selector: '.content-outer-wrapper',
          updateHTML: false,
          updateAttrs: true
        },
        {
          selector: '.index-gallery-wrapper',
          updateHTML: false,
          updateAttrs: true
        },
        {
          selector: '.gallery-wrapper',
          updateHTML: false,
          updateAttrs: true
        },
        {
          selector: '.nav-item.folder',
          updateHTML: false,
          updateAttrs: true
        },
        {
          selector: '.main-content',
          updateHTML: true,
          updateAttrs: false
        },
        {
          selector: '.index-nav',
          updateHTML: true,
          updateAttrs: false
        },
        {
          selector: '.page-banner-wrapper',
          updateHTML: false,
          updateAttrs: true
        },
        {
          selector: '.page-banner-image-wrapper',
          updateHTML: false,
          updateAttrs: true
        },
        {
          selector: '.title-card-wrapper',
          updateHTML: false,
          updateAttrs: true
        },
        {
          selector: '.main-navigation',
          updateHTML: false,
          updateAttrs: true
        },
        {
          selector: '.header-social-icons-with-nav',
          updateHMTL: false,
          updateAttrs: true
        },
        {
          selector: '.header-social-icons-on-right',
          updateHMTL: false,
          updateAttrs: true
        },
        {
          selector: '.header-social-icons--overlay',
          updateHMTL: false,
          updateAttrs: true
        },
        {
          selector: '.overlay-nav-wrapper',
          updateHMTL: false,
          updateAttrs: true
        },
        { selector: 'meta[property="og:title"]', updateAttrs: true },
        { selector: 'meta[property="og:latitude"]', updateAttrs: true },
        { selector: 'meta[property="og:longitude"]', updateAttrs: true },
        { selector: 'meta[property="og:url"]', updateAttrs: true },
        { selector: 'meta[property="og:type"]', updateAttrs: true },
        { selector: 'meta[property="og:description"]', updateAttrs: true },
        { selector: 'meta[property="og:image"]', updateAttrs: true },
        { selector: 'meta[itemprop="name"]', updateAttrs: true },
        { selector: 'meta[itemprop="url"]', updateAttrs: true },
        { selector: 'meta[itemprop="description"]', updateAttrs: true },
        { selector: 'meta[itemprop="thumbnailUrl"]', updateAttrs: true },
        { selector: 'meta[itemprop="image"]', updateAttrs: true },
        { selector: 'meta[name="twitter:title"]', updateAttrs: true },
        { selector: 'meta[name="twitter:image"]', updateAttrs: true },
        { selector: 'meta[name="twitter:url"]', updateAttrs: true },
        { selector: 'meta[name="twitter:card"]', updateAttrs: true },
        { selector: 'meta[name="twitter:description"]', updateAttrs: true },
        { selector: 'meta[name="twitter:url"]', updateAttrs: true },
        { selector: 'meta[name="description"]', updateAttrs: true },
        { selector: 'link[rel="canonical"]', updateAttrs: true },
        { selector: 'link[rel="image_src"]', updateAttrs: true },
        { selector: 'link[rel="alternate"]', updateAttrs: true }
      ],
      onClickExceptions: [
        '[href^="/commerce"]'
      ],
      onRequestExceptions: [
        'sqs-slide-container'
      ],
      onLoadDelay: 500,
      onLoad: () => {
        document.querySelector('.mercury-transition-wrapper').classList.remove('fade');
        Lifecycle.init();
        controller.refresh();
      },
      onUnload: (e) => {
        Lifecycle.destroy();
      },
      onNavigate: () => {
        document.querySelector('.mercury-transition-wrapper').classList.add('fade');
      }
    });
  }
}

export default MercuryLoader;
