import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [UserModule, AuthModule, CategoryModule],
  controllers: [],
  providers: [],
  exports: [UserModule],
})
export class AppModule {}
