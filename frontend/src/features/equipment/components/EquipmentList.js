  import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Tooltip,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Computer as ComputerIcon,
  Router as RouterIcon,
  Print as PrintIcon,
  Storage as StorageIcon,
  PhoneAndroid as PhoneIcon,
  Monitor as MonitorIcon,
  Scanner as ScannerIcon,
  Videocam as ProjectorIcon,
  Security as FirewallIcon,
  PowerSettingsNew as UpsIcon,
  DeviceHub as SwitchIcon,
  Wifi as AccessPointIcon,
  HelpOutline as UnknownIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  CheckCircle as OnlineIcon,
  Cancel as OfflineIcon,
  Build as MaintenanceIcon,
  Archive as RetiredIcon,
  QuestionMark as UnknownStatusIcon,
  Settings as ManageIcon,
  SettingsInputComponent as UnmanageIcon
} from '@mui/icons-material';

const EquipmentList = ({
  equipment,
  loading,
  page,
  rowsPerPage,
  totalEquipment,
  filters,
  onPageChange,
  onRowsPerPageChange,
  onFiltersChange,
  onCreateEquipment,
  onEditEquipment,
  onDeleteEquipment,
  onUpdateStatus,
  onMarkAsManaged,
  onMarkAsUnmanaged
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState(null);

  const handleMenuOpen = (event, equipment) => {
    setAnchorEl(event.currentTarget);
    setSelectedEquipment(equipment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEquipment(null);
  };

  const handleDeleteClick = (equipment) => {
    setEquipmentToDelete(equipment);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    if (equipmentToDelete) {
      onDeleteEquipment(equipmentToDelete.id);
    }
    setDeleteDialogOpen(false);
    setEquipmentToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setEquipmentToDelete(null);
  };

  const handleStatusChange = (newStatus) => {
    if (selectedEquipment) {
      onUpdateStatus(selectedEquipment.id, newStatus);
    }
    handleMenuClose();
  };

  const handleMarkAsManaged = () => {
    if (selectedEquipment) {
      onMarkAsManaged(selectedEquipment.id);
    }
    handleMenuClose();
  };

  const handleMarkAsUnmanaged = () => {
    if (selectedEquipment) {
      onMarkAsUnmanaged(selectedEquipment.id);
    }
    handleMenuClose();
  };

  const handleFilterChange = (field, value) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: '',
      equipmentType: '',
      status: '',
      location: '',
      isManaged: null
    });
  };

  const getEquipmentTypeIcon = (type) => {
    switch (type) {
      case 'DESKTOP':
      case 'LAPTOP':
        return <ComputerIcon fontSize="small" />;
      case 'SERVER':
        return <StorageIcon fontSize="small" />;
      case 'PRINTER':
        return <PrintIcon fontSize="small" />;
      case 'ROUTER':
        return <RouterIcon fontSize="small" />;
      case 'SWITCH':
        return <SwitchIcon fontSize="small" />;
      case 'ACCESS_POINT':
        return <AccessPointIcon fontSize="small" />;
      case 'FIREWALL':
        return <FirewallIcon fontSize="small" />;
      case 'UPS':
        return <UpsIcon fontSize="small" />;
      case 'SCANNER':
        return <ScannerIcon fontSize="small" />;
      case 'PROJECTOR':
        return <ProjectorIcon fontSize="small" />;
      case 'PHONE':
        return <PhoneIcon fontSize="small" />;
      case 'MONITOR':
        return <MonitorIcon fontSize="small" />;
      case 'STORAGE':
        return <StorageIcon fontSize="small" />;
      default:
        return <UnknownIcon fontSize="small" />;
    }
  };

  const getEquipmentTypeColor = (type) => {
    switch (type) {
      case 'DESKTOP':
      case 'LAPTOP':
        return 'primary';
      case 'SERVER':
        return 'error';
      case 'PRINTER':
        return 'secondary';
      case 'ROUTER':
      case 'SWITCH':
      case 'ACCESS_POINT':
        return 'info';
      case 'FIREWALL':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ONLINE':
        return <OnlineIcon fontSize="small" />;
      case 'OFFLINE':
        return <OfflineIcon fontSize="small" />;
      case 'MAINTENANCE':
        return <MaintenanceIcon fontSize="small" />;
      case 'RETIRED':
        return <RetiredIcon fontSize="small" />;
      default:
        return <UnknownStatusIcon fontSize="small" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ONLINE':
        return 'success';
      case 'OFFLINE':
        return 'error';
      case 'MAINTENANCE':
        return 'warning';
      case 'RETIRED':
        return 'default';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEquipmentDisplayName = (equipment) => {
    if (!equipment) return 'Unknown Device';
    return equipment.hostname || equipment.ipAddress || 'Unknown Device';
  };

  const equipmentTypes = [
    { value: 'DESKTOP', label: 'Desktop Computer' },
    { value: 'LAPTOP', label: 'Laptop Computer' },
    { value: 'SERVER', label: 'Server' },
    { value: 'PRINTER', label: 'Printer' },
    { value: 'SWITCH', label: 'Network Switch' },
    { value: 'ROUTER', label: 'Router' },
    { value: 'ACCESS_POINT', label: 'Access Point' },
    { value: 'FIREWALL', label: 'Firewall' },
    { value: 'UPS', label: 'UPS' },
    { value: 'SCANNER', label: 'Scanner' },
    { value: 'PROJECTOR', label: 'Projector' },
    { value: 'PHONE', label: 'IP Phone' },
    { value: 'MONITOR', label: 'Monitor' },
    { value: 'STORAGE', label: 'Storage Device' },
    { value: 'UNKNOWN', label: 'Unknown' }
  ];

  const statusOptions = [
    { value: 'ONLINE', label: 'Online' },
    { value: 'OFFLINE', label: 'Offline' },
    { value: 'MAINTENANCE', label: 'Under Maintenance' },
    { value: 'RETIRED', label: 'Retired' },
    { value: 'UNKNOWN', label: 'Unknown' }
  ];

  return (
    <Box>
      {/* Filters and Actions */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search equipment..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={filters.equipmentType}
                label="Type"
                onChange={(e) => handleFilterChange('equipmentType', e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                {equipmentTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="">All Status</MenuItem>
                {statusOptions.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              size="small"
              label="Location"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <FormControl fullWidth size="small">
              <InputLabel>Managed</InputLabel>
              <Select
                value={filters.isManaged === null ? '' : filters.isManaged.toString()}
                label="Managed"
                onChange={(e) => {
                  const value = e.target.value;
                  handleFilterChange('isManaged', value === '' ? null : value === 'true');
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="true">Managed</MenuItem>
                <MenuItem value="false">Unmanaged</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={1}>
            <Tooltip title="Clear Filters">
              <IconButton onClick={handleClearFilters}>
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreateEquipment}
              fullWidth
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Equipment Table */}
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Equipment</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Managed</TableCell>
              <TableCell>Last Seen</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Loading equipment...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : equipment.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No equipment found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              equipment.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 40, height: 40, bgcolor: `${getEquipmentTypeColor(item.equipmentType)}.main` }}>
                        {getEquipmentTypeIcon(item.equipmentType)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="medium">
                          {getEquipmentDisplayName(item)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.ipAddress}
                        </Typography>
                        {item.manufacturer && item.model && (
                          <Typography variant="caption" color="text.secondary">
                            {item.manufacturer} {item.model}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getEquipmentTypeIcon(item.equipmentType)}
                      label={item.equipmentType?.replace('_', ' ') || 'UNKNOWN'}
                      color={getEquipmentTypeColor(item.equipmentType)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(item.status)}
                      label={item.status?.replace('_', ' ') || 'UNKNOWN'}
                      color={getStatusColor(item.status)}
                      size="small"
                      variant={item.status === 'ONLINE' ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {item.location || 'Not specified'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.isManaged ? 'Managed' : 'Unmanaged'}
                      color={item.isManaged ? 'success' : 'default'}
                      size="small"
                      variant={item.isManaged ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(item.lastSeen)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit Equipment">
                      <IconButton
                        size="small"
                        onClick={() => onEditEquipment(item)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="More Actions">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, item)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={totalEquipment}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 200 }
        }}
      >
        <MenuItem onClick={() => onEditEquipment(selectedEquipment)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Equipment</ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={() => handleStatusChange('ONLINE')}>
          <ListItemIcon>
            <OnlineIcon fontSize="small" color="success" />
          </ListItemIcon>
          <ListItemText>Mark Online</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => handleStatusChange('OFFLINE')}>
          <ListItemIcon>
            <OfflineIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Mark Offline</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => handleStatusChange('MAINTENANCE')}>
          <ListItemIcon>
            <MaintenanceIcon fontSize="small" color="warning" />
          </ListItemIcon>
          <ListItemText>Mark Under Maintenance</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => handleStatusChange('RETIRED')}>
          <ListItemIcon>
            <RetiredIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Mark Retired</ListItemText>
        </MenuItem>
        
        <Divider />
        
        {selectedEquipment?.isManaged ? (
          <MenuItem onClick={handleMarkAsUnmanaged}>
            <ListItemIcon>
              <UnmanageIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Mark as Unmanaged</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem onClick={handleMarkAsManaged}>
            <ListItemIcon>
              <ManageIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Mark as Managed</ListItemText>
          </MenuItem>
        )}
        
        <Divider />
        
        <MenuItem onClick={() => handleDeleteClick(selectedEquipment)} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Equipment</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Equipment
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete equipment "{getEquipmentDisplayName(equipmentToDelete)}"? 
            This action cannot be undone and will remove all associated data.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EquipmentList;