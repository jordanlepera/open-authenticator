import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import { uniqueId, findIndex } from 'lodash';
import { useSnackbar } from 'notistack';
import { readConfigRequest, writeConfigRequest, readConfigResponse, useConfigInMainRequest } from 'secure-electron-store';

const styles = (theme) => ({
  root: {
    margin: 0,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  gridContainer: {
    padding: theme.spacing(1),
  },
  contentContainer: {
    padding: theme.spacing(1),
  }
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const DeleteAuthenticator = withStyles(styles)((props) => {
  const { openDelete, handleClose, authenticators, setAuthenticators, authenticator, classes } = props;
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    window.api.store.clearRendererBindings();
    // Request so that the main process can use the store
    window.api.store.send(useConfigInMainRequest);
  }, []);

  const handleDelete = () => {
    let auths = authenticators;
    if (auths === undefined) {
      auths = [];
    }
    const idx = findIndex(auths, elem => elem.id === authenticator.id);
    auths.splice(idx, 1);
    window.api.store.send(writeConfigRequest, 'authenticators', auths); // delete elem
    setAuthenticators([...auths]);
    handleClose();
    enqueueSnackbar('Générateur supprimé !', {
      variant: 'success',
    });
  }

  return (
    <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={openDelete}>
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        Supprimer un générateur de code
      </DialogTitle>
      <MuiDialogContent dividers>
        <Grid container className={classes.gridContainer}>
          <Grid container alignItems="center">
            <Typography gutterBottom>
              Le générateur va être supprimé. Cette action est irréversible. Vous ne pourrez plus accéder au code si vous n'avez pas la clé privée en votre possession.
            </Typography>
            <Typography gutterBottom>
              Confirmez-vous la suppression du générateur ?
            </Typography>
          </Grid>
        </Grid>
      </MuiDialogContent>
      <Grid container wrap="nowrap" justify="flex-end">
        <MuiDialogActions>
          <Button autoFocus onClick={handleDelete} color="primary">
            Supprimer
          </Button>
        </MuiDialogActions>
        <MuiDialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Annuler
          </Button>
        </MuiDialogActions>
      </Grid>
    </Dialog>
  )
});

export default DeleteAuthenticator;