import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create({ name, email, password, confirmPassword }: CreateUserDto) {
    if (!name) throw new ConflictException('Digite seu nome !');
    if (!email) throw new ConflictException('Digite seu e-mail !');
    if (!password) throw new ConflictException('Digite sua senha !');
    if (!confirmPassword)
      throw new ConflictException('Digite a confirmação de senha !');

    const emailAlreadyExists = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (emailAlreadyExists) throw new ConflictException('Email ja cadastrado');
    if (password !== confirmPassword) {
      console.log(password, confirmPassword);
      throw new ConflictException('As senhas não coincidem');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
    });
    return user;
  }

  async update(id: string, { name, email, password }: UpdateUserDto) {
    const userExists = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!userExists) throw new NotFoundException('Usuario invalido');

    if (!name) name = userExists.name;

    if (!email) email = userExists.email;

    if (!password) {
      password = userExists.password;
    } else {
      const passwordHash = await bcrypt.hash(password, 10);
      password = passwordHash;
    }

    const editUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        password,
      },
    });

    return editUser;
  }
}
