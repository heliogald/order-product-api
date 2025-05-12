import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrderProduct } from './order-product.entity';

export enum OrderStatus {
  PENDENTE = 'Pendente',
  CONCLUIDO = 'Concluído',
  CANCELADO = 'Cancelado',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.pedido, {
    cascade: true,
  })
  produtos: OrderProduct[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_pedido: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDENTE,
  })
  status: OrderStatus;
}