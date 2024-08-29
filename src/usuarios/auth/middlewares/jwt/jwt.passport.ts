import { Injectable } from "@nestjs/common";
import { ExtractJwt , Strategy } from 'passport-jwt'
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SEED,
        })
    }

    async validate(payload: any) {
        return { ...payload.user }
    }
}