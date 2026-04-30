import 'dotenv/config';

const {
    NODE_ENV,
    CLOUDINARY_NAME,
    CLOUDINARY_KEY,
    CLOUDINARY_SECRET,
    DROPBOX_REFRESH_TOKEN,
    DROPBOX_APP_KEY,
    DROPBOX_SECRET_KEY,
    DROPBOX_CALLBACK_URL,
    SF_CONSUMER_KEY,
    SF_CONSUMER_SECRET,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN,
    GOOGLE_CALLBACK_URL,
    FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET,
    FACEBOOK_CALLBACK_URL,
} = process.env;

const isProd = NODE_ENV === 'production'

export const DROPBOX = {
    GRANT_TYPE: 'refresh_token',
    REFRESH_TOKEN: DROPBOX_REFRESH_TOKEN ? DROPBOX_REFRESH_TOKEN : '',
    CLIENT_ID: DROPBOX_APP_KEY ? DROPBOX_APP_KEY : '',
    CLIENT_SECRET: DROPBOX_SECRET_KEY ? DROPBOX_SECRET_KEY : '',
    REDIRECT_URI: NODE_ENV === 'production' && DROPBOX_CALLBACK_URL ? DROPBOX_CALLBACK_URL : 'http://localhost:3001/signin/dropbox/callback',
    BASE_URL: 'https://api.dropboxapi.com',
    CONTENT_URL: 'https://content.dropboxapi.com',
}

export const CLOUDINARY = {
    CLOUD_NAME: CLOUDINARY_NAME ? CLOUDINARY_NAME : '',
    API_KEY: CLOUDINARY_KEY ? CLOUDINARY_KEY : '',
    API_SECRET: CLOUDINARY_SECRET ? CLOUDINARY_SECRET : '',
    UPLOAD_FOLDER: 'inventory-images',
}

export const SALES_FORCE = {
    CLIENT_ID: SF_CONSUMER_KEY ? SF_CONSUMER_KEY : '',
    CLIENT_SECRET: SF_CONSUMER_SECRET ? SF_CONSUMER_SECRET : '',
    BASE_URL: 'https://orgfarm-9325b65284-dev-ed.develop.my.salesforce.com/services',
}

export const GOOGLE = {
    CLIENT_ID: GOOGLE_CLIENT_ID ? GOOGLE_CLIENT_ID : '',
    CLIENT_SECRET: GOOGLE_CLIENT_SECRET ? GOOGLE_CLIENT_SECRET : '',
    REDIRECT_URL: 'https://developers.google.com/oauthplayground',
    REFRESH_TOKEN: GOOGLE_REFRESH_TOKEN ? GOOGLE_REFRESH_TOKEN : '',
    CALLBACK_URL: isProd && GOOGLE_CALLBACK_URL ? GOOGLE_CALLBACK_URL : 'http://localhost:3001/signin/google/callback',
}

export const FACEBOOK = {
    CLIENT_ID: FACEBOOK_APP_ID ? FACEBOOK_APP_ID : '',
    CLIENT_SECRET: FACEBOOK_APP_SECRET ? FACEBOOK_APP_SECRET : '',
    CALLBACK_URL: isProd && FACEBOOK_CALLBACK_URL ? FACEBOOK_CALLBACK_URL : 'http://localhost:3001/signin/facebook/callback',
}