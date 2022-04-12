import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configservice: ConfigService) => ({
        type: 'mysql',
        host: configservice.get<string>('MYSQL_HOST'),
        port: configservice.get<number>('MYSQL_PORT'),
        username: configservice.get<string>('MYSQL_USER'),
        password: configservice.get<string>('MYSQL_PASSWD'),
        database: configservice.get<string>('MYSQL_DBNAME'),
        entities: [UserEntity],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class MySqlModule {
  constructor(private connection: Connection) {}
}
