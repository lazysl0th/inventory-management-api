import { selectAdminsEmail } from '../models/user.js';
import { uploadJsonToDropbox } from '../services/support.js';
import { response } from '../constants.js';

const { OK } = response;

export const sendSupportRequest = async(req, res) => {
    try {
        const { userName, userEmail, ...data } = req.body;
        const adminsEmail = await selectAdminsEmail();
        const fileName = `support_${Date.now()}.json`;
        const jsonObj = {
            reportedBy: { name: userName, email: userEmail },
            ...data,
            createdAt: new Date().toISOString(),
            adminsEmail: adminsEmail.map(email => email.email) ?? []
        }
        const result = await uploadJsonToDropbox(jsonObj, fileName);
        return res.status(OK.statusCode).json({ success: true, file: result });
    } catch (e) {
        console.log(e);
        next(e);
    }
}