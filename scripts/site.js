// Polyfills
import 'core-js/fn/array/find';

// General imports
import controller from '@squarespace/controller';
import { Tweak } from '@squarespace/core';
import VideoBackground from '@squarespace/video-background';

// controllers
import FolderToggle from './controllers/FolderToggle';
import GalleryLayout from './controllers/GalleryLayout';
import GalleryVideoHandler from './controllers/GalleryVideoHandler';
import HeaderOverflow from './controllers/HeaderOverflow';
import HeaderScroll from './controllers/HeaderScroll';
import IndexGallery from './controllers/IndexGallery';
import IndexNavOverflow from './controllers/IndexNavOverflow';
import IndexNavScroll from './controllers/IndexNavScroll';
import IndexSetup from './controllers/IndexSetup';
import IndexPositioning from './controllers/IndexPositioning';
import MainContentPositioning from './controllers/MainContentPositioning';
import MercuryLoader from './controllers/MercuryLoader';
import NavToggle from './controllers/NavToggle';
import OverlayNavOverflow from './controllers/OverlayNavOverflow';
import PageBanners from './controllers/PageBanners';
import SetActiveNavLink from './controllers/SetActiveNavLink';
import SocialIconFadein from './controllers/SocialIconFadein';
import TitleCardHandler from './controllers/TitleCardHandler';
import UserAccountsSetup from './controllers/UserAccountsSetup';

// Bind controllers
controller.register('FolderToggle', FolderToggle);
controller.register('GalleryLayout', GalleryLayout);
controller.register('GalleryVideoHandler', GalleryVideoHandler);
controller.register('HeaderOverflow', HeaderOverflow);
controller.register('HeaderScroll', HeaderScroll);
controller.register('IndexGallery', IndexGallery);
controller.register('IndexNavOverflow', IndexNavOverflow);
controller.register('IndexNavScroll', IndexNavScroll);
controller.register('IndexSetup', IndexSetup);
controller.register('IndexPositioning', IndexPositioning);
controller.register('MainContentPositioning', MainContentPositioning);
controller.register('MercuryLoader', MercuryLoader);
controller.register('NavToggle', NavToggle);
controller.register('OverlayNavOverflow', OverlayNavOverflow);
controller.register('PageBanners', PageBanners);
controller.register('SetActiveNavLink', SetActiveNavLink);
controller.register('SocialIconFadein', SocialIconFadein);
controller.register('TitleCardHandler', TitleCardHandler);
controller.register('UserAccountsSetup', UserAccountsSetup);

controller.register('VideoBackground', (element) => {
  return VideoBackground(element, ({ handleTweak }) => {
    Tweak.watch([
      'tweak-page-banner-image-height',
      'tweak-show-page-banner-image'
    ], handleTweak);
  });
});
