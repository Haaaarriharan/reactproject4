import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';
import { experimentalStyled } from '@material-ui/core/styles';
import MainSidebar from './MainSidebar';

const MainLayoutRoot = experimentalStyled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  height: '100%',
}));

const MainLayout = ({ children }) => (
  <MainLayoutRoot>
    <MainSidebar />
    {children || <Outlet />}
  </MainLayoutRoot>
);

MainLayout.propTypes = {
  children: PropTypes.node
};

export default MainLayout;
