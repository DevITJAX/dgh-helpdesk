/**
 * Utility functions for CSV export
 */

/**
 * Convert an array of objects to CSV format with improved error handling
 * @param {Array} data - Array of objects to convert
 * @param {Array} headers - Array of header objects with label and key properties
 * @returns {string} CSV content as string
 */
export const arrayToCSV = (data, headers) => {
  console.log('arrayToCSV called with:', { dataLength: data?.length, headersCount: headers?.length });
  
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('No data provided to arrayToCSV');
    return '';
  }

  if (!headers || !Array.isArray(headers) || headers.length === 0) {
    console.warn('No headers provided to arrayToCSV');
    return '';
  }

  try {
    // Create header row
    const headerRow = headers.map(header => header.label).join(',');
    console.log('Header row created:', headerRow);
    
    // Create data rows
    const dataRows = data.map((item, index) => {
      try {
        return headers.map(header => {
          const value = getNestedValue(item, header.key);
          // Escape quotes and wrap in quotes if contains comma, newline, or quotes
          const escapedValue = String(value || '').replace(/"/g, '""');
          return escapedValue.includes(',') || escapedValue.includes('\n') || escapedValue.includes('"') 
            ? `"${escapedValue}"` 
            : escapedValue;
        }).join(',');
      } catch (error) {
        console.error(`Error processing row ${index}:`, error);
        return headers.map(() => '').join(','); // Return empty row on error
      }
    });

    const result = [headerRow, ...dataRows].join('\n');
    console.log('CSV generation completed, total length:', result.length);
    return result;
  } catch (error) {
    console.error('Error in arrayToCSV:', error);
    return '';
  }
};

/**
 * Get nested value from object using dot notation with better null handling
 * @param {Object} obj - Object to extract value from
 * @param {string} path - Dot notation path (e.g., 'user.name')
 * @returns {*} The value at the path
 */
const getNestedValue = (obj, path) => {
  if (!obj || !path) return '';
  
  try {
    const value = path.split('.').reduce((current, key) => {
      if (current === null || current === undefined) return '';
      return current[key] !== undefined ? current[key] : '';
    }, obj);
    
    // Handle different data types
    if (value === null || value === undefined) return '';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (value instanceof Date) return value.toISOString();
    if (typeof value === 'object') return JSON.stringify(value);
    
    return String(value);
  } catch (error) {
    console.warn(`Error getting nested value for path "${path}":`, error);
    return '';
  }
};

/**
 * Download CSV file with enhanced error handling and browser compatibility
 * @param {string} csvContent - CSV content as string
 * @param {string} filename - Name of the file to download
 */
export const downloadCSV = (csvContent, filename) => {
  console.log('downloadCSV called with:', { csvContentLength: csvContent?.length, filename });
  
  if (!csvContent || csvContent.length === 0) {
    console.error('No CSV content to download');
    throw new Error('No CSV content to download');
  }
  
  try {
    // Create blob with proper encoding
    const blob = new Blob([csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    });
    console.log('Blob created:', { size: blob.size, type: blob.type });
    
    // Check if browser supports download attribute
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    console.log('URL created:', url);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    link.style.display = 'none';
    
    console.log('Link element created:', { href: link.href, download: link.download });
    
    // Add to DOM
    document.body.appendChild(link);
    console.log('Link appended to document body');
    
    // Trigger download
    link.click();
    console.log('Link click triggered');
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      console.log('Cleanup completed');
    }, 100);
    
    console.log('Download initiated successfully');
    
  } catch (error) {
    console.error('Error in downloadCSV:', error);
    
    // Fallback: try to open in new window
    try {
      console.log('Attempting fallback download method');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const newWindow = window.open(url, '_blank');
      
      if (newWindow) {
        console.log('Fallback: Opened CSV in new window');
      } else {
        console.error('Fallback: Could not open new window');
        throw new Error('Download failed and fallback also failed');
      }
    } catch (fallbackError) {
      console.error('Fallback download also failed:', fallbackError);
      throw error;
    }
  }
};

/**
 * Export tickets data to CSV
 * @param {Array} tickets - Array of ticket objects
 * @param {string} filename - Optional filename, defaults to 'tickets_export.csv'
 * @returns {string} CSV content as string
 */
