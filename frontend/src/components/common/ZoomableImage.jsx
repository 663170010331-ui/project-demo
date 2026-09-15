import React, { useState } from 'react'
import { Box, Dialog, IconButton } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

// A bigger, clickable photo thumbnail. Click opens the same image full-size
// in a dialog instead of leaving people squinting at a small crop — used
// everywhere a repair photo shows up (citizen tracking, public check-status,
// technician job details, operator request details).
export default function ZoomableImage({ src, alt = '', size = 120, sx = {} }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Box
        component="img" src={src} alt={alt} onClick={() => setOpen(true)}
        sx={{
          width: size, height: size, borderRadius: 3, objectFit: 'cover',
          cursor: 'zoom-in', border: '1px solid #e2e8f0',
          transition: 'transform 0.15s ease', '&:hover': { transform: 'scale(1.03)' },
          ...sx,
        }}
      />
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <IconButton
          onClick={() => setOpen(false)}
          sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'white', boxShadow: 1, zIndex: 1, '&:hover': { backgroundColor: '#f1f5f9' } }}
        >
          <CloseRoundedIcon />
        </IconButton>
        <Box
          component="img" src={src} alt={alt}
          sx={{ width: '100%', maxHeight: '85vh', objectFit: 'contain', display: 'block', backgroundColor: '#000' }}
        />
      </Dialog>
    </>
  )
}