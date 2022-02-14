import { ThemeOptions } from '@mui/material';
import { LoadingButtonProps } from '@mui/lab';

const commonTheme: ThemeOptions & {
  components: { MuiLoadingButton: LoadingButtonProps };
} = {
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
    MuiButton: { defaultProps: { variant: 'outlined' } },
    MuiLoadingButton: { defaultProps: { variant: 'outlined' } },
  },
};

export default commonTheme;
