// TODO: Allow merchant to set date format
export const MOMENT_DATE_FORMAT = 'MMMM DD, YYYY';

export const DEFAULT_INPUT_CLASSNAME = 'msp__form-field msp__input';
export const GATEWAY_INPUT_CLASSNAME = `${DEFAULT_INPUT_CLASSNAME} gateway-input-iframe-styles`;

export const REDIRECT_TO_LOGIN_DELAY = 2500;

// TODO: Allow merchant to customize payment gateway styles
export const PAYMENT_GATEWAY_STYLES = {
  theme: {
    input: [
      'color',
      'fontFamily',
      'fontSize',
      'fontSmoothing',
      'fontStyle',
      'fontVariant',
      'iconColor',
      'letterSpacing',
      'textAlign',
      'textDecoration',
      'textShadow',
      'textTransform',
      'height',
    ],
  },
};
