// Ticket Priority Levels
export const TICKET_PRIORITIES = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
};

// Ticket Status Values
export const TICKET_STATUSES = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
  CANCELLED: 'CANCELLED'
};

// Priority Colors for UI
export const PRIORITY_COLORS = {
  [TICKET_PRIORITIES.LOW]: 'success',
  [TICKET_PRIORITIES.MEDIUM]: 'info',
  [TICKET_PRIORITIES.HIGH]: 'warning',
  [TICKET_PRIORITIES.URGENT]: 'error'
};

// Status Colors for UI
export const STATUS_COLORS = {
  [TICKET_STATUSES.OPEN]: 'error',
  [TICKET_STATUSES.IN_PROGRESS]: 'warning',
  [TICKET_STATUSES.RESOLVED]: 'success',
  [TICKET_STATUSES.CLOSED]: 'default',
  [TICKET_STATUSES.CANCELLED]: 'secondary'
};

// Priority Labels for display
export const PRIORITY_LABELS = {
  [TICKET_PRIORITIES.LOW]: 'Low',
  [TICKET_PRIORITIES.MEDIUM]: 'Medium',
  [TICKET_PRIORITIES.HIGH]: 'High',
  [TICKET_PRIORITIES.URGENT]: 'Urgent'
};

// Status Labels for display
export const STATUS_LABELS = {
  [TICKET_STATUSES.OPEN]: 'Open',
  [TICKET_STATUSES.IN_PROGRESS]: 'In Progress',
  [TICKET_STATUSES.RESOLVED]: 'Resolved',
  [TICKET_STATUSES.CLOSED]: 'Closed',
  [TICKET_STATUSES.CANCELLED]: 'Cancelled'
};

// Arrays for dropdowns
export const PRIORITY_OPTIONS = Object.values(TICKET_PRIORITIES);
export const STATUS_OPTIONS = Object.values(TICKET_STATUSES); 