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
import { useRouter } from 'next/router';

const authenticatedPages: { url: string; text: string; api: boolean }[] = [
  { url: 'overview', text: 'Overview', api: false },
  { url: 'statistics', text: 'Statistics', api: false },
  { url: 'history', text: 'Activity History', api: false },
  { url: 'join', text: 'Join or create home', api: false },
];
const unauthenticatedPages: { url: string; text: string; api: boolean }[] = [
  { url: '/api/auth/login', text: 'Login', api: true },
];

const ResponsiveAppBar = () => {
  const router = useRouter();

  const { data } = useUserQuery();
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    if (data && data.user) {
      setAuthenticated(true);
    } else setAuthenticated(false);
  }, [data]);

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  function route(path: string, absolute = false) {
    absolute ? window.location.assign(path) : router.push(path);
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <h1 onClick={() => route('/')}>LOGO</h1>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {(authenticated ? authenticatedPages : unauthenticatedPages).map(
              (page) => (
                <Button
                  key={page.url}
                  onClick={() => route(page.url, page.api)}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page.text}
                </Button>
              )
            )}
          </Box>
          {authenticated && data && data.user ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={data.user.name}
                    src={
                      data.user.picture && data.user.picture !== ''
                        ? data.user.picture
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
                  <Typography textAlign="center">Logout</Typography>
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
export default ResponsiveAppBar;
