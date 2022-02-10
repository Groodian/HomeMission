import { createTheme } from '@mui/material/styles';
import commonTheme from './common-theme';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
  ...commonTheme,
});

export default lightTheme;
