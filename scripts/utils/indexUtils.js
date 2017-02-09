
/**
 * @param  {HTMLElement} [el]   Element to add active class to
 */
export const setActive = (el) => el && el.classList.add('active');

/**
 * @param  {HTMLElement} [el]   Element to remove active class from
 */
export const removeActive = (el) => el && el.classList.remove('active');

/**
 * @param  {HTMLElement}        currentImage  Currently displayed image
 * @param  {Array<HTMLElement>} links         All the links
 * @return {HTMLElement}                      Corresponding link
 */
export const getCurrentLink = (currentImage, links) => {
  return links.find((el) => {
    return el.getAttribute('data-url-id') === currentImage.getAttribute('data-url-id');
  });
};
