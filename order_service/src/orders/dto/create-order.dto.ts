import { IsNumber, IsPositive } from "class-validator";

export class CreateOrderDto {
  @IsNumber()
  @IsPositive()
  productId!: number;

  @IsNumber()
  @IsPositive()
  quantity!: number;

  
}
