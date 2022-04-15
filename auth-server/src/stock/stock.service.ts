import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Stock, StockDocument } from 'src/mongo/schemas/stock.schema';
import { StockDayReqDto } from './dto/stock.dto';
import {
  StockDayStaticRangeResult,
  StockDayStaticDayResult,
} from './interface/stock.interface';
import fetch from 'node-fetch';

@Injectable()
export class StockService {
  constructor(
    @InjectModel(Stock.name) private stockModel: Model<StockDocument>,
  ) {}

  async findLimit(limit: number): Promise<any> {
    return await this.stockModel.find().limit(limit);
  }

  async findOne(id: string): Promise<Stock> {
    return await this.stockModel.findOne({ _id: id }).exec();
  }

  async findDate(
    start: string,
    end: string,
    subject: string,
  ): Promise<Stock[]> {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const query = {
      $and: [
        { createdAt: { $gte: startDate } },
        { createdAt: { $lte: endDate } },
        { subject: subject },
      ],
    };
    return await this.stockModel.find(query).exec();
  }

  async queryTest(): Promise<Stock[]> {
    const start = new Date('2022-04-13');
    const end = new Date('2022-04-15');
    const subject = 'google';
    const query = {
      subject: subject,
      $and: [{ createdAt: { $gte: start } }, { createdAt: { $lte: end } }],
    };
    return await this.stockModel.find(query, { uuid: 0 }).exec();
  }

  async getDayStatic(
    info: StockDayReqDto,
  ): Promise<
    [
      StockDayStaticRangeResult,
      StockDayStaticDayResult[],
      Array<number>,
      Array<string>,
      Array<Stock>,
    ]
  > {
    const start = new Date(info.start);
    const end = new Date(info.end);
    const subject = info.subject;
    const query = {
      subject: subject,
      $and: [{ createdAt: { $gte: start } }, { createdAt: { $lte: end } }],
    };
    const cur_result = await this.stockModel.find(query, { uuid: 0 }).exec();
    const [rangeResult, DayResult] = this._getDayStatic(cur_result);
    const [close_prices, close_dates] = await this._getRealStock(
      info.start,
      info.end,
      subject,
    );
    return [rangeResult, DayResult, close_prices, close_dates, cur_result];
  }

  private _getDayStatic(
    queryResults: Stock[],
  ): [StockDayStaticRangeResult, StockDayStaticDayResult[]] {
    const rangeResult = {
      rangePositiveCnt: 0,
      rangeNegativeCnt: 0,
      rangeTotalCnt: 0,
    };
    const dayResultList = [];
    for (const query_result of queryResults) {
      const sentimentResults = query_result['sentiment'];
      let dayPositiveCnt = 0;
      let dayNegativeCnt = 0;
      let dayTotalCnt = 0;
      const dayDict = {
        createdAt: query_result.createdAt.toISOString().split('T')[0],
      };
      for (const sentimentResult of sentimentResults) {
        dayTotalCnt += 1;
        const positive = sentimentResult['positive'];
        const negative = sentimentResult['negative'];
        if (positive > negative && positive > 0.2) {
          dayPositiveCnt += 1;
        } else if (negative > positive && negative > 0.2) {
          dayNegativeCnt += 1;
        } else {
          if (negative * 10 < positive) {
            dayPositiveCnt += 1;
          } else if (positive * 10 < negative) {
            dayNegativeCnt += 1;
          }
        }
      }
      dayDict['positiveCnt'] = dayPositiveCnt;
      dayDict['negativeCnt'] = dayNegativeCnt;
      dayDict['totalCnt'] = dayTotalCnt;
      rangeResult['rangeNegativeCnt'] += dayNegativeCnt;
      rangeResult['rangePositiveCnt'] += dayPositiveCnt;
      rangeResult['rangeTotalCnt'] += dayTotalCnt;
      dayResultList.push(dayDict);
    }
    return [rangeResult, dayResultList];
  }

  private async _getRealStock(start: string, end: string, subject: string) {
    const body = {
      start,
      end,
      subject,
    };
    const requestOption = {
      method: 'POST',
      body: JSON.stringify(body),
    };
    const url = 'http://127.0.0.1:3020/yfin';
    const res = await (await fetch(url, requestOption)).json();
    const close_prices = res['close_prices'];
    const close_dates = res['close_dates'];
    return [close_prices, close_dates];
  }
}
