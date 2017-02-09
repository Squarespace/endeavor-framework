// from here: https://github.com/radubrehar/has-touch/blob/master/index.js

module.exports = function() {
  return !!('ontouchstart' in window || (window.DocumentTouch && document instanceof DocumentTouch) || window.navigator.msMaxTouchPoints);
};
