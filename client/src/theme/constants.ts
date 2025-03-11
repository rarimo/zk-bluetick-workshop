import { keyframes } from '@emotion/react'

export const FONT_FAMILY = 'system-ui, sans-serif'

export enum FontWeight {
  Regular = 400,
  Medium = 500,
}

/* Animations */
export const rippleAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
    
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
`
