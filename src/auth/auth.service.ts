import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ user: { name: string }; access_token: string }> {
    if (!email) throw new ConflictException('Digite seu e-mail');
    if (!password) throw new ConflictException('Digite sua senha');
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) throw new NotFoundException('Credenciais invalidas');

    const checkpass = await bcrypt.compare(password, user.password);

    if (!checkpass) {
      throw new UnauthorizedException('Senha invalida');
    }
    const payload = { sub: user.id, userpass: user.email };
    return {
      user: { name: user.name },
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
