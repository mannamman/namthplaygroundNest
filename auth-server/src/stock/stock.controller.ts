import {
  Controller,
  Get,
  Post,
  UseGuards,
  Render,
  HttpCode,
  Body,
  Response,
  Request,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles-guard/role.guard';
import { StockService } from './stock.service';
import { Stock } from 'src/mongo/schemas/stock.schema';
import { Roles } from 'src/auth/roles-guard/roles.decorator';
import { StockDayReqDto, StockDayResDto } from './dto/stock.dto';

@ApiTags('stock')
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Roles('user')
@Controller('stock')
export class StockController {
  constructor(private stockService: StockService) {}

  @Post('day')
  @HttpCode(200)
  @Render('dayStatistics.hbs')
  @ApiResponse({ type: StockDayResDto })
  async dayStatistics(@Body() info: StockDayReqDto): Promise<StockDayResDto> {
    const [range, day, close_prices, close_dates] =
      await this.stockService.getDayStatic(info);
    return {
      total_cnt: range.rangeTotalCnt,
      positive_cnt: range.rangePositiveCnt,
      negative_cnt: range.rangeNegativeCnt,
      day_statistics: JSON.stringify(day),
      close_prices: close_prices,
      close_dates: close_dates,
      subejct: info.subject,
    };
  }

  @Get('test')
  async test() {
    return await this.stockService.queryTest();
  }

  @Get('index')
  @HttpCode(200)
  @Render('stockIndex.hbs')
  stockIndex() {
    return;
  }
}
