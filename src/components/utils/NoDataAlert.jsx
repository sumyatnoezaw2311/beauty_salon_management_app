import React from 'react'
import { Alert } from '@mui/material'

const NoDataAlert = ({content}) => {
  return (
    <Alert variant="outlined" severity="warning">
        {content}
    </Alert>
  )
}

export default NoDataAlert