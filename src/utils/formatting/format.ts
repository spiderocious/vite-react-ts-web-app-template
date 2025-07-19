/**
 * Formatting utility functions
 */

/**
 * Format currency with locale support
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US',
  options: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount);
}

/**
 * Format percentage
 */
export function formatPercentage(
  value: number,
  decimals: number = 1,
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

/**
 * Format number with locale and options
 */
export function formatNumber(
  number: number,
  options: Intl.NumberFormatOptions = {},
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(number);
}

/**
 * Format large numbers with suffixes (K, M, B, T)
 */
export function formatCompactNumber(
  number: number,
  locale: string = 'en-US',
  notation: 'compact' | 'short' | 'long' = 'compact'
): string {
  if (number === 0) return '0';

  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: notation === 'compact' ? 'short' : notation,
    maximumFractionDigits: 1,
  }).format(number);
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Format phone number (US format)
 */
export function formatPhoneNumber(
  phone: string,
  format: 'standard' | 'dots' | 'dashes' = 'standard'
): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');

  // Handle different lengths
  if (digits.length === 10) {
    switch (format) {
      case 'standard':
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
      case 'dots':
        return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
      case 'dashes':
        return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
      default:
        return phone;
    }
  } else if (digits.length === 11 && digits[0] === '1') {
    const tenDigits = digits.slice(1);
    switch (format) {
      case 'standard':
        return `+1 (${tenDigits.slice(0, 3)}) ${tenDigits.slice(3, 6)}-${tenDigits.slice(6)}`;
      case 'dots':
        return `+1.${tenDigits.slice(0, 3)}.${tenDigits.slice(3, 6)}.${tenDigits.slice(6)}`;
      case 'dashes':
        return `+1-${tenDigits.slice(0, 3)}-${tenDigits.slice(3, 6)}-${tenDigits.slice(6)}`;
      default:
        return phone;
    }
  }

  return phone; // Return original if doesn't match expected patterns
}

/**
 * Format credit card number
 */
export function formatCreditCard(cardNumber: string, mask: boolean = false): string {
  // Remove spaces and dashes
  const digits = cardNumber.replace(/[\s-]/g, '');

  if (mask && digits.length > 4) {
    const lastFour = digits.slice(-4);
    const maskedDigits = '*'.repeat(digits.length - 4);
    const formatted = maskedDigits + lastFour;
    return formatted.replace(/(.{4})/g, '$1 ').trim();
  }

  // Add spaces every 4 digits
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

/**
 * Format social security number
 */
export function formatSSN(ssn: string, mask: boolean = true): string {
  const digits = ssn.replace(/\D/g, '');

  if (digits.length !== 9) {
    return ssn; // Return original if not 9 digits
  }

  if (mask) {
    return `***-**-${digits.slice(-4)}`;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
}

/**
 * Format text to title case
 */
export function toTitleCase(text: string): string {
  return text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

/**
 * Format text to sentence case
 */
export function toSentenceCase(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Format text to kebab-case
 */
export function toKebabCase(text: string): string {
  return text
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Format text to camelCase
 */
export function toCamelCase(text: string): string {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+/g, '');
}

/**
 * Format text to snake_case
 */
export function toSnakeCase(text: string): string {
  return text
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number, suffix: string = '...'): string {
  if (text.length <= length) {
    return text;
  }

  return text.slice(0, length - suffix.length) + suffix;
}

/**
 * Pluralize words
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) {
    return `${count} ${singular}`;
  }

  const pluralForm = plural || `${singular}s`;
  return `${count} ${pluralForm}`;
}

/**
 * Format initials from name
 */
export function getInitials(name: string, maxInitials: number = 2): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, maxInitials)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}

/**
 * Format address
 */
export function formatAddress(
  address: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  },
  format: 'single-line' | 'multi-line' = 'single-line'
): string {
  const parts = [
    address.street,
    address.city,
    address.state && address.zipCode
      ? `${address.state} ${address.zipCode}`
      : address.state || address.zipCode,
    address.country,
  ].filter(Boolean);

  if (format === 'multi-line') {
    return parts.join('\n');
  }

  return parts.join(', ');
}

/**
 * Format hashtags
 */
export function formatHashtags(text: string): string {
  return text.replace(/#(\w+)/g, '<span class="hashtag">#$1</span>');
}

/**
 * Format mentions
 */
export function formatMentions(text: string): string {
  return text.replace(/@(\w+)/g, '<span class="mention">@$1</span>');
}

/**
 * Remove HTML tags
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Format JSON for display
 */
export function formatJSON(obj: any, indent: number = 2): string {
  try {
    return JSON.stringify(obj, null, indent);
  } catch {
    return String(obj);
  }
}
