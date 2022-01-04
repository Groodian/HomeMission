import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useUserQuery } from '../lib/graphql/operations/user.graphql';
import { useEffect, useState } from 'react';
import { ThemeSwitch } from './ThemeSwitch';
import { useRouter } from 'next/router';
import { ColorModeContext } from '../pages/_app';
import { useTranslation } from 'next-i18next';
import { FormControl, InputLabel, Select } from '@mui/material';
import { useHomeQuery } from '../lib/graphql/operations/home.graphql';

const Navbar = () => {
  const { t } = useTranslation('Navbar');
  const router = useRouter();
  const colorMode = React.useContext(ColorModeContext);

  const { data: homeData } = useHomeQuery();
  const { data: userData } = useUserQuery();
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  const unauthenticatedPages: { url: string; text: string; api: boolean }[] = [
    { url: '/api/auth/login', text: t('login'), api: true },
  ];
  const authenticatedPagesWithHome: {
    url: string;
    text: string;
    api: boolean;
  }[] = [
    { url: 'overview', text: t('overview'), api: false },
    { url: 'statistics', text: t('statistics'), api: false },
    { url: 'history', text: t('activity'), api: false },
  ];
  const authenticatedPagesNoHome: {
    url: string;
    text: string;
    api: boolean;
  }[] = [{ url: 'join', text: t('join'), api: false }];

  useEffect(() => {
    if (userData && userData.user) {
      setAuthenticated(true);
    } else setAuthenticated(false);
  }, [userData]);

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
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <h1 onClick={() => route('/')}>LOGO</h1>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {(authenticated
              ? homeData?.home
                ? authenticatedPagesWithHome
                : authenticatedPagesNoHome
              : unauthenticatedPages
            ).map((page) => (
              <Button
                key={page.url}
                onClick={() => route(page.url, page.api)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.text}
              </Button>
            ))}
          </Box>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="language-select-label">
                {t('language')}
              </InputLabel>
              <Select
                labelId="language-select-label"
                id="language-select"
                label={t('language')}
                value={''}
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
            defaultChecked={colorMode.getMode() === 'dark'}
            onChange={(event) => {
              colorMode.setMode(event.target.checked ? 'dark' : 'light');
            }}
          />
          {authenticated && userData && userData.user ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title={t('settings') as string}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={userData.user.name}
                    src={
                      userData.user.picture && userData.user.picture !== ''
                        ? userData.user.picture
                        : ''
                    }
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
          ) : (
            <></>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;