export const exportTicketsToCSV = (tickets, filename = null) => {
  console.log('exportTicketsToCSV called with:', { tickets, filename });
  console.log('Tickets array length:', tickets?.length);
  console.log('Sample ticket structure:', tickets?.[0]);
  
  const headers = [
    { label: 'ID', key: 'id' },
    { label: 'Title', key: 'title' },
    { label: 'Description', key: 'description' },
    { label: 'Priority', key: 'priority' },
    { label: 'Status', key: 'status' },
    { label: 'Category', key: 'category' },
    { label: 'Created By', key: 'createdBy.fullName' },
    { label: 'Created By Username', key: 'createdBy.ldapUsername' },
    { label: 'Created By Email', key: 'createdBy.email' },
    { label: 'Created At', key: 'createdAt' },
    { label: 'Updated At', key: 'updatedAt' },
    { label: 'Resolved At', key: 'resolvedAt' },
    { label: 'Assigned To', key: 'assignedTo.fullName' },
    { label: 'Assigned To Username', key: 'assignedTo.ldapUsername' },
    { label: 'Assigned To Email', key: 'assignedTo.email' },
    { label: 'Due Date', key: 'dueDate' },
    { label: 'Resolution', key: 'resolution' },
    { label: 'Estimated Hours', key: 'estimatedHours' },
    { label: 'Actual Hours', key: 'actualHours' },
    { label: 'Customer Satisfaction', key: 'customerSatisfaction' },
    { label: 'Is Escalated', key: 'isEscalated' },
    { label: 'Escalation Reason', key: 'escalationReason' }
  ];

  const csvContent = arrayToCSV(tickets, headers);
  console.log('Generated CSV content length:', csvContent?.length);
  console.log('CSV content preview:', csvContent?.substring(0, 500));
  
  if (filename) {
    console.log('Attempting to download file:', filename);
    try {
      downloadCSV(csvContent, filename);
      console.log('Download initiated successfully');
    } catch (error) {
      console.error('Error during download:', error);
    }
  }
  
  return csvContent;
};

/**
 * Export dashboard statistics to CSV
 * @param {Object} statistics - Dashboard statistics object
 * @param {Array} recentTickets - Recent tickets array
 * @param {string} filename - Optional filename
 * @returns {string} CSV content as string
 */
export const exportDashboardStatsToCSV = (statistics, recentTickets = [], filename = null) => {
  const lines = [];
  
  // Header
  lines.push('DGH HelpDesk - Dashboard Report');
  lines.push(`Generated on: ${new Date().toLocaleString()}`);
  lines.push('');
  
  // Ticket Statistics
  lines.push('TICKET STATISTICS');
  lines.push('Metric,Value');
  lines.push(`Total Tickets,${statistics?.ticketStatistics?.totalTickets || 0}`);
  lines.push(`Open Tickets,${statistics?.ticketStatistics?.openTickets || 0}`);
  lines.push(`In Progress Tickets,${statistics?.ticketStatistics?.inProgressTickets || 0}`);
  lines.push(`Resolved Tickets,${statistics?.ticketStatistics?.resolvedTickets || 0}`);
  lines.push(`Closed Tickets,${statistics?.ticketStatistics?.closedTickets || 0}`);
  lines.push(`SLA Breached Tickets,${statistics?.ticketStatistics?.slaBreachedTickets || 0}`);
  lines.push('');
  
  // User Statistics
  lines.push('USER STATISTICS');
  lines.push('Metric,Value');
  lines.push(`Total Users,${statistics?.userStatistics?.totalUsers || 0}`);
  lines.push(`Active Users,${statistics?.userStatistics?.activeUsers || 0}`);
  lines.push(`Inactive Users,${statistics?.userStatistics?.inactiveUsers || 0}`);
  lines.push('');
  
  // Equipment Statistics
  lines.push('EQUIPMENT STATISTICS');
  lines.push('Metric,Value');
  lines.push(`Total Equipment,${statistics?.equipmentStatistics?.totalEquipment || 0}`);
  lines.push(`Online Equipment,${statistics?.equipmentStatistics?.onlineEquipment || 0}`);
  lines.push(`Offline Equipment,${statistics?.equipmentStatistics?.offlineEquipment || 0}`);
  lines.push(`Critical Equipment,${statistics?.equipmentStatistics?.criticalEquipment || 0}`);
  lines.push('');
  
  // Recent Tickets
  if (recentTickets && recentTickets.length > 0) {
    lines.push('RECENT TICKETS');
    lines.push('ID,Title,Priority,Status,Assigned To,Created At');
    recentTickets.forEach(ticket => {
      const assignedTo = ticket.assignedTo 
        ? (ticket.assignedTo.fullName || ticket.assignedTo.ldapUsername || ticket.assignedTo.email || 'Unknown')
        : 'Unassigned';
      lines.push(`${ticket.id},"${ticket.title || ''}",${ticket.priority || ''},${ticket.status || ''},"${assignedTo}","${ticket.createdAt || ''}"`);
    });
  }
  
  const csvContent = lines.join('\n');
  
  if (filename) {
    downloadCSV(csvContent, filename);
  }
  
  return csvContent;
}; 