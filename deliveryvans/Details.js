import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@material-ui/core';
import Label from '../../Label';
import useSettings from '../../../hooks/useSettings';
import { Fragment } from 'react';
import { format } from 'date-fns';

const CustomerInvoicesSummary = (props) => {
  const { deliveryvans, ...others } = props;
  const { settings } = useSettings();
  console.log("PROPS DETAIL PAGE", deliveryvans);

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


  const getOrderStatusLabel = (paymentStatus) => {
    const map = {
      Cancelled: {
        color: 'error',
        text: 'Cancelled'
      },
      Preparingfood: {
        color: 'info',
        text: 'Preparing Food'
      },
      Created: {
        color: 'secondary',
        text: 'Created'
      },
      Outfordelivery: {
        color: 'warning',
        text: 'Out For Delivery'
      },
      Delivered: {
        color: 'success',
        text: 'Delivered'
      }
    };

    const { text, color } = map[paymentStatus];

    const FormatDate = (input) => {
      var datePart = input.match(/\d+/g),
        year = datePart[0].substring(2), // get only two digits
        month = datePart[1], day = datePart[2];

      return day + '/' + month + '/' + year;
    }

    return (
      <Label color={color}>
        {text}
      </Label>
    );
  };
  return (
    <>
      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          lg={settings.compact ? 6 : 4}
          md={6}
          xl={settings.compact ? 6 : 3}
          xs={12}
        >
          <Card {...props}>
            <CardHeader title="Details" />
            <Divider />
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography
                      color="textPrimary"
                      variant="subtitle2"
                    >
                      Image
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <img src={deliveryvans.imageUrl} style={{ width: '120px', height: 'auto' }} alt="" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography
                      color="textPrimary"
                      variant="subtitle2"
                    >
                      Make
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color="textSecondary"
                      variant="body2"
                    >
                      {deliveryvans.make}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography
                      color="textPrimary"
                      variant="subtitle2"
                    >
                      Model
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color="textSecondary"
                      variant="body2"
                    >
                      {deliveryvans.model}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography
                      color="textPrimary"
                      variant="subtitle2"
                    >
                      License Number
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color="textSecondary"
                      variant="body2"
                    >
                      {deliveryvans.licensePlateNumber}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography
                      color="textPrimary"
                      variant="subtitle2"
                    >
                      Driver Name
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color="textSecondary"
                      variant="body2"
                    >
                      {deliveryvans.driverName}
                    </Typography>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <Typography
                      color="textPrimary"
                      variant="subtitle2"
                    >
                      Color of Vehicle
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color="textSecondary"
                      variant="body2"
                    >
                      {deliveryvans.color}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography
                      color="textPrimary"
                      variant="subtitle2"
                    >
                      Status
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color="textSecondary"
                      variant="body2"
                    >
                      {getStatusLabel(deliveryvans.active)}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </Grid>
        <Grid
          item
          lg={settings.compact ? 6 : 4}
          md={6}
          xl={settings.compact ? 6 : 3}
          xs={12}
        >
          <Card>
            <CardHeader title="Order Details" />
            <Divider />
            <CardContent>
              <List>
                {deliveryvans.orders.length > 0 ? (
                  <>
                    {deliveryvans.orders.map((item) => (
                      <>
                        <ListItem alignItems="flex-start">
                          {/**<ListItemAvatar>
                      <Avatar alt={item.orderStatus} src="/static/images/avatar/1.jpg" />
                    </ListItemAvatar>  */}
                          <ListItemText
                            primary={"#" + item.orderNumber}
                            secondary={
                              <Fragment>
                                <Typography
                                  variant="subtitle2"
                                  color="text.primary"
                                >
                                  Status :{getOrderStatusLabel(item.orderStatus.length > 10 ? item.orderStatus.replace(/\s+/g, '') : item.orderStatus)}
                                </Typography>
                                <Typography
                                  variant="subtitle2"
                                  color="text.primary"
                                >
                                  Address : {item.address} , {item.zipcode}
                                </Typography>
                                <Typography
                                  variant="subtitle2"
                                  color="text.primary"
                                >
                                  {/**{format(item.createdOn.slice(0, 19), 'yyyy-dd-MMTHH:mm:ss')}  */}
                                  Created On : {item.createdOn.slice(0, 10).split('-').reverse().join('/')} , {item.createdOn.slice(0, 19).split("T").pop()}

                                </Typography>
                              </Fragment>
                            }
                          />
                        </ListItem>
                        <Divider />
                      </>
                    ))}
                    <Divider variant="inset" component="li" />
                  </>
                ) : (<Typography>No Orders Found..!</Typography>)}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid >
    </>
  )
};

export default CustomerInvoicesSummary;
