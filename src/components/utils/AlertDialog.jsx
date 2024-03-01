import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Typography } from '@mui/material';

const AlertDialog = ({toggle,setToggle,cancel,confrim,content,title,type})=>{
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
    setToggle(false)
  };

  React.useEffect(()=>{
    setOpen(toggle)
  },[toggle])

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
            <Box sx={{ display: 'flex', alignItems: 'center'}}>
                <Typography align='center' variant='h5'>{title}</Typography>
            </Box>
        </DialogTitle>
        <DialogContent sx={{ width: 400 }}>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button color={type} onClick={cancel}>Cancel</Button>
          <Button variant='contained' color={type} onClick={confrim} autoFocus>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}


export default AlertDialog