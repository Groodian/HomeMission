import {
  Link,
  Avatar,
  Container,
  ImageList,
  ImageListItem,
  Typography,
  Divider,
} from "@material-ui/core";
import AvatarGroup from '@mui/material/AvatarGroup';
import { makeStyles, createStyles } from '@mui/styles';


const useStyles = makeStyles((theme: { spacing: (arg0: number) => any; }) => ({
  container: {
    paddingTop: theme.spacing(10),
    position: "sticky",
    top: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: 500,
    color: "#555",
  },
  link: {
    marginRight: theme.spacing(2),
    color: "#555",
    fontSize: 16,
  },
}));

const Rightbar = () => {
  const classes = useStyles();
  return (
    <Container className={classes.container}>
      <Typography className={classes.title} gutterBottom>
        Online Friends
      </Typography>
      <AvatarGroup max={6} style={{ marginBottom: 20 }}
                   sx={{
                     width: 250,
                     bgcolor: 'background.paper',
                     boxShadow: 1,
                     borderRadius: 2,
                     p: 2,
                   }}>
        <Avatar
          alt="Member 1"
          src="https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png"
        />
        <Avatar
          alt="Member 2"
          src="https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png"
        />
        <Avatar
          alt="Member 3"
          src="https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png"
        />
        <Avatar
          alt="Member 4"
          src="https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png"
        />
        <Avatar
          alt="Member 5"
          src="https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png"
        />
        <Avatar
          alt="Member 6"
          src="https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png"
        />
        <Avatar
          alt="Member 7"
          src="https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png"
        />
      </AvatarGroup>

      <Typography className={classes.title} gutterBottom>
        Gallery
      </Typography>
      <ImageList variant="woven" cols={3} gap={8}
                 sx={{ width: 250, height: 550,
                   bgcolor: 'background.paper',
                   boxShadow: 1,
                   borderRadius: 2,
                   p: 2,
                 }}>
        {itemData.map((item) => (
          <ImageListItem key={item.img}>
            <img
              src={`${item.img}?w=161&fit=crop&auto=format`}
              srcSet={`${item.img}?w=161&fit=crop&auto=format&dpr=2 2x`}
              alt={item.title}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>

    </Container>
  );
};


const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1549388604-817d15aa0110',
    title: 'Bed',
  },
  {
    img: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3',
    title: 'Kitchen',
  },
  {
    img: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6',
    title: 'Sink',
  },
  {
    img: 'https://images.unsplash.com/photo-1525097487452-6278ff080c31',
    title: 'Books',
  },
  {
    img: 'https://images.unsplash.com/photo-1574180045827-681f8a1a9622',
    title: 'Chairs',
  },
  {
    img: 'https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62',
    title: 'Candle',
  },
  {
    img: 'https://images.unsplash.com/photo-1530731141654-5993c3016c77',
    title: 'Laptop',
  },
  {
    img: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61',
    title: 'Doors',
  },
  {
    img: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7',
    title: 'Coffee',
  },
  {
    img: 'https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee',
    title: 'Storage',
  },
  {
    img: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
    title: 'Coffee table',
  },
  {
    img: 'https://images.unsplash.com/photo-1588436706487-9d55d73a39e3',
    title: 'Blinds',
  },
  {
    img: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7',
    title: 'Coffee',
  },
  {
    img: 'https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee',
    title: 'Storage',
  },
  {
    img: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
    title: 'Coffee table',
  },
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast',
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    title: 'Coffee',
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
  },
  {
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    title: 'Basketball',
  },
  {
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    title: 'Fern',
  },
  {
    img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
    title: 'Mushrooms',
  },
  {
    img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
    title: 'Tomato basil',
  },
  {
    img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
    title: 'Sea star',
  },
  {
    img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
    title: 'Bike',
  },
];

export default Rightbar;
