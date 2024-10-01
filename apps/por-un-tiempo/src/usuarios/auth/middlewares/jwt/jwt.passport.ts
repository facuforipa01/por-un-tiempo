import { Injectable } from "@nestjs/common";
import { ExtractJwt , Strategy } from 'passport-jwt'
import { PassportStrategy } from "@nestjs/passport";
import { envs } from "apps/por-un-tiempo/src/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: envs.jwt,
        })
    }

    async validate(payload: any) {
        return { ...payload.user }
    }
}