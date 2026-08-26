import { Module } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ProductsEventController } from "./product-event.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    ClientsModule.register([
      {
        name: "ORDER_SERVICE",

        transport: Transport.RMQ,
        options: {
          urls: ["amqp://localhost:5672"],
          queue: "order_queue",
          queueOptions: {
            durable: true,
          },
        }, 
      }, 
    ]),
  ],
  controllers: [ProductsController, ProductsEventController],
  providers: [ProductsService],
})
export class ProductsModule {}
