import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';

@Controller('users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService,
  ) {}

  // POST /users
  @Post()
  create(@Body() createUserDto: CreateUserDto) {

    // Pass the data received from the request to the service.
    return this.usersService.create(createUserDto);
  }

  // GET /users
  @Get()
  findAll() {

    // Ask the service for all users.
    return this.usersService.findAll();
  }
}