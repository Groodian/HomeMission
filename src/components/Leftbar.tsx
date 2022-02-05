import { Container, Typography } from '@mui/material';
import {
  ExitToApp,
  ListAlt,
  Person,
  PhotoCamera,
  PlayCircleOutline,
  Settings,
  Storefront,
  TabletMac,
} from '@mui/icons-material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(
  (theme: {
    spacing: (arg0: number) => any;
    palette: { primary: { main: any } };
    breakpoints: { up: (arg0: string) => any; down: (arg0: string) => any };
  }) => ({
    container: {
      height: '100vh',
      color: 'white',
      paddingTop: theme.spacing(10),
      backgroundColor: theme.palette.primary.main,
      position: 'sticky',
      top: 0,
      [theme.breakpoints.up('sm')]: {
        backgroundColor: 'white',
        color: '#555',
        border: '1px solid #ece7e7',
      },
    },
    item: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: theme.spacing(4),
      [theme.breakpoints.up('sm')]: {
        marginBottom: theme.spacing(3),
        cursor: 'pointer',
      },
    },
    icon: {
      marginRight: theme.spacing(1),
      [theme.breakpoints.up('sm')]: {
        fontSize: '18px',
      },
    },
    text: {
      fontWeight: 500,
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
  })
);

const Leftbar = () => {
  const classes = useStyles();
  return (
    <Container className={classes.container}>
      <div className={classes.item}>
        <Person className={classes.icon} />
        <Typography className={classes.text}>Members</Typography>
      </div>
      <div className={classes.item}>
        <ListAlt className={classes.icon} />
        <Typography className={classes.text}>Activity List</Typography>
      </div>
      <div className={classes.item}>
        <PhotoCamera className={classes.icon} />
        <Typography className={classes.text}>WG Album</Typography>
      </div>
      <div className={classes.item}>
        <PlayCircleOutline className={classes.icon} />
        <Typography className={classes.text}>WG Videos</Typography>
      </div>
      <div className={classes.item}>
        <TabletMac className={classes.icon} />
        <Typography className={classes.text}>Notifications</Typography>
      </div>
      <div className={classes.item}>
        <Storefront className={classes.icon} />
        <Typography className={classes.text}>Market Place</Typography>
      </div>
      <div className={classes.item}>
        <Settings className={classes.icon} />
        <Typography className={classes.text}>Settings</Typography>
      </div>
      <div className={classes.item}>
        <ExitToApp className={classes.icon} />
        <Typography className={classes.text}>Logout</Typography>
      </div>
    </Container>
  );
};

export default Leftbar;
