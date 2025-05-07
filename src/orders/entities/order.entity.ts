// src/orders/entities/order.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('json')
  produtos: { id: number; quantidade: number }[];

  @Column('decimal')
  total_pedido: number;

  @Column()
  status: 'Pendente' | 'Concluído' | 'Cancelado';
}
