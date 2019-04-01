import queryString from 'query-string';

import { fetch as fetchPolyfill } from 'whatwg-fetch';

export function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(() => resolve(true), milliseconds));
}

function fetchJson(url, payload) {
  return fetchPolyfill(url, payload)
    .then((response) => {
      if (response.status === 200) {
        return response.json()
          .then((jsonData) => {
            if (jsonData.status === 401) {
              window.location = '/account';
            }
            return jsonData;
          });
      }
      return {
        success: false,
        errors: {
          message: `Network request returned with ${response.status} status code`,
        },
      };
    });
}

export function postRequest(url, data, customHeaders = {}) {
  const payload = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      // 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
    },
    method: 'POST',
    body: JSON.stringify(data),
  };

  payload.headers = {
    ...payload.headers,
    ...customHeaders,
  };

  return fetchJson(url, payload);
}

export function putRequest(url, data, customHeaders = {}) {
  const payload = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      // 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
    },
    method: 'PUT',
    body: JSON.stringify(data),
  };

  payload.headers = {
    ...payload.headers,
    ...customHeaders,
  };

  return fetchJson(url, payload);
}

export function deleteRequest(url, data, customHeaders = {}) {
  const payload = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      // 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
    },
    method: 'DELETE',
    body: JSON.stringify(data),
  };

  payload.headers = {
    ...payload.headers,
    ...customHeaders,
  };

  return fetchJson(url, payload);
}

export function getRequest(url, customHeaders) {
  const payload = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      // 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
    },
    method: 'GET',
  };

  payload.headers = {
    ...payload.headers,
    ...customHeaders,
  };

  return fetchJson(url, payload);
}

function addCustomerIdGetParam(url, searchParams) {
  const newUrl = new URL(`https://${window.location.host}${url}`);

  const params = {
    ...searchParams,
    customer_id: window.manageSubscription.shopifyCustomerId,
    t: (new Date()).getTime(),
  };
  Object.keys(params).forEach(key =>
    newUrl.searchParams.append(
      key,
      params[key] === null || params[key] === undefined ? '' : params[key],
    ));

  return newUrl;
}

const getApiUrl = (url, searchParams = {}) =>
  addCustomerIdGetParam(
    `${window.manageSubscription.proxyEndpoint}/api/manage/subscription/${url}`,
    searchParams,
  );

const getApiHeaders = customHeaders =>
  Object.assign(customHeaders || {}, {
    'BOLD-authorization': `Bearer ${window.manageSubscription.apiToken}`,
  });

export const apiGetRequest = (url, searchParams, customHeaders) =>
  getRequest(getApiUrl(url, searchParams), getApiHeaders(customHeaders));

export const apiPostRequest = (url, data, customHeaders) =>
  postRequest(getApiUrl(url), data, getApiHeaders(customHeaders));

export const apiPutRequest = (url, data, customHeaders) =>
  putRequest(getApiUrl(url), data, getApiHeaders(customHeaders));

export const apiDeleteRequest = (url, data, customHeaders) =>
  deleteRequest(getApiUrl(url), data, getApiHeaders(customHeaders));

export function getCustomerDataFromQuery() {
  const params = queryString.parse(window.location.search);
  if (typeof params.customer_token !== 'undefined' && typeof params.customer_id !== 'undefined') {
    return {
      customerToken: decodeURI(params.customer_token),
      customerId: params.customer_id,
    };
  }

  return false;
}
