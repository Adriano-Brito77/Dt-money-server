import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailerService,
  ) {}

  async signIn(
    email: string,
    password: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!email) throw new BadRequestException('Digite seu e-mail');
    if (!password) throw new BadRequestException('Digite sua senha');

    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) throw new NotFoundException('Credenciais inválidas');

    const checkpass = await bcrypt.compare(password, user.password);
    if (!checkpass) throw new UnauthorizedException('Senha inválida');

    const payload = { sub: user.id, userpass: user.email };
    const token = await this.jwtService.signAsync(payload);

    // Salvando o token no cookie
    // res.cookie('access_token', token, {
    //   httpOnly: true, // Protege contra acesso via JavaScript no frontend
    //   secure: false, // true apenas em produção (HTTPS)
    //   sameSite: 'lax', // Permite compartilhamento entre frontend/backend
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias de validade
    // });

    // Enviando a resposta com os dados do usuário
    res.json({ user: { name: user.name }, token });
  }
  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email: email },
    });
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const payload = { email: user.email };
    const token = this.jwtService.sign(payload, { expiresIn: '1h' });

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    // Enviar e-mail com o link de redefinição de senha
    // Enviar o e-mail com o template
    await this.mailService.sendMail({
      to: user.email,
      subject: 'Redefinição de Senha',
      template: 'resetPassword', // Caminho do template (sem a extensão .hbs)
      context: {
        name: user.name, // Passando o nome do usuário para o template
        resetLink, // Passando o link de redefinição de senha
      },
    });

    return { message: 'E-mail de redefinição de senha enviado' };
  }

  async resetPassword(
    token: string,
    newPassword: string,
    confirmPassword: string,
  ) {
    if (!newPassword)
      throw new BadRequestException('Preencha o campo Nova Senha!');
    if (!confirmPassword)
      throw new BadRequestException('Preencha o campo Confirmação de Senha!');

    if (newPassword !== confirmPassword)
      throw new BadRequestException('As senhas não coincidem!');
    try {
      const { email } = this.jwtService.verify(token);
      const user = await this.prisma.user.findFirst({
        where: { email: email },
      });
      if (!user) {
        throw new BadRequestException('Usuário não encontrado');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.prisma.user.update({
        where: { id: user.id }, // Identificar o usuário pelo ID
        data: { password: hashedPassword }, // Atualizar o campo de senha
      });

      return { message: 'Senha redefinida com sucesso' };
    } catch (err) {
      throw new BadRequestException('Token inválido ou expirado', err);
    }
  }
}
