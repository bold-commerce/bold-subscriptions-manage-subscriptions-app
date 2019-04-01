# Manage Subscriptions Page

## About

Bold Subscriptions customers using the **Advanced** plan or higher can create custom manage subscription experiences for their shoppers. Contact [Bold Commerce](https://boldcommerce.com/) for more information and to gain access.

This project includes boilerplate functions and advanced logic to manage subscriptions. To start creating a custom experience, we recommend forking this project as a base.

## Getting Started

### Prerequisites

To run this application you will need the following software installed:

* [Node](https://nodejs.org/en/) version 10
* [Yarn](https://yarnpkg.com/en/docs/install) version 1.12.3 or newer

### Install

1. Clone the repository
2. Install the node dependencies for the project.

	```console
	$ yarn install
	```

### Use

Run a local webpack dev server to develop on.

```console
$ yarn start
```

### Develop and test

#### Javascript bundle
Your local Javascript bundle can be loaded at `https://localhost:8080/app.bundle.js` unless the port was already taken.

#### Proxy page URL
`https://<domain>/tools/checkout/api/manage/subscription/app?preview_custom_app=1`

#### Previewing the local bundle

To start previewing your custom MSP, open Bold Subscriptions through your eCommerce platform and navigate to **Settings > Manage Subscriptions**. In the "**Custom Manage Subscriptions Page**" section, fill in the local bundle URL (which is usually `https://localhost:8080/app.bundle.js`) and press **Save**.


After saving, click "**Preview Custom Page**". You'll be taken to a proxy page with your custom app loaded and ready to test. Make sure to sign in as a customer with an active subscription **before** visiting this page.

### Production use

To build the production bundle into the `dist` folder of the project, run the following:

```console
$ yarn build
```

Upload this file to your server or Shopify account, and paste the direct link to the bundle into the **App URL** field on the **Settings -> Manage Subscriptions Page**.

When you're ready to release this page to the world, press **Activate Custom Manage Subscriptions Page** to send customers to your newly-created experience.

### Troubleshooting

#### Proxy page content is blank

This is a fairly common issue when developing locally, and usually happens when the local bundle has a secure protocol (https) attached to it without a valid, associated SSL certificate. To work on a Shopify proxy page, you need to load a secure asset. You can resolve/hack around this in two ways:

1. Navigate to https://localhost:8080/app.bundle.js. The web browser should warn that your connection isn't private because it's claiming to be secure without actually **being** secure. You can often choose to ignore this error (Chrome provides an "Advanced" button in the lower left corner of the error which allows you to proceed). This should load the Javascript bundle (until the browser forgets about your decision to proceed).

2. In Chrome, disable the "Your connection is not private" error when loading local resources. This is generally safe, since the resources you're loading belong to your machine. You can navigate to `chrome://flags/#allow-insecure-localhost` and enable the highlighted feature flag ("Allow invalid certificates for resources loaded from localhost"). The privacy error will no longer come up and you won't need to get around it ever again.

Your custom page should load correctly following one of these steps.

## Contributing

This project is read only. Please contact [Bold Commerce](https://boldcommerce.com/) with any changes or additions you would suggest.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.


