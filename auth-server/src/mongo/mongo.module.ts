import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

const makeUri = (
  connectionName: string,
  argConfigService: ConfigService,
): string => {
  const mongoConfig = {
    USER: argConfigService.get<string>('MONGO_USER'),
    PASSWD: argConfigService.get<string>('MONGO_PASSWD'),
    HOST: argConfigService.get<string>('MONGO_HOST'),
    PORT: argConfigService.get<number>('MONGO_PORT'),
  };
  const mongoUrl = `mongodb://${mongoConfig.USER}:${mongoConfig.PASSWD}@${mongoConfig.HOST}:${mongoConfig.PORT}`;
  return `${mongoUrl}/${connectionName}?authSource=admin`;
};

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configservice: ConfigService) => ({
        uri: makeUri('stock', configservice),
      }),
      connectionName: 'stock',
      inject: [ConfigService],
    }),
  ],
})
export class MongoModule {}
