function GalleryVideoHandler (element) {
  let video = element.querySelector('.sqs-video-wrapper');

  const clickHandler = (e) => {
    e.preventDefault();

    // WARNING: Y.Squarespace.Lightbox2 is an
    // unstable API meant strictly for internal
    // Squarespace use.
    const lightbox = new window.Y.Squarespace.Lightbox2({
      content: window.Y.one(video),
      controls: {
        previous: false,
        next: false
      }
    });

    lightbox.render();
  };

  const sync = () => {
    if (video) {
      video.parentNode.removeChild(video);
      element.addEventListener('click', clickHandler);
    }
  };

  const destroy = () => {
    element.removeEventListener('click', clickHandler);
  };

  sync();

  return {
    sync,
    destroy
  };
}

export default GalleryVideoHandler;
