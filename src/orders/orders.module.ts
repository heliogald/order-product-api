import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { OrderProduct } from './entities/order-product.entity';
import { Product } from '../products/entities/product.entity';
import { ProductsModule } from '../products/products.module'; // <-- Importar o módulo

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Product, OrderProduct]),
    ProductsModule, // <-- Importar o módulo que fornece ProductRepository
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
