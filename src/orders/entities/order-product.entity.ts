import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class OrderProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantidade: number;

  @ManyToOne(() => Product, product => product.orderProducts, { eager: true })
  produto: Product;

  @ManyToOne(() => Order, order => order.produtos, { onDelete: 'CASCADE' })
  pedido: Order;
}
