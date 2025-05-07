// src/products/entities/product.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  categoria: string;

  @Column()
  descricao: string;

  @Column('decimal')
  preco: number;

  @Column()
  quantidade_estoque: number;
}
