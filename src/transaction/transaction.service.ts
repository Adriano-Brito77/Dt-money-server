import { Injectable, NotFoundException } from '@nestjs/common';
import { format } from 'date-fns';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async create(
    { description, price, category, type }: CreateTransactionDto,
    user: string,
  ) {
    const categorExists = await this.prisma.category.findFirst({
      where: {
        id: category,
      },
    });

    if (!categorExists) throw new NotFoundException('Categoria não existe!');

    await this.prisma.transaction.create({
      data: {
        description,
        price,
        category: categorExists.name,
        type,
        user,
      },
    });

    return 'Transação incluida com sucesso!';
  }

  async findAll(user: string) {
    const transaction = await this.prisma.transaction.findMany({
      where: {
        user,
      },
      select: {
        id: true,
        description: true,
        price: true,
        category: true,
        type: true,
        createdAt: true,
      },
    });

    // Filtra transações por tipo
    const income = transaction.filter((t) => t.type === 'income');
    const outcome = transaction.filter((t) => t.type === 'outcome');

    // Calcula os totais
    const totalIncome = income.reduce((sum, t) => sum + t.price, 0);
    const totalOutcome = outcome.reduce((sum, t) => sum + t.price, 0);
    const newResult = totalIncome - totalOutcome;
    const result = newResult.toFixed(2);
    return {
      totalIncome,
      totalOutcome,
      result,
      transaction: transaction
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .map((t) => ({
          ...t,
          createdAt: format(new Date(t.createdAt), 'dd-MM-yyyy'),
        })),
    };
  }

  async update(
    id: string,
    { description, price, category, type }: UpdateTransactionDto,
    user: string,
  ) {
    const transactionExists = await this.prisma.transaction.findUnique({
      where: {
        id,
        user,
      },
    });

    if (!transactionExists)
      throw new NotFoundException('Transação não encontrada');

    await this.prisma.transaction.update({
      where: {
        id,
        user,
      },
      data: { description, price, category, type },
    });
    return 'Transação alterada com sucesso!';
  }

  async remove(id: string, user: string) {
    const transactionExist = await this.prisma.transaction.findUnique({
      where: {
        user,
        id,
      },
    });

    if (!transactionExist)
      throw new NotFoundException('Esta transação não existe!');

    await this.prisma.transaction.delete({
      where: {
        id,
        user,
      },
    });

    return 'Transação deletada com sucesso !';
  }
}
