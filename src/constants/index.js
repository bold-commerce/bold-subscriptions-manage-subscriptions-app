// TODO: Allow merchant to set date format
export const MOMENT_DATE_FORMAT = 'MMMM DD, YYYY';

export const DEFAULT_INPUT_CLASSNAME = 'msp__form-field msp__input';
export const GATEWAY_INPUT_CLASSNAME = `${DEFAULT_INPUT_CLASSNAME} gateway-input-iframe-styles`;

export const REDIRECT_TO_LOGIN_DELAY = 2500;
export const FEATURES = window.manageSubscription.featureFlags;

export const CASHIER_SAVED_PAYMENT_METHOD_MESSAGE = 'create payment method successful';

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

export const GENERIC_ERROR_MESSAGE = 'There was a problem updating your credit card; please double check your payment information and try again';
