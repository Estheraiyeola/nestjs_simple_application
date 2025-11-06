import { Controller, UseGuards, Get, Request, Req, Query, Param, Delete } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { LoanService } from './loan.service';

@UseGuards(AuthGuard, RolesGuard)
@Controller('loan')
export class LoanController {
    constructor(private loanService: LoanService) {}

    @Roles('admin', 'superAdmin', 'staff')
    @Get()
    async getLoans(@Req() req: Request & { user: any }, @Query('status') status?: string) {
        const role = req.user.role;
        const loans = await this.loanService.getLoans();

        // filter by status if provided
        const filtered = status ? loans.filter(l => l.status === status) : loans;

        if (role === 'staff') {
            return filtered.map(loan => ({
                id: loan.id,
                amount: loan.amount,
                maturityDate: loan.maturityDate,
                status: loan.status,
                createdAt: loan.createdAt,
                applicant: {
                    name: loan.applicant?.name,
                    email: loan.applicant?.email,
                    telephone: loan.applicant?.telephone,
                }
            }));
        }
        return filtered;
    }

    // fetch loan by email
    @Roles('admin', 'superAdmin', 'staff')
    @Get(':userEmail/get')
    async getLoansByEmail(@Param('userEmail') userEmail: string) {
        try {
            const loans = await this.loanService.findLoanByEmail(userEmail);
            if (loans.length === 0) {
                return { ok: true, loans: [], message: 'No loans found for this email' };
            }
            return { ok: true, loans };
        } catch (error) {
            return { ok: false, message: 'An error occurred', error: error.message };
        }
    }

    // fetch expired loans
    @Roles('admin', 'superAdmin', 'staff')
    @Get('expired')
    async getExpiredLoans() {
        try {
            const currentDate = new Date();
            const loans = await this.loanService.getLoans();
            const expiredLoans = loans.filter(loan => new Date(loan.maturityDate) < currentDate);
            return { ok: true, loans: expiredLoans };
        } catch (error) {
            return { ok: false, message: 'An error occurred', error: error.message };
        }
    }

    // delete loan by loan id
    @Roles('superAdmin')
    @Delete(':loanId/delete')
    async deleteLoanById(@Param('loanId') loanId: string) {
        try {
            const deleted = await this.loanService.deleteLoan(loanId);
            if (!deleted) {
                return { ok: false, message: 'Loan not found' };
            }
            return { ok: true, message: 'Loan deleted successfully' };
        } catch (error) {
            return { ok: false, message: 'An error occurred', error: error.message };
        }
    }
}
