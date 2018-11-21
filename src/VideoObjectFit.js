import debounce from 'lodash.debounce';

import { toggleClass } from './DOMHelper';

/**
 * Video player object fit cover. Automatically adds CSS classes
 *
 * Typical CSS usage:
 *
 * .is-wide,
 * .is-narrow {
 *   position: absolute;
 *   top: 50%;
 *   left: 50%;
 *   transform: translate(-50%, -50%);
 * }
 * .is-wide {
 *   width: 100%;
 *   height: auto;
 * }
 * .is-narrow {
 *   width: auto;
 *   height: 100%;
 * }
 *
 * @param {HTMLVideoElement} $video - <video> element
 * @param {HTMLElement} $container - Wrapper of the <video> element
 * @param {HTMLElement} $classContainer - Optional. Default: $container. Element which should get the is-wide/is-narrow class
 * @param {string} classPrefix - Optional. CSS class prefix
 * @returns {void}
 */
const VideoObjectFit = ($video, $container, $classContainer, classPrefix = '') => {
  const onObjectFit = debounce(() => {
    const videoRatio = $video.videoHeight / $video.videoWidth;
    const containerRatio = $container.offsetHeight / $container.offsetWidth;

    const isNarrow = videoRatio < containerRatio;
    toggleClass($classContainer || $container, `${classPrefix}is-wide`, !isNarrow);
    toggleClass($classContainer || $container, `${classPrefix}is-narrow`, isNarrow);
  }, 200);

  $video.addEventListener('canplay', onObjectFit);
  window.addEventListener('resize', onObjectFit);
  onObjectFit();
};

export default VideoObjectFit;
