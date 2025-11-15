import { getAccessInfo, getAddress, createAccountWithContact, getInfo } from '../services/salesForce.js'
import { selectUserById } from '../models/user.js';

import { response } from '../constants.js'

const { OK } = response;

export const getLocation = async (req, res, next) => {
    try {
        const accessInfo = await getAccessInfo();
        const adderess = await getAddress(accessInfo);
        const countryField = adderess.fields.find(field => field.name === "CountryCode");
        const stateField = adderess.fields.find(field => field.name === "StateCode");
        return res.status(OK.statusCode).send({ countries: countryField.picklistValues, states: stateField.picklistValues })
    } catch(e) {
        console.log(e);
        return next(e);
    }
}

export const addAdditionalInfo = async (req, res, next) => {
    try {
        const user = req.body.userId ? await selectUserById(req.body.userId) : req.user;
        const accessInfo = await getAccessInfo();
        const sfId = await createAccountWithContact(accessInfo, user, req.body);
        if (sfId.compositeResponse.every(res => res.httpStatusCode === 200 || res.httpStatusCode === 201)) {
            const result = sfId.compositeResponse.reduce((acc, res) => {
                acc[res.referenceId + "Id"] = res.body.id;
                return acc
            }, {})
            return res.status(OK.statusCode).send(result);
        }
        else throw new Error(sfId.errors);
    } catch(e) {
        console.log(e);
        return next(e);
    }
}

export const getAdditionalInfo = async (req, res, next) => {
    try {
        const accessInfo = await getAccessInfo();
        const additionalInfo = await getInfo(accessInfo, req.body.userId ? req.body.userId : req.user.id);
        return res.status(OK.statusCode).send(additionalInfo.records);
    } catch (e) {
        console.log(e);
        return next(e);
    }
}