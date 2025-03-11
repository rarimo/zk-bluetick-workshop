import { createTheme as createMuiTheme } from '@mui/material'

import { lightPalette } from './colors'
import { components } from './components'
import { typography } from './typography'

export const createTheme = () => {
  return createMuiTheme({
    palette: lightPalette,
    typography,
    components,
    spacing: 4,
    shape: {
      borderRadius: 4,
    },
  })
}
