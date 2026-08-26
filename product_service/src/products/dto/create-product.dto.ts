import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateProductDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @IsPositive()
  price!: number;

  @IsNumber()
  stock!: number;
}
