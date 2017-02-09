import '@squarespace/polyfills/Element/matches';

module.exports = function (el, filterBySelector = '*') {
  const children = Array.from(el.parentNode.children);
  return children.filter((child) => {
    return child !== el && child.matches(filterBySelector);
  });
};
