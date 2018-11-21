/**
 * Adds classes to a DOM element
 *
 * @param {Element} $elem - Element the classes should get added to
 * @param {string} classNames - One or more classnames
 * @returns {void}
 */
export const addClass = ($elem, ...classNames) =>
  classNames
    .filter(className => !$elem.classList.contains(className))
    .forEach(className => $elem.classList.add(className));

/**
 * Remove all children from an HTMLElement
 *
 * @param {HTMLElement} $elem - Element which should be cleared
 * @returns {void}
 */
export const clearElement = $elem => {
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
export const once = ($elem, event, listener) => {
  const onEvent = (...args) => {
    $elem.removeEventListener(event, onEvent);
    listener(...args);
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
export const removeClass = ($elem, ...classNames) =>
  classNames
    .filter(className => $elem.classList.contains(className))
    .forEach(className => $elem.classList.remove(className));

/**
 * Toggles a class on a DOM element
 *
 * @param {Element} $elem - Element for that the class should get toggled
 * @param {string} className - Classname that should get toggled
 * @param {boolean} state - Optional. A Boolean (not just truthy/falsy) value to determine whether the class should be added or removed.
 * @returns {void}
 */
export const toggleClass = ($elem, className, state) => {
  const shouldRemoveClass =
    typeof state === 'boolean' ? !state : $elem.classList.contains(className);

  if (shouldRemoveClass) {
    removeClass($elem, className);
  } else {
    addClass($elem, className);
  }
};
