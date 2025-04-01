import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [UserModule, AuthModule, CategoryModule, TransactionModule],
  controllers: [],
  providers: [],
  exports: [UserModule],
})
export class AppModule {}
