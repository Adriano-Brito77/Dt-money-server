import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/jwt/current_user';
import { AuthUser } from 'src/auth/jwt/current_user';

@Controller('transaction')
@UseGuards(AuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.transactionService.create(createTransactionDto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.transactionService.findAll(user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.transactionService.update(id, updateTransactionDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.transactionService.remove(id, user.id);
  }
}
