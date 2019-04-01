export const CSS_PROPERTY_FORMAT = 0;
export const JS_PROPERTY_FORMAT = 1;

export function convertCamelToKebab(string) {
  return string.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

export function copyThemeComputedStyles(copyStyles = [], tagName = 'INPUT', propertyFormat = JS_PROPERTY_FORMAT, classNames = '') {
  const el = document.createElement(tagName);
  el.style.position = 'absolute';
  el.style.top = '-9999px';
  el.style.left = '-9999px';
  el.className = classNames;

  document.getElementsByTagName('body')[0].appendChild(el);
  const computedStyles = window.getComputedStyle(el);
  let result = {};

  switch (propertyFormat) {
    case JS_PROPERTY_FORMAT:
      result = copyStyles.reduce(
        (p, c) => ({ ...p, [c]: computedStyles[c] }),
        {},
      );
      break;
    case CSS_PROPERTY_FORMAT:
    default:
      result = copyStyles.reduce(
        (p, c) => ({ ...p, [convertCamelToKebab(c)]: computedStyles[c] }),
        {},
      );
      break;
  }

  return result;
}
