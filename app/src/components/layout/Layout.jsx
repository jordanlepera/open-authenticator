import React, { useState } from 'react';
import { makeStyles, styled } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import PlusIcon from '@material-ui/icons/Add';
import CssBaseline from '@material-ui/core/CssBaseline';
import AddAuthenticator from 'Components/dialog/AddAuthenticator';
import './layout.css';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    width: '100%',
    height: '100%'
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 600,
    letterSpacing: 5,
  },
}));

const AppLeftSpace = styled('div')({
  width: 60,
});

const AppBarDraggable = styled(AppBar)({
  WebkitAppRegion: 'drag',
  WebkitUserSelect: 'none',
  borderBottom: '1px solid rgb(230, 230, 230)',
  backgroundColor: 'white',
  color: '#3D3D3D'
});

const ContentMargin = styled('div')({
  padding: 20,
  width: '100%',
  height: 'calc(100% - 65px)'
});

const Layout = (props) => {
  const { authenticators, setAuthenticators, children } = props;
  const classes = useStyles();
  const [openAdd, setOpenAdd] = useState(false);

  const handleClickOpen = () => {
    setOpenAdd(true);
  };

  const handleClose = () => {
    setOpenAdd(false);
  };

  const PlaceholderItem = styled('div')({
    width: 48,
    height: 48,
  })

  return (
    <div className={classes.container}>
      <AddAuthenticator openAdd={openAdd} handleClose={handleClose} authenticators={authenticators} setAuthenticators={setAuthenticators} />
      <CssBaseline />
      <div className={classes.root}>
        <AppBarDraggable position="static" elevation={0}>
          <Toolbar>
            <PlaceholderItem />
            {/* <AppLeftSpace />
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton> */}
            <Typography variant="h6" className={classes.title}>
              Open Authenticator
            </Typography>
            <Tooltip title="Ajouter">
              <IconButton onClick={handleClickOpen} color="inherit">
                <PlusIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBarDraggable>
        <ContentMargin>
          {children}
        </ContentMargin>
      </div>
    </div>
  );
};

export default Layout;