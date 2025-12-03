import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-fustat)',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 400,
    fontWeightBold: 500,
    h1: { fontWeight: 500 },
    h2: { fontWeight: 500 },
    h3: { fontWeight: 500 },
    h4: { fontWeight: 500 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    subtitle1: { fontWeight: 400 },
    subtitle2: { fontWeight: 400 },
    body1: { fontWeight: 400 },
    body2: { fontWeight: 400 },
    button: { fontWeight: 400 },
    caption: { fontWeight: 400 },
    overline: { fontWeight: 400 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 400,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontWeight: 400,
        },
      },
    },
  },
  cssVariables: true,
});

export default theme;
