import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import CloseIcon from '@material-ui/icons/Close';
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from '@material-ui/core';
import ArrowRightIcon from '../../../icons/ArrowRight';
import PencilAltIcon from '../../../icons/PencilAlt';
import SearchIcon from '../../../icons/Search';
import getInitials from '../../../utils/getInitials';
import Scrollbar from '../../Scrollbar';
import Label from '../../Label';
import toast from 'react-hot-toast';
import axios from 'axios';

const sortOptions = [
  {
    label: 'Last update (newest)',
    value: 'updatedAt|desc'
  },
  {
    label: 'Last update (oldest)',
    value: 'updatedAt|asc'
  },
  {
    label: 'Total orders (highest)',
    value: 'orders|desc'
  },
  {
    label: 'Total orders (lowest)',
    value: 'orders|asc'
  }
];

const getStatusLabel = (paymentStatus) => {
  const map = {
    true: {
      color: 'success',
      text: 'Active'
    },
    false: {
      color: 'error',
      text: 'InActive'
    }
  };

  const { text, color } = map[paymentStatus];

  return (
    <Label color={color}>
      {text}
    </Label>
  );
};

const applyFilters = (customers, query, filters) => customers
  .filter((customer) => {
    let matches = true;

    if (query) {
      const properties = ['driverName'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (customer[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && customer[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });

const applyPagination = (customers, page, limit) => customers
  .slice(page * limit, page * limit + limit);

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }

  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
};

const getComparator = (order, orderBy) => (order === 'desc'
  ? (a, b) => descendingComparator(a, b, orderBy)
  : (a, b) => -descendingComparator(a, b, orderBy));

const applySort = (customers, sort) => {
  const [orderBy, order] = sort.split('|');
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = customers.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const newOrder = comparator(a[0], b[0]);

    if (newOrder !== 0) {
      return newOrder;
    }

    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
};

const UserListTable = (props) => {
  const { deliveryVans, ...other } = props;
  const [currentTab, setCurrentTab] = useState('all');
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(sortOptions[0].value);
  const [filters, setFilters] = useState({
    hasAcceptedMarketing: null,
    isProspect: null,
    isReturning: null
  });

  const handleTabsChange = (event, value) => {
    const updatedFilters = {
      ...filters,
      hasAcceptedMarketing: null,
      isProspect: null,
      isReturning: null
    };

    if (value !== 'all') {
      updatedFilters[value] = true;
    }

    setFilters(updatedFilters);
    setSelectedCustomers([]);
    setCurrentTab(value);
  };

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const handleSelectAllCustomers = (event) => {
    setSelectedCustomers(event.target.checked
      ? deliveryVans.map((customer) => customer.id)
      : []);
  };

  const handleSelectOneCustomer = (event, customerId) => {
    if (!selectedCustomers.includes(customerId)) {
      setSelectedCustomers((prevSelected) => [...prevSelected, customerId]);
    } else {
      setSelectedCustomers((prevSelected) => prevSelected.filter((id) => id !== customerId));
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
  };

  const filteredCustomers = applyFilters(deliveryVans, query, filters);
  const sortedCustomers = applySort(filteredCustomers, sort);
  const paginatedCustomers = applyPagination(sortedCustomers, page, limit);
  const enableBulkActions = selectedCustomers.length > 0;
  const selectedSomeCustomers = selectedCustomers.length > 0
    && selectedCustomers.length < deliveryVans.length;
  const selectedAllCustomers = selectedCustomers.length === deliveryVans.length;

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    const withID = selectedCustomers.map((item) => `ids=${item}`).join('&')
    console.log("WITHID", withID);
    const resp = axios.delete(`https://mi.duceapps.com/api/v1/van?${withID}`)
      .then(response => {
        if (response.status === 200) {
          toast.error('Delivery Van Deleted!');
          setTimeout(() => {
            window.location.reload(false);
          }, 1500);
        }
      });
  };
  const handleCancel = () => {
    setOpen(false);
  };
  // console.log("delivery Vans Props Data", deliveryVans);

  return (
    <Card {...other}>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          m: -1,
          p: 2
        }}
      >
        <Box
          sx={{
            m: 1,
            maxWidth: '100%',
            width: 500
          }}
        >
          <TextField
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {query !== "" ? (
                    <>
                      <IconButton
                        style={{ position: 'absolute', right: 10, top: 17, width: 30, height: 20, }}
                        variant="outlined"
                        size="small"
                        onClick={() => setQuery("")}
                      >
                        <CloseIcon fontSize="small"
                        />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton
                      style={{ position: 'absolute', right: 10, top: 17, width: 30, height: 20, }}
                      variant="outlined"
                      size="small"
                    >
                      <SearchIcon fontSize="small" />
                    </IconButton>
                  )}
                </InputAdornment>
              )
            }}
            onChange={handleQueryChange}
            placeholder="Search"
            value={query}
            variant="outlined"
          />
        </Box>
      </Box>
      {enableBulkActions && (
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              backgroundColor: 'background.paper',
              mt: '6px',
              position: 'absolute',
              px: '4px',
              width: '100%',
              zIndex: 2
            }}
          >
            <Checkbox
              checked={selectedAllCustomers}
              color="primary"
              indeterminate={selectedSomeCustomers}
              onChange={handleSelectAllCustomers}
            />
            <Button
              color="primary"
              sx={{ ml: 2 }}
              variant="outlined"
              onClick={handleClickOpen}
            >
              Delete
            </Button>
            <Dialog
              open={open}
              onClose={handleClose}
              onBackdropClick="false"
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to Delete Delivery Van.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleClose} autoFocus >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Box>
      )}
      <Scrollbar>
        <Box sx={{ minWidth: 700 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAllCustomers}
                    color="primary"
                    indeterminate={selectedSomeCustomers}
                    onChange={handleSelectAllCustomers}
                  />
                </TableCell>
                <TableCell>
                  Make & Model
                </TableCell>
                <TableCell>
                  License Number
                </TableCell>
                <TableCell>
                  Driver
                </TableCell>
                <TableCell>
                  Color of Vehicle
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
                <TableCell align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCustomers.map((deliveryvan) => {
                const isCustomerSelected = selectedCustomers.includes(deliveryvan.id);

                return (
                  <TableRow
                    hover
                    key={deliveryvan.id}
                    selected={isCustomerSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isCustomerSelected}
                        color="primary"
                        onChange={(event) => handleSelectOneCustomer(event, deliveryvan.id)}
                        value={isCustomerSelected}
                      />
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex'
                        }}
                      >
                        <Avatar
                          src={deliveryvan.imageUrl}
                          sx={{
                            height: 42,
                            width: 42
                          }}
                        >
                          {getInitials(deliveryvan.make)}
                        </Avatar>
                        <Box sx={{ ml: 1 }}>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to={`/dashboard/delivery-vans/${deliveryvan.id}`}
                            variant="subtitle2"
                          >
                            {deliveryvan.make}
                          </Link>
                          <Typography
                            color="textSecondary"
                            variant="body2"
                          >
                            {deliveryvan.model}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {deliveryvan.licensePlateNumber}
                    </TableCell>
                    <TableCell>
                      {deliveryvan.driverName}
                    </TableCell>
                    <TableCell>
                      {deliveryvan.color}
                    </TableCell>
                    <TableCell>
                      {getStatusLabel(deliveryvan.active)}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        component={RouterLink}
                        to={`/dashboard/delivery-vans/${deliveryvan.id}/edit`}
                      >
                        <PencilAltIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        component={RouterLink}
                        to={`/dashboard/delivery-vans/${deliveryvan.id}`}
                      >
                        <ArrowRightIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={filteredCustomers.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

UserListTable.propTypes = {
  deliveryVans: PropTypes.array.isRequired
};

export default UserListTable;
