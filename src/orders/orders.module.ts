import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { OrderProduct } from './entities/order-product.entity'; // caso esteja usando

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product, OrderProduct])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
