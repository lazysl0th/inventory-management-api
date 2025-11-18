import config from '../config.js';
import { checkResponse } from './salesForce.js';

const { DROPBOX_REFRESH_TOKEN, DROPBOX_APP_KEY, DROPBOX_SECRET_KEY } = config;

export const getAccesTokenDropBox = async () => {
    const res = await fetch('https://api.dropboxapi.com/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: DROPBOX_REFRESH_TOKEN,
            client_id: DROPBOX_APP_KEY,
            client_secret: DROPBOX_SECRET_KEY
        })
    })
    return checkResponse(res);
}

export async function uploadJsonToDropbox(jsonObj, fileName) {
    const token = await getAccesTokenDropBox();
    const res = await fetch("https://content.dropboxapi.com/2/files/upload", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token.access_token}`,
            "Dropbox-API-Arg": JSON.stringify({
                path: `/support/${fileName}`,
                mode: "add",
                autorename: true
            }),
            "Content-Type": "application/octet-stream"
        },
        body: Buffer.from(JSON.stringify(jsonObj, null, 2))
    });
    return checkResponse(res);
}