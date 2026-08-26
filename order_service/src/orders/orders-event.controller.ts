import { OrdersService } from './orders.service';
import { Controller, Logger } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { OrderStatus } from "./entities/order.entity";

@Controller('orders')
export class OrdersEventController {
  constructor(private ordersService:OrdersService) {}
  private readonly Logger = new Logger(OrdersEventController.name)
  @EventPattern("status_update")
  async handleOrderStatus(@Payload() orderStatus:any){
    await this.ordersService.updateStatus(orderStatus)
    new this.Logger.log("Order statusi tasdiqlandi")
    
  } 



}