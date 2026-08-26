import { Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { OrdersEventController } from "./orders-event.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    ClientsModule.register([
      {
        name: "PRODUCT_SERVICE",

        transport: Transport.RMQ,
        options: {
          urls: ["amqp://localhost:5672"],
          queue: "product_queue",
          queueOptions: {
            durable: true
          },
        },
      },
    ]),
  ], 
  controllers: [OrdersController, OrdersEventController],
  providers: [OrdersService],
})
export class OrdersModule {}
