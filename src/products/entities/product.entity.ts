import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrderProduct } from '../../orders/entities/order-product.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ nullable: true })
  categoria?: string;

  @Column({ nullable: true })
  descricao?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  preco: number;

  @Column()
  quantidade_estoque: number;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.produto)
  orderProducts: OrderProduct[];
}