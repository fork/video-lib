import VideoReady from './VideoReady';
import { clearElement } from './DOMHelper';

/**
 * Video player styled subtitles
 *
 * @param {HTMLVideoElement} $video - <video> element
 * @param {HTMLElement} $subsContainer - Container element for subtitles
 * @returns {Promise} Promise that resolves when subtitles are ready
 */
const VideoSubtitles = async ($video, $subsContainer) => {
  // video needs to be ready for the TextTracks to be ready
  await VideoReady($video);

  if ($video.textTracks.length === 0) {
    // do nothing if we have no textTracks
    return;
  }

  // make sure all subtitles are natively hidden
  for (let i = 0; i < $video.textTracks.length; i += 1) {
    // eslint-disable-next-line no-param-reassign
    $video.textTracks[i].kind = 'metadata';
    // eslint-disable-next-line no-param-reassign
    $video.textTracks[i].mode = 'hidden';
  }

  $video.textTracks[0].addEventListener('cuechange', ev => {
    const subs = document.createDocumentFragment();

    for (let i = 0; i < ev.target.activeCues.length; i += 1) {
      const sub = document.createElement('span');
      sub.innerHTML = ev.target.activeCues[i].text;
      subs.appendChild(sub);
    }

    clearElement($subsContainer);
    $subsContainer.appendChild(subs);
  });
};

export default VideoSubtitles;
