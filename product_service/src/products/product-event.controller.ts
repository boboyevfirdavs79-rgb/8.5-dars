import { Controller, Inject, Logger } from "@nestjs/common";
import { ClientProxy, EventPattern, Payload } from "@nestjs/microservices";
import { ProductsService } from "./products.service";

@Controller("products")
export class ProductsEventController {
  constructor(
    private productService: ProductsService,
    @Inject("ORDER_SERVICE") private clientService: ClientProxy,
  ) {}
  private readonly Logger = new Logger(ProductsEventController.name);
  @EventPattern("created_order")
  async handleOrder(@Payload() orderData: any) {
    if (!orderData) {
      new this.Logger.log("Order data not found");
    }

    const access = await this.productService.decrasingQuantity(
      orderData.productId,
      orderData.quantity,
    );

    const result = {
      orderId: orderData.orderId,
      productId: orderData.productId,
      status: access ? "confirmed" : "rejected"
    }

    this.clientService.emit("status_update", result)
    new this.Logger.log(`"order result: " + ${access ? "confirmed" : "rejected"}`)

  }
}
