import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { OrderProduct } from './entities/order-product.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(OrderProduct) private orderProductRepo: Repository<OrderProduct>,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    let total = 0;
    const produtosPedido: OrderProduct[] = [];

    for (const item of dto.produtos) {      
      console.log(typeof item.produtoId, item.produtoId); 
      const product = await this.productRepo.findOneBy({ id: item.produtoId });
      if (!product) throw new BadRequestException('Produto não encontrado');

      if (product.quantidade_estoque < item.quantidade) {
        throw new BadRequestException(`Estoque insuficiente para o produto ${product.nome}`);
      }

      product.quantidade_estoque -= item.quantidade;
      await this.productRepo.save(product);

      total += product.preco * item.quantidade;

      const orderProduct = this.orderProductRepo.create({
        produto: product,
        quantidade: item.quantidade,
      });

      produtosPedido.push(orderProduct);
    }

    const pedido = this.orderRepo.create({
      total_pedido: total,
      status: 'Pendente',
    });

    const pedidoSalvo = await this.orderRepo.save(pedido);

    for (const op of produtosPedido) {
      op.pedido = pedidoSalvo;
      await this.orderProductRepo.save(op);
    }

    const pedidoComProdutos = await this.orderRepo.findOne({
      where: { id: pedidoSalvo.id },
      relations: ['produtos', 'produtos.produto'],
    });

    if (!pedidoComProdutos) {
      throw new Error('Erro ao buscar o pedido salvo com os produtos.');
    }

    return pedidoComProdutos;
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepo.find({
      relations: ['produtos', 'produtos.produto'],
    });
  }
}
