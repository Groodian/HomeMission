import { ThemeOptions } from '@mui/material/styles';

const commonTheme: ThemeOptions = {
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h2: 'h1',
          h3: 'h1',
          h4: 'h2',
          h5: 'h3',
          h6: 'h4',
        },
      },
    },
  },
  typography: { h5: undefined, h6: undefined },
};

export default commonTheme;
