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
import ThemeSwitch from './ThemeSwitch';
import { useRouter } from 'next/router';
import { ColorModeContext } from '../pages/_app';
import { useTranslation } from 'next-i18next';
import { FormControl, InputLabel, Select, useTheme } from '@mui/material';
import { useHomeQuery } from '../lib/graphql/operations/home.graphql';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';

type Pages = { url: string; text: string; api?: boolean }[];

const Navbar = () => {
  const { t } = useTranslation('Navbar');
  const router = useRouter();
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);

  const { data: homeData } = useHomeQuery();
  const { data: userData } = useUserQuery();

  const unauthenticatedPages: Pages = [
    { url: '/api/auth/login', text: t('login'), api: true },
  ];
  const authenticatedPagesWithHome: Pages = [
    { url: 'overview', text: t('overview') },
    { url: 'statistics', text: t('statistics') },
    { url: 'history', text: t('activity') },
  ];
  const authenticatedPagesNoHome: Pages = [{ url: 'join', text: t('join') }];

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
          <IconButton
            size="large"
            onClick={() => route('/')}
            color="inherit"
            sx={{ mr: 2 }}
          >
            <HomeRoundedIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            {(userData?.user
              ? homeData?.home
                ? authenticatedPagesWithHome
                : authenticatedPagesNoHome
              : unauthenticatedPages
            ).map((page) => (
              <Button
                key={page.url}
                onClick={() => route(page.url, page.api)}
                sx={{ my: 2, color: 'white' }}
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
