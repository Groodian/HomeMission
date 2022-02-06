import { Drawer, styled } from '@mui/material';

const navbarHeight = '90px'; // 90px is size of icon in navbar

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  zIndex: theme.zIndex.drawer - 1,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    height: `calc(100% - ${navbarHeight})`,
    top: navbarHeight,
    boxSizing: 'border-box',
  },
}));

export default StyledDrawer;
