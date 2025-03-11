import { AlertColor, alpha, Components, Theme } from '@mui/material'

import { typography } from './typography'

export const components: Components<Omit<Theme, 'components'>> = {
  MuiCssBaseline: {
    styleOverrides: theme => `
      html {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        -moz-osx-font-smoothing: grayscale;
        -webkit-font-smoothing: antialiased;
        -webkit-overflow-scrolling: touch !important;
        -webkit-tap-highlight-color: transparent;
      }

      body, #root, .App {
        display: flex;
        flex: 1;
        flex-direction: column;
        background-color: ${theme.palette.background.default};
        color: ${theme.palette.text.primary};
      }

      a {
        outline: none;
        text-decoration: none;
      }

      input:is(:-webkit-autofill, :-webkit-autofill:focus) {
        transition: background-color 600000s 0s, color 600000s 0s;
      }
    `,
  },
  MuiSnackbar: {
    styleOverrides: {
      root: ({ theme }) => ({
        '& > .MuiPaper-root': {
          borderRadius: theme.spacing(1),
        },
      }),
    },
  },
  MuiStack: {
    defaultProps: {
      useFlexGap: true,
    },
  },
  MuiButton: {
    defaultProps: {
      variant: 'contained',
      size: 'large',
      disableElevation: true,
      disableFocusRipple: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.spacing(250),
        transition: 'all 250ms ease-out',
      }),
      sizeLarge: ({ theme }) => ({
        ...typography.buttonLarge,
        padding: theme.spacing(2.5, 8),
        height: theme.spacing(12),
      }),
      sizeMedium: ({ theme }) => ({
        ...typography.buttonMedium,
        padding: theme.spacing(2.5, 6),
        height: theme.spacing(10),
      }),
      sizeSmall: ({ theme }) => ({
        ...typography.buttonSmall,
        padding: theme.spacing(2.5, 4),
        height: theme.spacing(8),
      }),
      fullWidth: {
        width: '100%',
      },
      text: {
        padding: 0,
        minWidth: 'unset',
        '&:hover': {
          backgroundColor: 'transparent',
        },
      },
      textPrimary: ({ theme }) => ({
        color: theme.palette.text.secondary,
        backgroundColor: 'transparent',
        '&:hover': {
          color: theme.palette.text.primary,
        },
        '&.Mui-disabled': {
          color: theme.palette.text.disabled,
        },
      }),
      textError: ({ theme }) => ({
        color: theme.palette.error.main,
        '&:hover': {
          color: theme.palette.error.dark,
        },
        '&.Mui-disabled, &.Mui-disabled:hover': {
          color: theme.palette.error.main,
          opacity: 0.5,
        },
      }),
      contained: ({ theme }) => ({
        '&.Mui-disabled': {
          '&, &:hover, &:focus': {
            backgroundColor: theme.palette.action.disabled,
            color: theme.palette.text.disabled,
          },
        },
      }),
      containedPrimary: ({ theme }) => ({
        backgroundColor: theme.palette.text.primary,
        color: theme.palette.inverted.light,
        '&:hover': {
          background: alpha(theme.palette.text.primary, 0.9),
        },
        '&:active, &:focus': {
          background: alpha(theme.palette.inverted.dark, 0.8),
        },
      }),
      containedSecondary: ({ theme }) => ({
        color: theme.palette.common.white,
        '&:hover, &:focus': {
          backgroundColor: theme.palette.secondary.dark,
        },
        '&:active': {
          backgroundColor: theme.palette.secondary.darker,
        },
        '&.Mui-disabled': {
          backgroundColor: theme.palette.action.disabled,
          color: theme.palette.text.disabled,
        },
      }),
      containedSuccess: ({ theme }) => ({
        color: theme.palette.common.white,
        backgroundColor: theme.palette.primary.main,
        '&:hover, &:focus': {
          backgroundColor: theme.palette.primary.dark,
        },
        '&:active': {
          backgroundColor: theme.palette.primary.darker,
        },
      }),
      containedError: ({ theme }) => ({
        color: theme.palette.error.main,
        backgroundColor: theme.palette.error.lighter,
        '&:hover, &:focus': {
          backgroundColor: theme.palette.error.light,
        },
        '&:active': {
          color: theme.palette.common.white,
          backgroundColor: theme.palette.error.main,
        },
        '&.Mui-disabled': {
          backgroundColor: theme.palette.action.disabled,
          color: theme.palette.text.disabled,
        },
      }),
      containedWarning: ({ theme }) => ({
        color: theme.palette.warning.darker,
        backgroundColor: theme.palette.warning.lighter,
        '&:hover': {
          backgroundColor: theme.palette.warning.light,
        },
      }),
      containedInfo: ({ theme }) => ({
        color: theme.palette.common.white,
        backgroundColor: theme.palette.info.main,
        '&:hover': {
          backgroundColor: theme.palette.info.darker,
        },
      }),
      outlinedPrimary: ({ theme }) => ({
        color: theme.palette.text.primary,
        backgroundColor: 'transparent',
        border: `2px solid ${theme.palette.text.primary}`,
        '&:hover, &:focus, &:active': {
          color: theme.palette.inverted.light,
          backgroundColor: theme.palette.text.primary,
          border: `2px solid ${theme.palette.text.primary}`,
        },
        '&.Mui-disabled': {
          border: 'transparent',
          color: theme.palette.text.disabled,
          backgroundColor: theme.palette.action.disabled,
        },
      }),
    },
  },
  MuiButtonBase: {
    defaultProps: {
      disableRipple: true,
      disableTouchRipple: true,
    },
    styleOverrides: {
      root: {
        fontFamily: 'inherit',
      },
    },
  },
  MuiFormControl: {
    defaultProps: {
      fullWidth: true,
    },
  },
  MuiPaper: {
    defaultProps: {
      variant: 'elevation',
      square: false,
      elevation: 0,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundImage: 'unset',
        background: theme.palette.background.light,
        padding: theme.spacing(6),
        border: 0,
        borderRadius: theme.spacing(6),
        boxShadow: '0px 1px 1px 0px #0000000D, 0px 0px 0px 0.33px #0000000D',
        overflow: 'hidden',
        [theme.breakpoints.down('md')]: {
          padding: theme.spacing(5),
        },
      }),
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: ({ theme }) => ({
        '& .MuiInputBase-root, & .MuiInputBase-sizeSmall, & .MuiInputBase-sizeMedium':
          typography.body3,
        '& .MuiInputBase-root': {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            backgroundColor: 'transparent',
          },
          '&.Mui-focused:not(.Mui-error) .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.action.focus,
            borderWidth: 1,
          },
          '&:hover:not(.Mui-error):not(.Mui-focused) .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.action.hover,
          },
        },
        '& .MuiOutlinedInput-notchedOutline': {
          transition: 'all 250ms ease-out',
          borderRadius: theme.spacing(2),
          backgroundColor: theme.palette.action.active,
          borderColor: 'transparent',
        },
        '& .MuiOutlinedInput-input::-webkit-input-placeholder': {
          color: theme.palette.text.secondary,
          opacity: 1,
        },
      }),
    },
  },
  MuiSkeleton: {
    defaultProps: {
      animation: 'wave',
      variant: 'rectangular',
    },
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.divider,
        borderRadius: theme.spacing(4),
      }),
      rounded: ({ theme }) => ({
        borderRadius: theme.spacing(6),
      }),
      circular: () => ({
        borderRadius: '100%',
      }),
    },
  },
  MuiTypography: {
    defaultProps: {
      variant: 'body3',
    },
  },
  MuiTooltip: {
    defaultProps: {
      placement: 'bottom',
      enterDelay: 0,
      enterTouchDelay: 0,
      arrow: true,
    },
    styleOverrides: {
      tooltip: ({ theme }) => ({
        ...typography.body4,
        backgroundColor: theme.palette.inverted.dark,
        color: theme.palette.inverted.light,
        borderRadius: theme.spacing(2),
        padding: theme.spacing(2, 4),
      }),
      arrow: ({ theme }) => ({
        color: theme.palette.inverted.dark,
      }),
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: ({ theme }) => ({
        width: '100%',
        borderRadius: theme.spacing(4),
        backgroundColor: theme.palette.background.paper,
        color: alpha(theme.palette.text.primary, 0.7),
        boxShadow: '0px 8px 16px 0px rgba(0, 0, 0, 0.04)',
        padding: theme.spacing(1.5, 4),
        [theme.breakpoints.down('md')]: {
          padding: theme.spacing(1.5, 4),
        },
      }),
      icon: ({ ownerState, theme }) => {
        const severityToBgColor: Record<AlertColor, string> = {
          success: alpha(theme.palette.success.main, 0.2),
          warning: alpha(theme.palette.warning.main, 0.2),
          error: alpha(theme.palette.error.main, 0.2),
          info: alpha(theme.palette.info.main, 0.2),
        }

        return {
          backgroundColor: severityToBgColor[ownerState.severity ?? 'info'],
          marginRight: theme.spacing(4),
          marginTop: 'auto',
          marginBottom: 'auto',
          padding: theme.spacing(2),
          borderRadius: theme.spacing(25),
        }
      },
      message: ({ theme }) => ({
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
      }),
    },
  },
  MuiAlertTitle: {
    styleOverrides: {
      root: ({ theme }) => ({
        ...typography.subtitle4,
        color: theme.palette.text.primary,
      }),
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: ({ theme }) => ({
        padding: 0,
        backgroundColor: theme.palette.background.light,
        boxShadow: `inset 0 0 0 1px ${theme.palette.action.active}`,
        border: 0,
        [theme.breakpoints.down('md')]: {
          padding: 0,
          margin: theme.spacing(4),
        },
      }),
    },
  },
}
