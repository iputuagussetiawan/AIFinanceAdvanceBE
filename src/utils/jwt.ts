import jwt, { SignOptions } from 'jsonwebtoken'

import { config } from '../config/app.config'
import type { UserDocument } from '../modules/user/user.model'

export type AccessTPayload = {
    userId: UserDocument['_id']
}

type SignOptsAndSecret = SignOptions & {
    secret: string
}

const defaults: SignOptions = {
    audience: ['user']
}

export const accessTokenSignOptions: SignOptsAndSecret = {
    expiresIn: '1d',
    secret: config.JWT_SECRET
}

export const signJwtToken = (payload: AccessTPayload, options?: SignOptsAndSecret) => {
    const { secret, ...opts } = options || accessTokenSignOptions
    return jwt.sign(payload, secret, {
        ...defaults,
        ...opts
    })
}
