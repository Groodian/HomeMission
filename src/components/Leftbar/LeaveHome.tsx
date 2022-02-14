import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Logout } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useTranslation } from 'next-i18next';
import { useSnackbar } from 'notistack';
import {
  HomeDocument,
  useLeaveHomeMutation,
} from '../../lib/graphql/operations/home.graphql';

const LeaveHome: React.FC = () => {
  const { t } = useTranslation('common', { keyPrefix: 'Leftbar.LeaveHome' });
  const { enqueueSnackbar } = useSnackbar();
  const [leaveHome, { loading }] = useLeaveHomeMutation();
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <ListItem button onClick={() => setOpen(true)}>
        <ListItemIcon>
          <Logout />
        </ListItemIcon>
        <ListItemText primary={t('leave-home')} />
      </ListItem>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="dialog-title"
        maxWidth="md"
      >
        <DialogTitle id="dialog-title">{t('dialog-title')}</DialogTitle>
        <DialogContent>
          <DialogContentText color={(theme) => theme.palette.warning.main}>
            {t('dialog-warning')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={loading}>
            {t('dialog-cancel')}
          </Button>
          <LoadingButton
            loading={loading}
            color="warning"
            onClick={handleLeave}
          >
            {t('leave-home')}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );

  async function handleLeave() {
    try {
      await leaveHome({
        update(cache, { data }) {
          if (!data) return;
          cache.writeQuery({
            query: HomeDocument,
            data: { home: data.leaveHome },
          });
        },
      });
      enqueueSnackbar(t('leave-success'), { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(t('leave-error'), { variant: 'error' });
    }
  }
};

export default LeaveHome;
