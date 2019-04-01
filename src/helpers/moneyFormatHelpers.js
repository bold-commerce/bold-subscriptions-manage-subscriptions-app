export default function formatMoney(itemPrice) {
  if (window.BOLD &&
    window.BOLD.common &&
    window.BOLD.common.Shopify &&
    window.BOLD.common.Shopify.shop &&
    window.BOLD.common.Shopify.shop.money_format &&
    window.BOLD.common.Shopify.formatMoney) {
    return window.BOLD.common.Shopify.formatMoney(
      itemPrice,
      window.BOLD.common.Shopify.shop.money_format,
    );
  }
  return itemPrice;
}
