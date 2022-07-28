export default function formatMoney(itemPrice, format, stripTags) {
  const hasDefaultFormat = (window.BOLD &&
        window.BOLD.common &&
        window.BOLD.common.Shopify &&
        window.BOLD.common.Shopify.shop &&
        window.BOLD.common.Shopify.shop.money_format &&
        window.BOLD.common.Shopify.formatMoney);

  let currencyFormat = null;
  if (format && format.length > 0) {
    currencyFormat = format;
  } else if (hasDefaultFormat) {
    currencyFormat = window.BOLD.common.Shopify.shop.money_format;
  }

  if (stripTags !== false) {
    currencyFormat = currencyFormat.replace(/<(?:.|\n)*?>/gm, '');
  }

  return (currencyFormat.length === 0)
    ? itemPrice
    : window.BOLD.common.Shopify.formatMoney(itemPrice, currencyFormat);
}
