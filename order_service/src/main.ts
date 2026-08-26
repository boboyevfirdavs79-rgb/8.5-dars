import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)
  
  app.useGlobalPipes(new ValidationPipe({whitelist:true, transform:true}))
  app.connectMicroservice<MicroserviceOptions>({
    transport:Transport.RMQ,   
    options:{
      urls:['amqp://localhost:5672'], 
      queue:configService.get<string>("RABBITMQ_ORDER_QUEUE"),
      queueOptions:{
        durable:true  
      }
    }
  })

  await app.startAllMicroservices()

  const PORT = configService.get<number>("PORT") ?? 4001
  
  await app.listen(PORT, () => {
    console.log(`Order service ${PORT}da ishladi`);
    
  });
}
bootstrap();
