import { Backdrop, CircularProgress } from '@mui/material';

const LoadingSpinner: React.FC<{ loading: boolean }> = ({ loading }) => {
  return (
    <Backdrop
      open={loading}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <CircularProgress size="10rem" thickness={5} />
    </Backdrop>
  );
};

export default LoadingSpinner;
