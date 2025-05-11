import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity'; 

@Injectable()
export class ProductsService {
  private products: Product[] = [];
  private nextId = 1;

  create(dto: CreateProductDto): Product {
    const product: Product = {
      id: this.nextId++,
      ...dto,
    };
    this.products.push(product);
    return product;
  }

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: number): Product {
    const product = this.products.find(p => p.id === id);
    if (!product) throw new NotFoundException('Produto não encontrado');
    return product;
  }

  update(id: number, dto: UpdateProductDto): Product {
    const product = this.findOne(id);
    const updated = { ...product, ...dto };
    const index = this.products.findIndex(p => p.id === id);
    this.products[index] = updated;
    return updated;
  }

  remove(id: number): void {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) throw new NotFoundException('Produto não encontrado');
    this.products.splice(index, 1);
  }
}
