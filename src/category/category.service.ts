import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma.service';
import { retry } from 'rxjs';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create({ name }: CreateCategoryDto, user: string) {
    const categoryAlreadyExist = await this.prisma.category.findFirst({
      where: {
        name,
        user,
      },
    });
    if (categoryAlreadyExist)
      throw new ConflictException('Categoria ja cadastrada!');

    const category = await this.prisma.category.create({
      data: {
        name,
        user,
      },
    });
    return category;
  }

  async findAll(user: string) {
    const categoryExist = await this.prisma.category.findMany({
      where: {
        user,
      },
    });
    return categoryExist;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
