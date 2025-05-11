import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrderProduct } from './order-product.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_pedido: number;

  @Column()
  status: 'Pendente' | 'Concluído' | 'Cancelado';

  @OneToMany(() => OrderProduct, orderProduct => orderProduct.pedido, { cascade: true })
  produtos: OrderProduct[];
}
