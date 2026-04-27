import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow the React frontend (port 3000) to call this backend
  app.enableCors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
});

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`Backend running on http://localhost:${port}`);
}
bootstrap();