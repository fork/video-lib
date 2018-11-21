/* eslint-disable no-continue */
import axios from 'axios';
import Hls from 'hls.js';

const qualityPrios = ['auto', '1080p', '720p', '480p', '360p'];

/**
 * Video player source using MI24 as hosting backend with HLS support
 *
 * @param {HTMLVideoElement} $video - <video> element
 * @param {string} videoId - MI24 Video ID
 * @returns {Promise} Promise that resolves when the source is added
 */
const VideoSource = async ($video, videoId) => {
  const apiUrl = `https://d.video-cdn.net/play/public/v1/video/${videoId}`;
  const apiRes = await axios.get(apiUrl);

  for (let i = 0; i < qualityPrios.length; i += 1) {
    const quality = qualityPrios[i];

    const sources = apiRes.data.videoSources.html[quality];
    if (!sources) {
      // skip to next preferred quality if we have no source for this one
      continue;
    }

    if (quality === 'auto' && $video.canPlayType(sources[0].mimeType) === '') {
      // only start hls.js initialization if the browser cannot natively play HLS

      if (!Hls.isSupported()) {
        // skip to next quality if hls.js is not supported
        continue;
      }

      const h = new Hls({
        /* Make sure the video starts with the best possible quality
         * see https://github.com/video-dev/hls.js/blob/master/docs/API.md#hlsstartlevel
         */
        startLevel: -1
      });
      h.loadSource(sources[0].source);
      h.attachMedia($video);

      return;
    }

    sources.forEach(source => {
      const sourceElem = document.createElement('source');
      sourceElem.type = source.mimeType;
      sourceElem.src = source.source;

      $video.appendChild(sourceElem);
    });

    return;
  }
};

export default VideoSource;
