import React from 'react';
import {
  AppBar,
  Avatar,
  AvatarGroup,
  Box,
  ButtonBase,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  ListItemIcon,
  Menu,
  MenuItem,
  outlinedInputClasses,
  Select,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import homeMissionLogo from '../../public/home_mission_grey.png';
import { useUserQuery } from '../lib/graphql/operations/user.graphql';
import { ColorModeContext } from '../pages/_app';
import ThemeSwitch from './ThemeSwitch';
import { useHomeQuery } from '../lib/graphql/operations/home.graphql';

const Navbar = () => {
  const { t } = useTranslation('common', { keyPrefix: 'Navbar' });
  const router = useRouter();
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);

  const { data: userData } = useUserQuery();
  const { data: homeData } = useHomeQuery();

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
            <Box sx={{ minWidth: 90 }} onClick={() => router.push('/overview')}>
              <Image
                alt="HomeMission logo"
                src={homeMissionLogo}
                layout="responsive"
                priority
              />
            </Box>
          </ButtonBase>
          <Box
            sx={{ display: 'inline-flex', alignItems: 'center', flexGrow: 1 }}
          >
            {homeData && homeData.home && (
              <>
                <Typography p="0 1em" variant={'h4'} component="span">
                  {homeData.home.name}
                </Typography>
                <AvatarGroup max={3}>
                  {homeData.home.users.map((user) => (
                    <Tooltip key={user.id} title={user.name}>
                      <Avatar alt={user.name} src={user.picture} />
                    </Tooltip>
                  ))}
                </AvatarGroup>
              </>
            )}
          </Box>
          <Box sx={{ minWidth: 140 }}>
            <FormControl fullWidth size="small">
              <InputLabel
                id="language-select-label"
                sx={{
                  color: `${theme.palette.text.primary} !important`,
                }}
              >
                {t('language')}
              </InputLabel>
              <Select
                id="language-select"
                sx={{
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? theme.palette.background.default
                      : 'none',
                  [`&.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
                    {
                      borderColor: 'inherit',
                    },
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
                <MenuItem value={'de'}>
                  <Box component="span" sx={{ mr: 2 }}>
                    <Image
                      width="16"
                      height="12"
                      src={`https://flagcdn.com/16x12/de.png`}
                      alt=""
                    />
                  </Box>
                  Deutsch
                </MenuItem>
                <MenuItem value={'en'}>
                  <Box component="span" sx={{ mr: 2 }}>
                    <Image
                      width="16"
                      height="12"
                      src={`https://flagcdn.com/16x12/us.png`}
                      alt=""
                    />
                  </Box>
                  English
                </MenuItem>
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
                  onClick={() => window.location.assign('/api/auth/logout')}
                >
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
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
