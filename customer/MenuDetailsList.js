import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from '@material-ui/core';
// import Label from '../../Label';

const MenuDetailsList = (props) => {
  const { id, name, ...other } = props;

  /* const getStatusLabel = (paymentStatus) => {
    const map = {
      canceled: {
        color: 'error',
        text: 'Canceled'
      },
      Active: {
        color: 'success',
        text: 'Active'
      },
      pending: {
        color: 'warning',
        text: 'Pending'
      },
      InActive: {
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
  }; */

  return (
    <Card {...other}>
      <CardHeader title={name} />
      <Divider />
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Name
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {name}
              </Typography>

            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography
                color="textPrimary"
                variant="subtitle2"
              >
                Id
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                color="textSecondary"
                variant="body2"
              >
                {id}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
};

MenuDetailsList.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};

export default MenuDetailsList;
