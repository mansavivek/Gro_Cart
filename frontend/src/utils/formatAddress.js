/**
 * Formats a saved address object into a single-line string.
 * @param {Object} addr - Address object with line1, line2, city, state, pincode fields
 * @returns {string} Formatted address string
 */
export function formatAddress(addr) {
  if (!addr) return '';
  return [addr.line1, addr.line2, addr.city, addr.state, addr.pincode]
    .filter(Boolean)
    .join(', ');
}
