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
import { uniqueId } from 'lodash';
import { useSnackbar } from 'notistack';
import { writeConfigRequest, useConfigInMainRequest } from 'secure-electron-store';

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
  timeBasedContainer: {
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

const AddAuthenticator = withStyles(styles)((props) => {
  const { openAdd, handleClose, authenticators, setAuthenticators, classes } = props;
  const [values, setValues] = useState({ name: '', account: '', key: '', timeBased: true });
  const [helperText, setHelperText] = useState({ name: '', account: '', key: '' });
  const [errors, setErrors] = useState({ name: false, account: false, key: false });
  const [timeBased, setTimeBased] = useState(true);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    window.api.store.clearRendererBindings();
    // Request so that the main process can use the store
    window.api.store.send(useConfigInMainRequest);
  }, []);

  const handleChange = () => {
    setTimeBased(prev => !prev);
  };

  const handleCheck = () => {
    let error = false;
    if (values.name === '') {
      setHelperText({ ...helperText, name: 'Champs requis' });
      setErrors({ ...errors, name: true });
      error = true;
    } else {
      setHelperText({ ...helperText, name: '' });
      setErrors({ ...errors, name: false });
      error = false;
    }
    if (values.account === '') {
      setHelperText({ ...helperText, account: 'Champs requis' });
      setErrors({ ...errors, account: true });
      error = true;
    } else {
      setHelperText({ ...helperText, account: '' });
      setErrors({ ...errors, account: false });
      error = false;
    }
    if (values.key === '') {
      setHelperText({ ...helperText, key: 'Champs requis' });
      setErrors({ ...errors, key: true });
      error = true;
    } else {
      setHelperText({ ...helperText, key: '' });
      setErrors({ ...errors, key: false });
      error = false;
    }
    return error;
  };

  const handleUpdate = (e, key) => {
    if (key === 'name') {
      setValues({ ...values, name: e.target.value })
      if (values.name === '') {
        setHelperText({ ...helperText, name: 'Champs requis' });
        setErrors({ ...errors, name: true });
      } else {
        setHelperText({ ...helperText, name: '' });
        setErrors({ ...errors, name: false });
      }
    }
    if (key === 'account') {
      setValues({ ...values, account: e.target.value })
      if (values.account === '') {
        setHelperText({ ...helperText, account: 'Champs requis' });
        setErrors({ ...errors, account: true });
      } else {
        setHelperText({ ...helperText, account: '' });
        setErrors({ ...errors, account: false });
      }
    }
    if (key === 'key') {
      setValues({ ...values, key: e.target.value })
      if (values.key === '') {
        setHelperText({ ...helperText, key: 'Champs requis' });
        setErrors({ ...errors, key: true });
      } else {
        setHelperText({ ...helperText, key: '' });
        setErrors({ ...errors, key: false });
      }
    }
  }

  const handleAdd = () => {
    if (handleCheck() === false) {
      let newObj = authenticators;
      if (newObj === undefined) {
        newObj = [];
      }
      const newElem = {
        id: uniqueId(),
        name: values.name,
        account: values.account,
        key: values.key,
        timeBased: values.timeBased
      };
      newObj.push(newElem);
      window.api.store.send(writeConfigRequest, 'authenticators', newObj); // save message to store (persist)
      setAuthenticators([...newObj]);
      handleClose();
      enqueueSnackbar('Générateur ajouté !', {
        variant: 'success',
      });
    }
  }

  return (
    <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={openAdd}>
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        Ajout d'un générateur de code
      </DialogTitle>
      <MuiDialogContent dividers>
        <Grid container className={classes.gridContainer}>
          <TextField
            id="outlined-full-width"
            label="Nom"
            style={{ margin: 8 }}
            placeholder="ex: Instagram, Facebook ..."
            fullWidth
            required
            error={errors.name}
            margin="normal"
            helperText={helperText.name}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            value={values.name}
            onChange={(e) => handleUpdate(e, 'name')}
          />
          <TextField
            id="outlined-full-width"
            label="Compte"
            style={{ margin: 8 }}
            placeholder="utilisateur@example.com"
            fullWidth
            required
            error={errors.account}
            margin="normal"
            helperText={helperText.account}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            value={values.account}
            onChange={(e) => handleUpdate(e, 'account')}
          />
          <TextField
            id="outlined-full-width"
            label="Clé"
            style={{ margin: 8 }}
            placeholder="abcd efgh ijkl mnop"
            fullWidth
            required
            error={errors.key}
            margin="normal"
            helperText={helperText.key}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            value={values.key}
            onChange={(e) => handleUpdate(e, 'key')}
          />
          <Grid container alignItems="center" wrap="nowrap" className={classes.timeBasedContainer}>
            <Grid item container direction="row" wrap="nowrap">
              Basé sur l&apos;heure
            </Grid>
            <Grid item className={classes.labelMargin}>
              <Switch checked={timeBased} onChange={handleChange} color="primary" />
            </Grid>
          </Grid>
        </Grid>
      </MuiDialogContent>
      <MuiDialogActions>
        <Button autoFocus onClick={handleAdd} color="primary">
          Ajouter
        </Button>
      </MuiDialogActions>
    </Dialog>
  )
});

export default AddAuthenticator;