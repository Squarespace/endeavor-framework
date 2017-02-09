Endeavor Framework
------------------------------

A framework with a hover-activated index gallery.
*NOTICE: This code is licensed to you pursuant to Squarespace’s Developer Terms of Use. See license section below.*

**Features**
* Index gallery with a separate "main", gallery-style navigation
* Overlay-style intros for pages/collections
* SVG UI icons with adjustable weights

## Basic Usage

This template uses [Node Package Manager](https://www.npmjs.com/) to handle dependency management and run build scripts. After cloning this repo, install dependencies:

```sh
npm install
```

To use the local development process, you'll need to install the [Squarespace Local Development Server](http://developers.squarespace.com/local-development) separately, then run:

```sh
npm start
```

To deploy to your live Squarespace site, run:

```sh
npm run deploy
```

## NPM Script Reference

This template's NPM scripts make extensive use of `squarespace` CLI commands. To learn more about what's happening under the hood, check out [Squarespace Toolbelt](https://github.com/Squarespace/squarespace-toolbelt) on Github.

### npm run build
Cleans the build folder, copies squarespace files (JSON-T, LESS, assets) into the build folder from source and `node_modules`, and runs Webpack to bundle Javascript.

### npm run clean
Cleans the build folder, removing all build results.

### npm run deploy
Deploys your built template to production using Git. If not already configured, initializes a Git repo for deployment in your build folder. Note this is separate from your source repository, and will only contain the build result.

### npm run lint
Runs ESLint on the scripts in your `/scripts` folder.

### npm start
Runs watch, and simultaneously launches Squarespace Server. By default this runs on `localhost:9000`.

### npm run server
Launches Squarespace Server.

### npm run server:auth
Launches Squarespace Server, prompting you for your Squarespace authentication details. Useful if your site is password-protected.

### npm run watch
Watches your source directory as well as your scripts and modules for changes, and builds on the fly when changes are detected.

## Reference

### Notes on `tweak-index-inactive-on-load` option in Style Editor
The behavior of this option has been changed post launch and the Title no longer describes the behavior. The new behavior is correctly reflected in the label, Show Index Slide.

Previously it determined whether the index started on the Index main image/description or the first collection's main image/link, but this led to some discrepancies in the slideshow behavior. Now it strictly controls whether the Index main image/description are displayed in all cases. Enabling it will show the Index main image/description in the initial state and will include both in the slideshow. Disabling it will never display the Index main image/description.

## License
Portions Copyright © 2016 Squarespace, Inc. This code is licensed to you pursuant to Squarespace’s Developer Terms of Use, available at http://developers.squarespace.com/developer-terms-of-use (the “Developer Terms”). You may only use this code on websites hosted by Squarespace, and in compliance with the Developer Terms. TO THE FULLEST EXTENT PERMITTED BY LAW, SQUARESPACE PROVIDES ITS CODE TO YOU ON AN “AS IS” BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.