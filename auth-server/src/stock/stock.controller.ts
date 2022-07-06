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
  MethodNotAllowedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles-guard/role.guard';
import { StockService } from './stock.service';
import { Stock } from 'src/mongo/schemas/stock.schema';
import { Roles } from 'src/auth/roles-guard/roles.decorator';
import { StockDayReqDto, StockDayResDto } from './dto/stock.dto';

@ApiTags('stock')
// @UseGuards(JwtAuthGuard)
// @UseGuards(RolesGuard)
@Controller('stock')
export class StockController {
  constructor(
    private stockService: StockService,
  ) {}

  @Post('day')
  // @Roles('user')
  @HttpCode(200)
  @Render('dayStatistics.hbs')
  @ApiResponse({ type: StockDayResDto })
  async dayStatistics(@Body() info: StockDayReqDto): Promise<StockDayResDto> {
    const [range, day, close_prices, close_dates, queryResult] =
      await this.stockService.getDayStatic(info);
    return {
      total_cnt: range.rangeTotalCnt,
      positive_cnt: range.rangePositiveCnt,
      negative_cnt: range.rangeNegativeCnt,
      day_statistics: JSON.stringify(day),
      close_prices: close_prices,
      close_dates: close_dates,
      subejct: info.subject,
      result: JSON.stringify(queryResult),
    };
  }

  @Get('day')
  // @Roles('user')
  @HttpCode(405)
  dayNotAllowed() {
    throw new MethodNotAllowedException();
  }

  @Get('index')
  // @Roles('user')
  @HttpCode(200)
  @Render('stockIndex.hbs')
  stockIndex() {
    return;
  }
}
