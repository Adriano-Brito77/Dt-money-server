import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma.service';

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

  async update(id: string, user: string, { name }: UpdateCategoryDto) {
    const categorAlreadyExists = await this.prisma.category.findUnique({
      where: {
        id,
        user,
      },
    });

    if (!categorAlreadyExists)
      throw new NotFoundException('Categoria não encontrada!');

    const editcategory = await this.prisma.category.update({
      where: {
        id,
        user,
      },
      data: {
        name,
      },
    });
    return 'Categoria atualizada com sucesso!';
  }

  async remove(id: string, user: string) {
    const categoryexists = await this.prisma.category.findUnique({
      where: {
        id,
        user,
      },
    });

    if (!categoryexists)
      throw new NotFoundException('Categoria não encontrada!');

    const deleteCategory = await this.prisma.category.delete({
      where: {
        id,
        user,
      },
    });

    return 'Categoria deletada com sucesso!';
  }
}
