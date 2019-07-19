export default function formatMoney(itemPrice, format, strip_tags) {
  const hasDefaultFormat = (window.BOLD &&
        window.BOLD.common &&
        window.BOLD.common.Shopify &&
        window.BOLD.common.Shopify.shop &&
        window.BOLD.common.Shopify.shop.money_format &&
        window.BOLD.common.Shopify.formatMoney);

  let currencyFormat = (format && format.length > 0 ? format : (
    hasDefaultFormat ? window.BOLD.common.Shopify.shop.money_format : null
  ));

  if (strip_tags !== false) {
    currencyFormat = currencyFormat.replace(/<(?:.|\n)*?>/gm, '');
  }

  return currencyFormat.length === 0 ? itemPrice : window.BOLD.common.Shopify.formatMoney(itemPrice, currencyFormat);
}
