import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginData: { email?: string; password?: string },
  ) {
    const { email, password } = loginData;

    // Check that both required fields were provided.
    if (!email || !password) {
      throw new BadRequestException(
        'Email and password are required',
      );
    }

    // If fields exist, let AuthService verify the credentials.
    return this.authService.login(email, password);
  }
}