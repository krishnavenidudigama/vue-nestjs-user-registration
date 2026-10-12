import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(config: ConfigService) {
        super({
            // Extract the token from Authorization: Bearer <token>.
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

            // Reject tokens whose expiration time has passed.
            ignoreExpiration: false,

            // Verify using the same secret used to sign the token.
            secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
        });
    }

    // Called after Passport verifies the token successfully.
    validate(payload: { sub: number; email: string }) {
        // Passport exposes this returned object as request.user.
        return {
            userId: payload.sub,
            email: payload.email,
        };
    }
}