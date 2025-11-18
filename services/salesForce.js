import config from '../config.js';

const {
  SF_CONSUMER_KEY,
  SF_CONSUMER_SECRET,
} = config

export const checkResponse = async (res) => {
    if (res.ok) return res.json();
    const e = await res.json();
    return Promise.reject(e);
}

export const getAccessInfo = async () => {
    const res = await fetch('https://orgfarm-9325b65284-dev-ed.develop.my.salesforce.com/services/oauth2/token', {
        method: 'POST',
        body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: SF_CONSUMER_KEY,
            client_secret: SF_CONSUMER_SECRET,
        })
    })
    return checkResponse(res);
}

export const getAddress = async ({ instance_url, access_token }) => {
    const res = await fetch(`${instance_url}/services/data/v64.0/sobjects/Address/describe`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${access_token}` }
    });
    return checkResponse(res);
};

export const createAccountWithContact = async ({ instance_url, access_token },{ id, name, email }, { Phone, ShippingCity, ShippingCountryCode, ShippingPostalCode, ShippingStateCode, ShippingStreet }) => {
  const res = await fetch(`${instance_url}/services/data/v64.0/composite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`
    },
    body: JSON.stringify({
        allOrNone: true,
        compositeRequest: [
        {
            method: "PATCH",
            url: `/services/data/v64.0/sobjects/Account/External_Id_c__c/${id}`,
            referenceId: "account",
            body: { Name: name, Phone, ShippingCity, ShippingCountryCode, ShippingPostalCode, ShippingStateCode, ShippingStreet }
        },
        {
            method: "PATCH",
            url: `/services/data/v64.0/sobjects/Contact/External_Id_c__c/${id}`,
            referenceId: "contact",
            body: { FirstName: name, LastName: name, Email: email, Phone, AccountId: "@{account.id}" }
        }
    ]})
  });

    return checkResponse(res);
};

export const getInfo = async ({ instance_url, access_token }, id) => {
    const res = await fetch(`${instance_url}/services/data/v64.0/query/?q=SELECT Phone, ShippingCity, ShippingCountryCode, ShippingPostalCode, ShippingStateCode, ShippingStreet FROM Account WHERE External_Id_c__c=${id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${access_token}` }
    });
    return checkResponse(res);
};