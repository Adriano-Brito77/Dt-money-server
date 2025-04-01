import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { ResetPasswordDto } from './dto/create-new-passaword.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>, @Res() res: Response) {
    return this.authService.signIn(signInDto.email, signInDto.password, res);
  }
  @Post('request-password-reset')
  async requestPasswordReset(@Body('email') email: string) {
    return this.authService.requestPasswordReset(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(
      token,
      resetPasswordDto.newPassword,
      resetPasswordDto.confirmPassword,
    );
  }
}
