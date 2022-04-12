import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StockSchema } from 'src/mongo/schemas/stock.schema';
import { StockController } from './stock.controller';
import { Stock } from 'src/mongo/schemas/stock.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Stock.name, schema: StockSchema, collection: 'en' }],
      'stock',
    ),
  ],
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}
