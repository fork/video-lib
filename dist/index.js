'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var axios = _interopDefault(require('axios'));
var Hls = _interopDefault(require('hls.js'));
var debounce = _interopDefault(require('lodash.debounce'));

/* eslint-disable no-continue */
var qualityPrios = ['auto', '1080p', '720p', '480p', '360p'];
/**
 * Video player source using MI24 as hosting backend with HLS support
 *
 * @param {HTMLVideoElement} $video - <video> element
 * @param {string} videoId - MI24 Video ID
 * @returns {Promise} Promise that resolves when the source is added
 */

var VideoSource = function VideoSource($video, videoId) {
  return new Promise(function ($return, $error) {
    var apiUrl, apiRes, i, quality, sources, h;
    apiUrl = "https://d.video-cdn.net/play/public/v1/video/".concat(videoId);
    return Promise.resolve(axios.get(apiUrl)).then(function ($await_1) {
      try {
        apiRes = $await_1;

        for (i = 0; i < qualityPrios.length; i += 1) {
          quality = qualityPrios[i];
          sources = apiRes.data.videoSources.html[quality];

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

            h = new Hls({
              /* Make sure the video starts with the best possible quality
               * see https://github.com/video-dev/hls.js/blob/master/docs/API.md#hlsstartlevel
               */
              startLevel: -1
            });
            h.loadSource(sources[0].source);
            h.attachMedia($video);
            return $return();
          }

          sources.forEach(function (source) {
            var sourceElem = document.createElement('source');
            sourceElem.type = source.mimeType;
            sourceElem.src = source.source;
            $video.appendChild(sourceElem);
          });
          return $return();
        }

        return $return();
      } catch ($boundEx) {
        return $error($boundEx);
      }
    }, $error);
  });
};

/**
 * Adds classes to a DOM element
 *
 * @param {Element} $elem - Element the classes should get added to
 * @param {string} classNames - One or more classnames
 * @returns {void}
 */
var addClass = function addClass($elem) {
  for (var _len = arguments.length, classNames = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    classNames[_key - 1] = arguments[_key];
  }

  return classNames.filter(function (className) {
    return !$elem.classList.contains(className);
  }).forEach(function (className) {
    return $elem.classList.add(className);
  });
};
/**
 * Remove all children from an HTMLElement
 *
 * @param {HTMLElement} $elem - Element which should be cleared
 * @returns {void}
 */

var clearElement = function clearElement($elem) {
  while ($elem.firstChild) {
    $elem.removeChild($elem.firstChild);
  }
};
/**
 * Trigger an event once, then remove the event listener
 *
 * @param {HTMLElement} $elem - Element on which the listener should be added
 * @param {string} event - A case-sensitive string representing the event type to listen for
 * @param {function} listener - Event listener callback
 * @returns {void}
 */

var once = function once($elem, event, listener) {
  var onEvent = function onEvent() {
    $elem.removeEventListener(event, onEvent);
    listener.apply(void 0, arguments);
  };

  $elem.addEventListener(event, onEvent);
};
/**
 * Removes classes from a DOM element
 *
 * @param {Element} $elem - Element the classes should get removed from
 * @param {string} classNames - One or more classnames
 * @returns {void}
 */

var removeClass = function removeClass($elem) {
  for (var _len2 = arguments.length, classNames = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    classNames[_key2 - 1] = arguments[_key2];
  }

  return classNames.filter(function (className) {
    return $elem.classList.contains(className);
  }).forEach(function (className) {
    return $elem.classList.remove(className);
  });
};
/**
 * Toggles a class on a DOM element
 *
 * @param {Element} $elem - Element for that the class should get toggled
 * @param {string} className - Classname that should get toggled
 * @param {boolean} state - Optional. A Boolean (not just truthy/falsy) value to determine whether the class should be added or removed.
 * @returns {void}
 */

var toggleClass = function toggleClass($elem, className, state) {
  var shouldRemoveClass = typeof state === 'boolean' ? !state : $elem.classList.contains(className);

  if (shouldRemoveClass) {
    removeClass($elem, className);
  } else {
    addClass($elem, className);
  }
};

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

var VideoObjectFit = function VideoObjectFit($video, $container, $classContainer) {
  var classPrefix = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  var onObjectFit = debounce(function () {
    var videoRatio = $video.videoHeight / $video.videoWidth;
    var containerRatio = $container.offsetHeight / $container.offsetWidth;
    var isNarrow = videoRatio < containerRatio;
    toggleClass($classContainer || $container, "".concat(classPrefix, "is-wide"), !isNarrow);
    toggleClass($classContainer || $container, "".concat(classPrefix, "is-narrow"), isNarrow);
  }, 200);
  $video.addEventListener('canplay', onObjectFit);
  window.addEventListener('resize', onObjectFit);
  onObjectFit();
};

/**
 * Video player ready promise
 *
 * Can be called multiple times in code, will immediately resolve when
 * the video is already ready.
 *
 * @param {HTMLVideoElement} $video - <video> element
 * @returns {Promise} Promise that resolves when the video element is ready
 */

var VideoReady = function VideoReady($video) {
  return new Promise(function (resolve) {
    if ($video.readyState >= 1) {
      resolve();
      return;
    }

    once($video, 'loadedmetadata', resolve);
  });
};

/**
 * Video player styled subtitles
 *
 * @param {HTMLVideoElement} $video - <video> element
 * @param {HTMLElement} $subsContainer - Container element for subtitles
 * @returns {Promise} Promise that resolves when subtitles are ready
 */

var VideoSubtitles = function VideoSubtitles($video, $subsContainer) {
  return new Promise(function ($return, $error) {
    var i;
    return Promise.resolve(VideoReady($video)).then(function ($await_1) {
      try {
        if ($video.textTracks.length === 0) {
          // do nothing if we have no textTracks
          return $return();
        } // make sure all subtitles are natively hidden


        for (i = 0; i < $video.textTracks.length; i += 1) {
          // eslint-disable-next-line no-param-reassign
          $video.textTracks[i].mode = 'hidden';
        }

        $video.textTracks[0].addEventListener('cuechange', function (ev) {
          var subs = document.createDocumentFragment();

          for (var _i = 0; _i < ev.target.activeCues.length; _i += 1) {
            var sub = document.createElement('span');
            sub.innerHTML = ev.target.activeCues[_i].text;
            subs.appendChild(sub);
          }

          clearElement($subsContainer);
          $subsContainer.appendChild(subs);
        });
        return $return();
      } catch ($boundEx) {
        return $error($boundEx);
      }
    }, $error);
  });
};

exports.VideoMI24Source = VideoSource;
exports.VideoObjectFit = VideoObjectFit;
exports.VideoReady = VideoReady;
exports.VideoSubtitles = VideoSubtitles;
