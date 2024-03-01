import { Button, Dialog, DialogActions, DialogContent, DialogContentText, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { formatCode } from '../../utils/formatCode'
import { changeDateTime } from '../../utils/changeDateTime'

const MemberDialog = ({open,setOpen,code, date}) => {
    const handleClose = ()=>{
        setOpen(false)
    }
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DialogContent>
                <Typography variant='h6' align='left' sx={{ mb: 3 }}>{`Used At - ${date && changeDateTime(date)}`}</Typography>
                <Typography sx={{ mb: 2 }}>Your Code is</Typography>
                <Typography variant='h4' align='center'>{code && formatCode(code)}</Typography>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} autoFocus sx={{ mr: 1, mb: 1 }}>
                Close
            </Button>
            </DialogActions>
        </Dialog>
    )
    }

export default MemberDialog