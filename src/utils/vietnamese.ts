/**
 * Helper function to remove Vietnamese diacritics / tones for accent-insensitive search.
 * Example:
 * "Tây Ninh" -> "tay ninh"
 * "Đà Lạt" -> "da lat"
 * "Vũng Tàu" -> "vung tau"
 * "Chèo SUP" -> "cheo sup"
 */
export function removeVietnameseTones(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .trim();
}

/**
 * Checks if target string contains search query (case-insensitive & accent-insensitive).
 */
export function matchVietnameseSearch(target: string, query: string): boolean {
  if (!query || !query.trim()) return true;
  if (!target) return false;

  const normalizedTarget = removeVietnameseTones(target);
  const normalizedQuery = removeVietnameseTones(query);

  return (
    target.toLowerCase().includes(query.toLowerCase().trim()) ||
    normalizedTarget.includes(normalizedQuery)
  );
}
