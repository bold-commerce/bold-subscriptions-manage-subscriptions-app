export default function windowSetup() {
  window.manageSubscription = {
    proxyEndpoint: 'test',
    shopifyCustomerId: 123,
  };
  window.manageSubscription.initialState = {};
  window.manageSubscription.initialState.data = { testerossa: true };
}
