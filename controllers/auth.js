import { Liveblocks } from "@liveblocks/node";
import { register } from '../services/auth.js';
import { response, modelName } from '../constants.js';
import Conflict from '../errors/conflict.js';
import config from '../config.js';

const { CREATED, CONFLICT, OK } = response;
const { FRONTEND, LIVEBLOCKS_SECRET_KEY } = config;

const liveblocks = new Liveblocks({ secret: LIVEBLOCKS_SECRET_KEY });

export const registerUser = async (req, res, next) => {
    try{
        const user = await register(req.body);
        return res.status(CREATED.statusCode).send({ user });
    } catch (e) {
        console.log(e)
        if (e.code == 'P2002') return next(new Conflict(CONFLICT.text(modelName.USER)));
        return next(e);
    }
}

export const loginUser = (req, res, next) => {
    try {
        if (req.headers['content-type']?.includes('application/json')) return res.status(200).json(req.user);
        return res.redirect(`${FRONTEND}/?token=${req.user.token}`);
    } catch (e) {
        console.log(e);
        return next(e);
    }
}

export const loginLiveblocks = async (req, res) => {
    try {
        const { room } = req.body;
        if (!room) return res.status(400).json({ error: "Room not provided" });
        const session = liveblocks.prepareSession(
            req.user?.id?.toString() || "guest",
            { userInfo: { name: req.user?.name || "Guest" } }
        );
        session.allow(room, session.FULL_ACCESS);
        const { body, status } = await session.authorize();
        res.status(status).send(body);
  } catch (e) {
        res.status(403).send({ error: e.message });
  }
  
}