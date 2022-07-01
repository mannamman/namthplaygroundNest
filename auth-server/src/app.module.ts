import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { ReqLoggerMiddleware } from './middlewares/req.log.middleware';
import { ConfigModule } from '@nestjs/config';
import { PublicController } from './public.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MySqlModule } from './mysql/mysql.module';
import { MongoModule } from './mongo/mongo.module';
import { StockModule } from './stock/stock.module';
import { WinstonModule } from 'nest-winston';
// import * as winston from 'winston';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRoot({}),
    AuthModule,
    UsersModule,
    MySqlModule,
    MongoModule,
    StockModule,
  ],
  controllers: [PublicController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(PublicController);
    consumer.apply(ReqLoggerMiddleware).forRoutes('*');
  }
}
