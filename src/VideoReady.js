import { once } from './DOMHelper';

/**
 * Video player ready promise
 *
 * If the necessary readyState is already reached, it resolves immediately.
 * Otherwise it waits for the specified event to trigger. As of this, it
 * can be called multiple times in code.
 *
 * @param {HTMLVideoElement} $video - <video> element
 * @param {string} event - Default: loadedmetadata. Event for which we wait
 * @param {number} minReadyState - Default: 1. Minimum readyState to resolve immediately
 * @returns {Promise} Promise that resolves when the video element is ready
 */
const VideoReady = ($video, event = 'loadedmetadata', minReadyState = 1) =>
  new Promise(resolve => {
    if ($video.readyState >= minReadyState) {
      resolve();
      return;
    }

    once($video, event, resolve);
  });

export default VideoReady;
