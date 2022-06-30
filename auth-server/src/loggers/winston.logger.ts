import { LoggerService } from '@nestjs/common';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import * as moment from 'moment';

const { errors, combine, json, timestamp, ms, prettyPrint } = winston.format;

// debug: console에만 출력
// 나머지는 log파일에 기록
// error은 발생시 새로운 파일 생성

const logPath = '/home/ubuntu/logs/nestLogs';

export class WinstonLoggerService implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      format: combine(
        errors({ stack: true }),
        json(),
        timestamp({ format: 'isoDateTime' }),
        ms(),
        prettyPrint(),
      ),
      transports: [
        new winston.transports.File({
          level: 'error',
          filename: `error-${moment(new Date()).format('YYYY-MM-DD')}.log`,
          dirname: logPath,
          maxsize: 5000000,
        }),

        new winston.transports.Console({
          level: 'debug',
          format: combine(nestWinstonModuleUtilities.format.nestLike()),
        }),

        new winston.transports.File({
          filename: `nest-${moment(new Date()).format('YYYY-MM-DD')}.log`,
          dirname: logPath,
          maxsize: 5000000,
        }),
      ],
    });

    // debug로 로깅
    console.log = (message: any, params?: any) => {
      this.logger.debug(message, params);
    };
  }

  log(message: string) {
    this.logger.info(message);
  }
  error(message: string, trace: string) {
    this.logger.error(message, trace);
  }
  warn(message: string) {
    // this.logger.warning(message);
    this.logger.warn(message);
  }
  debug(message: string) {
    this.logger.debug(message);
  }
  verbose(message: string) {
    this.logger.verbose(message);
  }
}
