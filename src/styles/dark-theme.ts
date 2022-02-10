import { createTheme } from '@mui/material/styles';
import commonTheme from './common-theme';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  ...commonTheme,
});

export default darkTheme;
