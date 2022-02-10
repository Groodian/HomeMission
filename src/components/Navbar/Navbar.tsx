import React from 'react';
import {
  AppBar,
  Box,
  ButtonBase,
  Container,
  Toolbar,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import homeMissionLogo from '../../../public/home_mission_grey.png';
import { ColorModeContext } from '../../pages/_app';
import ThemeSwitch from './ThemeSwitch';
import LanguageSelect from './LanguageSelect';
import UserMenu from './UserMenu';
import HomeData from './HomeData';

const Navbar: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);

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
            <HomeData />
          </Box>
          <LanguageSelect />
          <ThemeSwitch
            defaultChecked={theme.palette.mode === 'dark'}
            onChange={(event) => {
              colorMode.setMode(event.target.checked ? 'dark' : 'light');
            }}
          />
          <UserMenu />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
