import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { fastifyHelmet } from 'fastify-helmet';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import fastifyCookie from 'fastify-cookie';
import { AppModule } from './app.module';
import { NextFunction, Request, Response } from 'express';

async function bootstrap() {
  let isDisableKeepAlive = false;
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    // fastify
    new FastifyAdapter(),
  );
  // helmet true
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [
          `'self'`,
          'data:',
          'validator.swagger.io',
          'https://www.namthplayground/',
        ],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
    global: true,
  });
  app.enableCors({});
  // helmet false
  // await app.register(fastifyHelmet, {
  //   contentSecurityPolicy: false,
  // });
  // fastify cookie
  app.register(fastifyCookie);
  // html
  app.useStaticAssets({
    root: join(__dirname, '..', 'public'),
    prefix: '/public/',
  });
  app.setViewEngine({
    engine: {
      handlebars: require('handlebars'),
    },
    templates: join(__dirname, '..', 'views'),
  });
  // swagger
  const config = new DocumentBuilder()
    .setTitle('NamthPlayGround API Document!')
    .setDescription('The NamthPlayGround API description')
    .setVersion('1.0')
    .addTag('Nest')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(8080, '0.0.0.0', () => {
    // 앱이 초기화를 끝내고 응답을 받을 준비가 되면 마스터에게 신호 전달
    process.send('ready');
    console.log(`application is listening on port 8080...`);
  });
  // 타임아웃으로 서비스가 중단되는 문제를 해결
  app.use((req: Request, res: Response, next: NextFunction) => {
    // SIGINT를 수신하여 isDisableKeepAlive True라면 모든 요청 거부, 연결 종료
    if (isDisableKeepAlive) {
      res.set('Connection', 'close');
    }
    next();
  });
  // PM2 무중단
  process.on('SIGINT', async () => {
    // SIGINT 신호를 받으면 flag를 변경하여 더 이상 요청을 무시
    isDisableKeepAlive = true;
    await app.close();
    console.log('server closed!');
    process.exit();
  });
}
bootstrap();
