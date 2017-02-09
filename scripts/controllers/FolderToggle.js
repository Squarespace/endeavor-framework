import getSiblingsAsArray from '../utils/getSiblingsAsArray';

function FolderToggle (element) {
  const siteHeader = document.querySelector('.site-header');
  // This is the time of the folder opacity transition (in ms) set in the css.
  // Using it as a timeout here so it doesn't get cut off when the header
  // overflow is set back to hidden on folder close.
  const folderOpacityTransitionTime = 200;
  const isAnotherFolderOpen = (folder) => {
    return getSiblingsAsArray(folder, '.folder-open').length > 0;
  };

  /**
   * Sets both the folder-open class on the folder itself and
   * the folder overflow class on the header.
   */
  const setFolderState = (e) => {
    if (!element.classList.contains('folder-open')) {
      if (isAnotherFolderOpen(element)) {
        document.querySelector('.folder-open').classList.remove('folder-open');
      }
      element.classList.add('folder-open');
      siteHeader.classList.add('folder-overflow');
    } else {
      element.classList.remove('folder-open');
      setTimeout(() => {
        siteHeader.classList.remove('folder-overflow');
      }, folderOpacityTransitionTime);
    }
  };

  element.addEventListener('click', setFolderState);
}

export default FolderToggle;
