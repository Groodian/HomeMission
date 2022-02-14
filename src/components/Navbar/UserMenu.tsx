import React from 'react';
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Edit, Logout } from '@mui/icons-material';
import { useTranslation } from 'next-i18next';
import {
  useRenameUserMutation,
  useUserQuery,
} from '../../lib/graphql/operations/user.graphql';
import { useSnackbar } from 'notistack';

const UserMenu: React.FC = () => {
  const { t } = useTranslation('common', { keyPrefix: 'Navbar' });
  const { enqueueSnackbar } = useSnackbar();

  const { data } = useUserQuery();
  const [renameUser, { loading }] = useRenameUserMutation();

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [newName, setNewName] = React.useState<string | null>(null);

  const handleChangeName: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    const name = newName?.trim();
    if (!name) return;
    try {
      await renameUser({ variables: { name } });
      enqueueSnackbar(t('change-name-success', { newName: name }), {
        variant: 'success',
      });
    } catch (err) {
      event.preventDefault();
      enqueueSnackbar(t('change-name-error'), { variant: 'error' });
    }
    setNewName(null);
  };

  return data?.user ? (
    <>
      <Tooltip title={t('settings') as string}>
        <IconButton
          onClick={(event) => setAnchorElUser(event.currentTarget)}
          sx={{ p: 0 }}
        >
          <Avatar alt={data.user.name} src={data.user.picture} />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={() => setAnchorElUser(null)}
      >
        <Typography fontWeight="bold" px={'16px'} py={'6px'}>
          Hi {data.user.name}
        </Typography>
        <Divider />
        <MenuItem
          onClick={() => {
            setNewName('');
            setAnchorElUser(null);
          }}
        >
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <Typography>{t('change-name')}</Typography>
        </MenuItem>
        <MenuItem onClick={() => window.location.assign('/api/auth/logout')}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <Typography>{t('logout')}</Typography>
        </MenuItem>
      </Menu>
      <Dialog open={newName !== null} aria-labelledby="dialog-title">
        <form onSubmit={handleChangeName}>
          <DialogTitle id="dialog-title">{t('change-name')}</DialogTitle>
          <DialogContent>
            <TextField
              required
              autoFocus
              label={t('new-name')}
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              disabled={loading}
              fullWidth
              margin="dense"
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button
              type="button"
              onClick={() => setNewName(null)}
              disabled={loading}
              variant="outlined"
            >
              {t('dialog-cancel')}
            </Button>
            <LoadingButton type="submit" loading={loading} variant="outlined">
              {t('change-name')}
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  ) : null;
};

export default UserMenu;
