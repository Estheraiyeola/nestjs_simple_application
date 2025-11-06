import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LoanController } from './loan/loan.controller';
import { LoanService } from './loan/loan.service';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [AuthController, LoanController],
  providers: [AuthService, LoanService],
})
export class AppModule {}
