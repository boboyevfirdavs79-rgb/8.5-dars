import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { Repository } from "typeorm";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepo.create(createProductDto);
    return await this.productRepo.save(product);
  }

  async findAll() {
    return this.productRepo.find();
  }

  async findOne(id: number) {
    const foundedProduct = await this.productRepo.findOne({ where: { id } });
    if (!foundedProduct) throw new NotFoundException("Product not found");
    return foundedProduct;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const foundedProduct = await this.productRepo.findOne({ where: { id } });
    if (!foundedProduct) throw new NotFoundException("Product not found");

    Object.assign(foundedProduct, updateProductDto)

    return await this.productRepo.save(foundedProduct);
  }

  async remove(id: number) {
    const foundedProduct = await this.productRepo.findOne({ where: { id } });
    if (!foundedProduct) throw new NotFoundException("Product not found");

    return await this.productRepo.remove(foundedProduct)
  }

  async decrasingQuantity(productId: number, quantity: number) {
    const foundedProduct = await this.productRepo.findOne({where:{id:productId}})
    
    if(!foundedProduct ||foundedProduct.stock < quantity){
      return false
    }

    foundedProduct.stock -= quantity
    await this.productRepo.save(foundedProduct)
    return true
  }
}
