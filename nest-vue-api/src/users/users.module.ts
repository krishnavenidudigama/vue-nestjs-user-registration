
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserTable } from './entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserTable])],
    controllers: [UsersController],

    // NestJS creates the UsersService instance.
    providers: [UsersService],

    // Allow AuthModule to reuse the same UsersService.
    exports: [UsersService],
})
export class UsersModule {}