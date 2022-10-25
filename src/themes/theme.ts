import { createTheme, ThemeOptions } from '@mui/material/styles';
import { grey, red } from '@mui/material/colors';

// assets
import colors from '../scss/themes-vars.module.scss';

// project imports
import componentStyleOverrides from './components';
import themePalette from './palette';
import themeTypography from './typography';

// A custom theme for this app
export const themeParams = {
  colors: colors,
  palette: {
    primary: {
      main: colors.primaryMain,
      text: grey.A700
    },
    secondary: {
      main: colors.secondaryMain,
      text: grey.A700,
    },
    error: {
      main: red.A400,
    },
    heading: grey.A700,
    paper: colors.paper,
    backgroundDefault: colors.paper,
    background: colors.primaryLight,
    transparent: colors.transparent,
    divider: grey.A200,
  },
}

const themeOptions: ThemeOptions = {
  direction: 'ltr',
  palette: themePalette(themeParams),
  typography: themeTypography(themeParams)
};

const theme = createTheme(themeOptions);
theme.components = componentStyleOverrides(themeParams);

export default theme;