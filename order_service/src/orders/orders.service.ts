import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Order, OrderStatus } from "./entities/order.entity";
import { Repository } from "typeorm";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @Inject("PRODUCT_SERVICE") private clientService: ClientProxy
) {}
  async create(createOrderDto: CreateOrderDto) {

    const order = this.orderRepo.create({
      productId:createOrderDto.productId,
      quantity:createOrderDto.quantity,
      status:OrderStatus.PENDING
  })

  await this.orderRepo.save(order)

  this.clientService.emit("created_order", {
    orderId:order.id,
    productId:order.productId,
    quantity:order.quantity
  })

    await this.orderRepo.save(order);
    return;
  }

  async findAll() {
    return this.orderRepo.find();
  }

  async findOne(id: number) {
    const foundedOrder = await this.orderRepo.findOne({ where: { id } });
    if (!foundedOrder) throw new NotFoundException("Order not found");
    return foundedOrder;
  }

  async updateStatus(data:any) {
    const foundedOrder = await this.orderRepo.findOne({where:{id:data.orderId}})

    if(!foundedOrder) throw new NotFoundException("Ordernot found")

      foundedOrder.status = data.status
      return await this.orderRepo.save(foundedOrder)
  }
}
