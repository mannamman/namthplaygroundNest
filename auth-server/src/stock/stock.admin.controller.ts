import { Controller, Get, UseGuards, Render, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles-guard/role.guard';
import { StockService } from './stock.service';
import { Roles } from 'src/auth/roles-guard/roles.decorator';

@ApiTags('stockAdmin')
@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@Roles('admin')
@Controller('stock/admin')
export class StockAdminController {
  constructor(
    private stockService: StockService,
    private readonly logger: Logger,
  ) {}

  @Get('index')
  @Render('adminIndex.hbs')
  adminIndex() {
    return;
  }

  @Get('subject')
  @Render('adminSubject.hbs')
  async adminSubject() {
    const result = await this.stockService.getSubjects();
    return {
      subjects: result,
    };
  }
}
