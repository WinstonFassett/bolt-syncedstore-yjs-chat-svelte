import { 
  format, 
  isToday, 
  isYesterday, 
  isThisWeek, 
  isThisYear 
} from 'date-fns'

/**
 * Format a date for the chat interface
 * Shows different formats depending on how recent the date is
 */
export function formatChatDate(timestamp: number): string {
  const date = new Date(timestamp)
  
  if (isToday(date)) {
    return format(date, 'h:mm a')
  } else if (isYesterday(date)) {
    return 'Yesterday ' + format(date, 'h:mm a')
  } else if (isThisWeek(date)) {
    return format(date, 'EEEE h:mm a')
  } else if (isThisYear(date)) {
    return format(date, 'MMM d, h:mm a')
  } else {
    return format(date, 'MMM d, yyyy h:mm a')
  }
}

/**
 * Format a date as a day divider in the chat
 */
export function formatDateDivider(timestamp: number): string {
  const date = new Date(timestamp)
  
  if (isToday(date)) {
    return 'Today'
  } else if (isYesterday(date)) {
    return 'Yesterday'
  } else if (isThisWeek(date)) {
    return format(date, 'EEEE')
  } else if (isThisYear(date)) {
    return format(date, 'MMMM d')
  } else {
    return format(date, 'MMMM d, yyyy')
  }
}

/**
 * Check if two dates are on the same day
 */
export function isSameDay(timestamp1: number, timestamp2: number): boolean {
  const date1 = new Date(timestamp1)
  const date2 = new Date(timestamp2)
  
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

/**
 * Format a date for the "last updated" display
 */
export function formatLastUpdated(timestamp: number): string {
  const date = new Date(timestamp)
  
  if (isToday(date)) {
    return 'Today at ' + format(date, 'h:mm a')
  } else if (isYesterday(date)) {
    return 'Yesterday at ' + format(date, 'h:mm a')
  } else if (isThisWeek(date)) {
    return format(date, 'EEEE') + ' at ' + format(date, 'h:mm a')
  } else {
    return format(date, 'MMM d, yyyy') + ' at ' + format(date, 'h:mm a')
  }
}