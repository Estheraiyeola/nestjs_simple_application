
import { Module } from '@nestjs/common';
import { LoanService } from './loan.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { LoanController } from './loan.controller';

@Module({
  imports: [UsersModule],
  providers: [LoanService],
  controllers: [LoanController],
  exports: [LoanService],
})
export class LoanModule {}
