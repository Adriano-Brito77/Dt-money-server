import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create({ name, email, password }: CreateUserDto) {
    const emailAlreadyExists = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    console.log(emailAlreadyExists);

    if (emailAlreadyExists) throw new ConflictException('Email ja cadastrado');

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

  async login({ email, password }: CreateUserDto) {
    const userExistcs = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!userExistcs) throw new NotFoundException('Usuario não existe');

    if (userExistcs.password != password)
      throw new UnauthorizedException('Credenciais inválidas');

    return 'Login relizado com sucesso';
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }
}
