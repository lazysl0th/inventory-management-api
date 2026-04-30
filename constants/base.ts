const {
    NODE_ENV,
    PORT,
    FRONTEND,
    BACKEND,
} = process.env;

const isProd = NODE_ENV === 'production'

export const APP_PORT = isProd && PORT ? PORT : 3001

export const FRONTEND_URL = isProd && FRONTEND ? FRONTEND : 'http://localhost:8080'

export const BACKEND_URL = isProd && BACKEND ? BACKEND : 'http://localhost:3001'

