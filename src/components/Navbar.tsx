import {
  ButtonBase,
  FormControl,
  InputLabel,
  Select,
  useTheme,
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import homeMissionLogo from '../../public/home_mission_grey.png';
import { useHomeQuery } from '../lib/graphql/operations/home.graphql';
import { useUserQuery } from '../lib/graphql/operations/user.graphql';
import { ColorModeContext } from '../pages/_app';
import ThemeSwitch from './ThemeSwitch';

type Pages = { url: string; text: string; api?: boolean }[];

const Navbar = () => {
  const { t } = useTranslation('common', { keyPrefix: 'Navbar' });
  const router = useRouter();
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);

  const { data: homeData } = useHomeQuery();
  const { data: userData } = useUserQuery();

  const pages: Pages = [
    { url: 'statistics', text: t('statistics') },
    { url: 'history', text: t('activity') },
  ];

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
          <ButtonBase>
            <Box sx={{ minWidth: 90 }} onClick={() => route('/overview')}>
              <Image
                alt="HomeMission logo"
                src={homeMissionLogo}
                layout="responsive"
              />
            </Box>
          </ButtonBase>
          <Box sx={{ flexGrow: 1 }}>
            {homeData?.home &&
              pages.map((page) => (
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
