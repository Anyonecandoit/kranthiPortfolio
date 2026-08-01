/**
 * Utility functions for the portfolio application
 */

/**
 * Format a date range for experience timeline
 * @param startDate - Start date string (YYYY-MM-DD) or null
 * @param endDate - End date string (YYYY-MM-DD) or null
 * @returns Formatted date range string
 */
export const formatDateRange = (startDate: string | null, endDate: string | null): string => {
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Present';
    
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-US', options);
  };
  
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  
  return `${start} - ${end}`;
};

/**
 * Truncate text to a specified length
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @param ellipsis - Optional ellipsis string (default: '...')
 * @returns Truncated text with ellipsis
 */
export const truncateText = (text: string, maxLength: number, ellipsis: string = '...'): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + ellipsis;
};

/**
 * Convert a string to kebab-case
 * @param str - The string to convert
 * @returns Kebab-case string
 */
export const toKebabCase = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 * @param value - The value to check
 * @returns True if the value is empty
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
};

/**
 * Convert a hex color to RGB
 * @param hex - Hex color string (e.g., '#0A84FF')
 * @returns RGB string (e.g., '10, 132, 255')
 */
export const hexToRgb = (hex: string): string => {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse r, g, b values
  let r, g, b;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    throw new Error('Invalid hex color format');
  }
  
  return `${r}, ${g}, ${b}`;
};

/**
 * Generate a random ID
 * @param prefix - Optional prefix for the ID
 * @returns Random ID string
 */
export const generateId = (prefix: string = ''): string => {
  return prefix + Math.random().toString(36).substring(2, 11);
};

/**
 * Debounce a function
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @returns Debounced function
 */
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  wait: number
): ((...args: Parameters<F>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<F>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle a function
 * @param func - The function to throttle
 * @param limit - The number of milliseconds to limit calls
 * @returns Throttled function
 */
export const throttle = <F extends (...args: any[]) => any>(
  func: F,
  limit: number
): ((...args: Parameters<F>) => void) => {
  let lastFunc: NodeJS.Timeout | null = null;
  let lastRan = 0;
  
  return (...args: Parameters<F>) => {
    if (!lastRan) {
      func(...args);
      lastRan = Date.now();
    } else {
      if (lastFunc) {
        clearTimeout(lastFunc);
      }
      lastFunc = setTimeout(() => {
        if ((Date.now() - lastRan) >= limit) {
          func(...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};