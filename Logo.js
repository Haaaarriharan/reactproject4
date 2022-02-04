import { experimentalStyled } from '@material-ui/core/styles';

const platformIcons = {
  Logo: '/static/logo.png',
};

const LogoRoot = experimentalStyled('img')``;

const Logo = (props) => (
  <LogoRoot
    height="40"
    src={platformIcons.Logo}
    width="86"
    {...props}
  />
);

export default Logo;
