import React from 'react';
import {
  AppBar,
  Avatar,
  Box,
  ButtonBase,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import homeMissionLogo from '../../public/home_mission_grey.png';
import { useUserQuery } from '../lib/graphql/operations/user.graphql';
import { ColorModeContext } from '../pages/_app';
import ThemeSwitch from './ThemeSwitch';

const Navbar = () => {
  const { t } = useTranslation('common', { keyPrefix: 'Navbar' });
  const router = useRouter();
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);

  const { data: userData } = useUserQuery();

  function route(path: string, absolute = false) {
    absolute ? window.location.assign(path) : router.push(path);
  }

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="sticky" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
      <Container
        maxWidth="xl"
        sx={{ backgroundColor: 'initial', zIndex: 'inherit' }}
      >
        <Toolbar disableGutters>
          <ButtonBase>
            <Box sx={{ minWidth: 90 }} onClick={() => route('/overview')}>
              <Image
                alt="HomeMission logo"
                src={homeMissionLogo}
                layout="responsive"
              />
            </Box>
          </ButtonBase>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="language-select-label">
                {t('language')}
              </InputLabel>
              <Select
                id="language-select"
                sx={{
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? theme.palette.background.default
                      : 'none',
                }}
                labelId="language-select-label"
                label={t('language')}
                value={router.locale}
                onChange={(event) => {
                  router.push(router.route, router.route, {
                    locale: event.target.value,
                  });
                }}
              >
                <MenuItem value={'de'}>{t('german')}</MenuItem>
                <MenuItem value={'en'}>{t('english')}</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <ThemeSwitch
            defaultChecked={theme.palette.mode === 'dark'}
            onChange={(event) => {
              colorMode.setMode(event.target.checked ? 'dark' : 'light');
            }}
          />
          {userData?.user && (
            <Box>
              <Tooltip title={t('settings') as string}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={userData.user.name}
                    src={userData.user.picture}
                  />
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
                  onClick={() => route('/api/auth/logout', true)}
                >
                  <Typography textAlign="center">{t('logout')}</Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;
