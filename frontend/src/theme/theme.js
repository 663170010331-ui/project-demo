import { createTheme } from '@mui/material/styles'

// Modern Government Dashboard theme
// Primary: Blue | Secondary: White | Success: Green | Warning: Orange | Danger: Red
export const getTheme = (mode = 'light') =>
  createTheme({
    palette: {
      mode,
      primary: { main: '#2f63f6', light: '#5a8bff', dark: '#193bab', contrastText: '#fff' },
      secondary: { main: '#ffffff', contrastText: '#2f63f6' },
      success: { main: '#1aa768' },
      warning: { main: '#e08a1e' },
      error: { main: '#e0413f' },
      background: {
        default: mode === 'dark' ? '#0f1524' : '#f4f6fb',
        paper: mode === 'dark' ? '#161d31' : '#ffffff',
      },
    },
    shape: { borderRadius: 14 },
    typography: {
      fontFamily: '"Noto Sans Thai", "Inter", system-ui, sans-serif',
      h1: { fontWeight: 700 }, h2: { fontWeight: 700 }, h3: { fontWeight: 700 },
      h4: { fontWeight: 700 }, h5: { fontWeight: 600 }, h6: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiButton: { styleOverrides: { root: { borderRadius: 12, paddingTop: 8, paddingBottom: 8 } } },
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiCard: { styleOverrides: { root: { borderRadius: 18, boxShadow: '0 2px 10px 0 rgba(23, 49, 138, 0.06)' } } },
      MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
    },
  })
