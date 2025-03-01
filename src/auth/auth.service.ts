import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
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
    res.cookie('access_token', token, {
      httpOnly: true, // Protege contra acesso via JavaScript no frontend
      secure: false, // true apenas em produção (HTTPS)
      sameSite: 'lax', // Permite compartilhamento entre frontend/backend
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias de validade
    });

    // Enviando a resposta com os dados do usuário
    res.json({ user: { name: user.name } });
  }
}
