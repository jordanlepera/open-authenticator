import React, { useState, useEffect } from 'react';
import { styled } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import ReorderIcon from '@material-ui/icons/Reorder';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CopyIcon from '@material-ui/icons/FileCopy';
import CircularProgressWithLabel from 'Components/circularprogresswithlabel/CircularProgressWithLabel';
import { useSnackbar } from 'notistack';
import OTPService from 'Services/OTP.service';
import Authenticator from 'Models/Authenticator.model';
import DeleteAuthenticator from 'Components/dialog/DeleteAuthenticator';
import EditAuthenticator from 'Components/dialog/EditAuthenticator';

const Container = styled('div')({
  borderBottom: '1px solid rgba(220, 220, 220, 0.3)',
  padding: 20,
});

const NameContainer = styled('div')({
  fontWeight: 600,
});

const CodeContainer = styled('div')({
  fontWeight: 600,
  fontSize: '2em',
});

const AccountContainer = styled('div')({
  fontWeight: 500,
});

const AuthenticatorItem = (props) => {
  const { authenticator, authenticators, setAuthenticators } = props;
  const [progress, setProgress] = useState(0);
  const [authCode, setAuthCode] = useState('');
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleClickOpenEdit = () => {
    setOpenEdit(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 100 / 29));
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (authCode === '') {
      setAuthCode(displayTimeCode());
    }
    const timer = setInterval(() => {
      setAuthCode(displayTimeCode());
    }, 30000);
    return () => {
      clearInterval(timer);
    }
  }, []);

  const copyCodeToClipboard = () => {
    window.api.copyToClipboard(authCode);
    enqueueSnackbar('Code copié !');
  }

  const displayTimeCode = () => {
    const otp = new OTPService();
    const totp = otp.getTOTP(authenticator.key);
    return totp;
  }

  return (
    <Container>
      <DeleteAuthenticator
        openDelete={openDelete}
        handleClose={handleCloseDelete}
        authenticators={authenticators}
        setAuthenticators={setAuthenticators}
        authenticator={authenticator}
      />
      <EditAuthenticator
        openEdit={openEdit}
        handleClose={handleCloseEdit}
        authenticators={authenticators}
        setAuthenticators={setAuthenticators}
        authenticator={authenticator}
      />
      <Grid container wrap="nowrap">
        <Grid item container direction="column">
          <NameContainer>
            {authenticator.name}
          </NameContainer>
          <CodeContainer>
            {authCode}
          </CodeContainer>
          <AccountContainer>
            {authenticator.account}
          </AccountContainer>
        </Grid>
        <Grid item container alignItems="center" justify="center">
          <CircularProgressWithLabel value={progress} thickness={10} size={60} />
        </Grid>
        {/* <Grid item container alignItems="center" justify="flex-end">
          <Button variant="outlined" onClick={copyCodeToClipboard}>Copier</Button>
        </Grid> */}
        <Grid item container alignItems="center" justify="flex-end" wrap="nowrap">
          <Tooltip title="Copier">
            <IconButton onClick={copyCodeToClipboard}>
              <CopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Modifier">
            <IconButton onClick={handleClickOpenEdit}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Supprimer">
            <IconButton onClick={handleClickOpenDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          {/* <IconButton>
            <ReorderIcon />
          </IconButton> */}
        </Grid>
      </Grid>
    </Container>
  )
}

export default AuthenticatorItem;