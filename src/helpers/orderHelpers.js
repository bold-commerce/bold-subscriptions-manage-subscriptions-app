export default function orderTotal(order) {
  let approxOrderTotal = 0;
  order.order_products.forEach((product) => {
    approxOrderTotal += parseFloat(parseFloat(product.price) * parseInt(product.quantity, 10));
  });
  approxOrderTotal += parseFloat(order.order_shipping_rate.price);

  return approxOrderTotal;
}
