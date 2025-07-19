/**
 * Date and time utility functions
 */

export type DateInput = Date | string | number;

/**
 * Format date to common patterns
 */
export function formatDate(
  date: DateInput,
  format: 'short' | 'medium' | 'long' | 'full' | 'iso' | 'relative' = 'medium',
  locale: string = 'en-US'
): string {
  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString(locale, {
        year: '2-digit',
        month: 'numeric',
        day: 'numeric',
      });

    case 'medium':
      return dateObj.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

    case 'long':
      return dateObj.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

    case 'full':
      return dateObj.toLocaleDateString(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

    case 'iso':
      return dateObj.toISOString().split('T')[0] || '';

    case 'relative':
      return formatRelativeTime(dateObj);

    default:
      return dateObj.toLocaleDateString(locale);
  }
}

/**
 * Format time
 */
export function formatTime(
  date: DateInput,
  format: '12h' | '24h' | 'short' = '12h',
  locale: string = 'en-US'
): string {
  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Time';
  }

  switch (format) {
    case '12h':
      return dateObj.toLocaleTimeString(locale, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

    case '24h':
      return dateObj.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

    case 'short':
      return dateObj.toLocaleTimeString(locale, {
        hour: 'numeric',
        minute: '2-digit',
      });

    default:
      return dateObj.toLocaleTimeString(locale);
  }
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(date: DateInput, locale: string = 'en-US'): string {
  const dateObj = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  const intervals = [
    { unit: 'year', seconds: 31536000 },
    { unit: 'month', seconds: 2628000 },
    { unit: 'week', seconds: 604800 },
    { unit: 'day', seconds: 86400 },
    { unit: 'hour', seconds: 3600 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 },
  ] as const;

  for (const { unit, seconds } of intervals) {
    const interval = Math.floor(Math.abs(diffInSeconds) / seconds);
    if (interval >= 1) {
      return rtf.format(diffInSeconds > 0 ? -interval : interval, unit);
    }
  }

  return rtf.format(0, 'second');
}

/**
 * Get start of day, week, month, year
 */
export function startOf(date: DateInput, unit: 'day' | 'week' | 'month' | 'year'): Date {
  const dateObj = new Date(date);

  switch (unit) {
    case 'day':
      return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());

    case 'week':
      const startOfWeek = new Date(dateObj);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day;
      return new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), diff);

    case 'month':
      return new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);

    case 'year':
      return new Date(dateObj.getFullYear(), 0, 1);

    default:
      return dateObj;
  }
}

/**
 * Get end of day, week, month, year
 */
export function endOf(date: DateInput, unit: 'day' | 'week' | 'month' | 'year'): Date {
  const dateObj = new Date(date);

  switch (unit) {
    case 'day':
      return new Date(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate(),
        23,
        59,
        59,
        999
      );

    case 'week':
      const endOfWeek = new Date(dateObj);
      const day = endOfWeek.getDay();
      const diff = endOfWeek.getDate() + (6 - day);
      return new Date(endOfWeek.getFullYear(), endOfWeek.getMonth(), diff, 23, 59, 59, 999);

    case 'month':
      return new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0, 23, 59, 59, 999);

    case 'year':
      return new Date(dateObj.getFullYear(), 11, 31, 23, 59, 59, 999);

    default:
      return dateObj;
  }
}

/**
 * Add time to date
 */
export function addTime(
  date: DateInput,
  amount: number,
  unit: 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years'
): Date {
  const dateObj = new Date(date);

  switch (unit) {
    case 'milliseconds':
      return new Date(dateObj.getTime() + amount);

    case 'seconds':
      return new Date(dateObj.getTime() + amount * 1000);

    case 'minutes':
      return new Date(dateObj.getTime() + amount * 60000);

    case 'hours':
      return new Date(dateObj.getTime() + amount * 3600000);

    case 'days':
      return new Date(dateObj.getTime() + amount * 86400000);

    case 'weeks':
      return new Date(dateObj.getTime() + amount * 604800000);

    case 'months':
      const newMonth = new Date(dateObj);
      newMonth.setMonth(dateObj.getMonth() + amount);
      return newMonth;

    case 'years':
      const newYear = new Date(dateObj);
      newYear.setFullYear(dateObj.getFullYear() + amount);
      return newYear;

    default:
      return dateObj;
  }
}

/**
 * Check if date is today, yesterday, tomorrow
 */
export function isToday(date: DateInput): boolean {
  const dateObj = new Date(date);
  const today = new Date();
  return dateObj.toDateString() === today.toDateString();
}

export function isYesterday(date: DateInput): boolean {
  const dateObj = new Date(date);
  const yesterday = addTime(new Date(), -1, 'days');
  return dateObj.toDateString() === yesterday.toDateString();
}

export function isTomorrow(date: DateInput): boolean {
  const dateObj = new Date(date);
  const tomorrow = addTime(new Date(), 1, 'days');
  return dateObj.toDateString() === tomorrow.toDateString();
}

/**
 * Check if date is in the past or future
 */
export function isPast(date: DateInput): boolean {
  return new Date(date) < new Date();
}

export function isFuture(date: DateInput): boolean {
  return new Date(date) > new Date();
}

/**
 * Get time zone
 */
export function getTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Format duration (in milliseconds) to human readable format
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Parse different date formats
 */
export function parseDate(input: string): Date | null {
  const date = new Date(input);
  if (!isNaN(date.getTime())) {
    return date;
  }

  return null;
}
