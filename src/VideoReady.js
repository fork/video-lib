import { once } from './DOMHelper';

/**
 * Video player ready promise
 *
 * Can be called multiple times in code, will immediately resolve when
 * the video is already ready.
 *
 * @param {HTMLVideoElement} $video - <video> element
 * @returns {Promise} Promise that resolves when the video element is ready
 */
const VideoReady = $video =>
  new Promise(resolve => {
    if ($video.readyState >= 1) {
      resolve();
      return;
    }

    once($video, 'loadedmetadata', resolve);
  });

export default VideoReady;
