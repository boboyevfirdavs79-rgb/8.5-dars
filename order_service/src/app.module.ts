import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(configService: ConfigService) => ({
        type:"postgres",
        host:"localhost",
        port:configService.get<number>("DB_PORT"),
        username:"postgres",
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_NAME"),
        entities:[Order],
        autoLoadEntities: true,
        synchronize:true
      })
    }),
    OrdersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
