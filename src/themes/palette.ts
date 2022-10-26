import { PaletteOptions } from "@mui/material/styles";
import { themeParams } from "./theme";

export default function themePalette(theme: typeof themeParams): PaletteOptions {
  return {
    primary: {
      light: theme.colors.primaryLight,
      main: theme.colors.primaryMain,
      dark: theme.colors.primaryDark,
      200: theme.colors.primary200,
      800: theme.colors.primary800
    },
    secondary: {
      light: theme.colors.secondaryLight,
      main: theme.colors.secondaryMain,
      dark: theme.colors.secondaryDark,
      200: theme.colors.secondary200,
      800: theme.colors.secondary800
    },
    error: {
      light: theme.colors.errorLight,
      main: theme.colors.errorMain,
      dark: theme.colors.errorDark
    },
    warning: {
      light: theme.colors.warningLight,
      main: theme.colors.warningMain,
      dark: theme.colors.warningDark
    },
    success: {
      light: theme.colors.successLight,
      200: theme.colors.success200,
      main: theme.colors.successMain,
      dark: theme.colors.successDark,
      contrastText: 'white'
    },
    text: {
      primary: theme.palette.primary.text,
      secondary: theme.palette.secondary.text,
    },
    background: {
      paper: theme.colors.paper,
      default: theme.colors.paper
    }
  };
}