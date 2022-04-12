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

async function bootstrap() {
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

  await app.listen(8080, '0.0.0.0');
}
bootstrap();
