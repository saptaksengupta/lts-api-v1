import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  const options = new DocumentBuilder()
    .setTitle('List2Share Api Endpoints')
    .setDescription('The List2Share Api Endpoint Documentation.')
    .setVersion('1.0')
    .addTag('list2share')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger-ui-api', app, document);

  await app.listen(9999);
}
bootstrap();
