import { NestFactory } from '@nestjs/core';
import { MailerModule } from './mailer.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from 'apps/por-un-tiempo/src/config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>
  (MailerModule, {
    transport: Transport.TCP,
    options: {
      //si lo mandamos a otro lado aca completamos con la informacion correspondiente
      port: envs.ms_port,
      host: envs.ms_host
    }
    //comparte el .env con la app principal
  });
  //los microservicios funcionan como despachadores de eventos
}
bootstrap();
