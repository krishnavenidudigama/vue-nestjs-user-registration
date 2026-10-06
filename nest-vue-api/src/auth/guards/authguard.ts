import {
    Injectable,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    handleRequest(
        err: any,
        user: any,
        info: any,
        context: ExecutionContext,
        status?: any,
    ) {
        if (err || !user) {
            throw new ForbiddenException(
                'Access denied: valid authentication is required',
            );
        }

        return user;
    }
}