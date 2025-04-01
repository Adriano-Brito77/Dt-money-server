import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_USER, // Seu e-mail,
          pass: process.env.PASSWORD, // Use a senha de app, não a senha real
        },
      },
      defaults: {
        from: '"No Reply" <noreply@seuapp.com>',
      },
      template: {
        dir: process.cwd() + '/src/templates/',
        adapter: new HandlebarsAdapter(), // or new PugAdapter()
        options: {
          strict: false,
        },
      },
    }),
  ],
  providers: [AuthService, PrismaService, UserService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
