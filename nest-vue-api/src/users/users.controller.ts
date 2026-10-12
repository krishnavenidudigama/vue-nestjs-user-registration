import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';

// Our Guard that requires a valid JWT.
import { JwtAuthGuard } from '../auth/guards/authguard';
import { UserTable } from './entities/user.entity';

@Controller('users')
export class UsersController {

    constructor(
        private readonly usersService: UsersService,
    ) { }

    /// GET /users/list?page=1&limit=5&name=krish
    // NestJS verifies the JWT before executing getUsers()
    @UseGuards(JwtAuthGuard)
    @Get('list')
    getUsers(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '5',
        @Query('name') name?: string,
    ) {
        return this.usersService.getUsers(
            Number(page),
            Number(limit),
            name,
        );
    }
    // GET /users/search?name=krishna
    @Get('search')
    searchUsers(@Query('name') name: string) {
        return this.usersService.searchUsers(name);
    }

    // POST /users/login
    @Post('login')
    async login(
        @Body() loginData: {
            email: string;
            password: string;
        },
    ) {
        const user = await this.usersService.login(
            loginData.email,
            loginData.password,
        );

        if (!user) {
            return {
                success: false,
                message: 'Invalid email or password',
            };
        }

        return {
            success: true,
            message: 'Login successful',
            user,
        };
    }

    // POST /users
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    // GET /users
    //requires a valid JWT to retrive all users
    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.usersService.findAll();
    }
    @Get('age')
    findByAge(@Query('age') age: string) {
        return this.usersService.findUsersByAge(Number(age));
    }
    // PATCH /users/1
    @Patch(':id')
    updateUser(
        @Param('id') id: string,
        @Body() updateData: Partial<UserTable>,
    ) {
        return this.usersService.updateUser(
            Number(id),
            updateData,
        );
    }
    // DELETE /users/1
    @Delete(':id')
    deleteUser(@Param('id') id: string) {
        return this.usersService.deleteUser(Number(id));
    }
}