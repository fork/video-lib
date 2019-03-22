/**
 * Adds classes to a DOM element
 *
 * @private
 * @param {Element} $elem - Element the classes should get added to
 * @param {string} classNames - One or more classnames
 * @returns {void}
 */
export const addClass = ($elem, ...classNames) =>
  classNames.forEach(className => $elem.classList.add(className));

/**
 * Remove all children from an HTMLElement
 *
 * @private
 * @param {HTMLElement} $elem - Element which should be cleared
 * @returns {void}
 */
export const clearElement = $elem => {
  while ($elem.firstChild) {
    $elem.removeChild($elem.firstChild);
  }
};

/**
 * Removes classes from a DOM element
 *
 * @private
 * @param {Element} $elem - Element the classes should get removed from
 * @param {string} classNames - One or more classnames
 * @returns {void}
 */
export const removeClass = ($elem, ...classNames) =>
  classNames.forEach(className => $elem.classList.remove(className));

/**
 * Toggles a class on a DOM element
 *
 * @private
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
