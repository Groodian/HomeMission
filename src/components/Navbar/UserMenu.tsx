import React from 'react';
import {
  Avatar,
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useTranslation } from 'next-i18next';
import { useUserQuery } from '../../lib/graphql/operations/user.graphql';

const UserMenu: React.FC = () => {
  const { t } = useTranslation('common', { keyPrefix: 'Navbar' });
  const { data: userData } = useUserQuery();

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return userData?.user ? (
    <Box>
      <Tooltip title={t('settings') as string}>
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt={userData.user.name} src={userData.user.picture} />
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
        onClose={handleCloseUserMenu}
      >
        <MenuItem
          key={'logout'}
          onClick={() => window.location.assign('/api/auth/logout')}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <Typography textAlign="center">{t('logout')}</Typography>
        </MenuItem>
      </Menu>
    </Box>
  ) : null;
};

export default UserMenu;
