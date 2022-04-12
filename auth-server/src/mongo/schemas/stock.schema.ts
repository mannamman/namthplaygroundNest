import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuid } from 'uuid';

export type StockDocument = Stock & Document;

@Schema()
export class Stock {
  @Prop({ type: String, default: uuid() })
  uuid: string;

  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop({ type: Array, required: true })
  sentiment: Array<object>;

  @Prop({ type: String, required: true })
  subject: string;
}

export const StockSchema = SchemaFactory.createForClass(Stock);

/*
doc_format = {
  "uuid" : uuid4(),
  "createdAt" : self.kst,
  "sentiment" : sentiment_results
}
sentiment: [
  {
    sentence: string,
    negatice: float,
    positive: float,
    netural: float,
    url: string
  }
]
*/
