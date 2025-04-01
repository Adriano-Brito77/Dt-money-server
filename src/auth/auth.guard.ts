import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Tentando extrair o token apenas dos cookies
    const token = this.extractTokenFromCookies(request);
    if (!token) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    try {
      // Verificando o token usando o segredo
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      // Adicionando o payload no request para que as rotas protegidas possam acessar
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Usuário não autenticado!');
    }

    return true;
  }

  private extractTokenFromCookies(request: Request): string | undefined {
    // Extraindo o token diretamente dos cookies
    return request.cookies['access_token'];
  }
}
