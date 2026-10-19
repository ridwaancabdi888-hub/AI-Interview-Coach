/**
 * Return the element that should receive focus when Tab would leave a dialog.
 * A null result means the browser can continue its normal tab order.
 */
export function focusTrapTarget(elements, activeElement, backwards) {
  if (!elements.length) return null;

  const first = elements[0];
  const last = elements[elements.length - 1];

  if (!elements.includes(activeElement)) return backwards ? last : first;
  if (backwards && activeElement === first) return last;
  if (!backwards && activeElement === last) return first;
  return null;
}
