import { ApiProperty } from '@nestjs/swagger';

export class StockDayReqDto {
  @ApiProperty({
    example: '2022-03-01',
    nullable: false,
    maxLength: 10,
    format: 'yyyy-mm-dd',
    description: 'search start date',
  })
  start: string;
  @ApiProperty({
    example: '2022-03-20',
    nullable: false,
    maxLength: 10,
    format: 'yyyy-mm-dd',
    description: 'search end date',
  })
  end: string;
  @ApiProperty({
    example: 'google',
    nullable: false,
    maxLength: 50,
    description: 'want company name',
  })
  subject: string;
}

export class StockDayResDto {
  @ApiProperty({
    type: Number,
    nullable: false,
    example: 60,
  })
  total_cnt: number;
  @ApiProperty({
    type: Number,
    nullable: false,
    example: 13,
  })
  positive_cnt: number;
  @ApiProperty({
    type: Number,
    nullable: false,
    example: 47,
  })
  negative_cnt: number;
  @ApiProperty({
    type: String,
    nullable: false,
    description: 'result per day, string from object',
    example:
      '[{"createdAt":"2022-03-20","positiveCnt":27,"negativeCnt":42,"totalCnt":100}, {"createdAt":"2022-03-21","positiveCnt":30,"negativeCnt":39,"totalCnt":100}, {"createdAt":"2022-03-22","positiveCnt":38,"negativeCnt":26,"totalCnt":100}]',
  })
  day_statistics: string;
  @ApiProperty({
    type: [Number],
    nullable: false,
    description: 'real stock prices, element is float',
    example: [100.2, 95.7, 30.5],
  })
  close_prices: Array<number>;
  @ApiProperty({
    type: [String],
    nullable: false,
    description: 'real stock prices, element is string',
    example: ['2022-03-25', '2022-03-26', '2022-03-27'],
    format: 'yyyy-mm-dd',
  })
  close_dates: Array<string>;
  subejct: string;
  @ApiProperty({
    type: [String],
    nullable: false,
    description: 'total query result',
    example:
      "[{_id: 'docid', createdAt: 'yyyy-mm-dd hh:mm:ss', subject: 'google', sentiment: [ {positive: 0.5,negative: 0.2,netural: 0.3,sentence: 'headline',url: 'https://...',},],},],",
  })
  result: string;
}
