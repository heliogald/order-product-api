import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { OrderProduct } from './entities/order-product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(OrderProduct)
    private readonly orderProductRepo: Repository<OrderProduct>,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const queryRunner = this.orderRepo.manager.connection.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const orderProducts: OrderProduct[] = [];
      let totalPedido = 0;

      // Processa cada item do pedido
      for (const item of dto.produtos) {
        const produto = await queryRunner.manager.findOne(Product, {
          where: { id: item.produtoId },
          lock: { mode: 'pessimistic_write' }
        });

        if (!produto) {
          throw new NotFoundException(`Produto com ID ${item.produtoId} não encontrado`);
        }

        if (produto.quantidade_estoque < item.quantidade) {
          throw new BadRequestException(
            `Estoque insuficiente para ${produto.nome} (ID: ${produto.id}). ` +
            `Disponível: ${produto.quantidade_estoque}, Solicitado: ${item.quantidade}`
          );
        }

        // Atualiza estoque
        produto.quantidade_estoque -= item.quantidade;
        await queryRunner.manager.save(produto);

        // Calcula total
        const subtotal = produto.preco * item.quantidade;
        totalPedido += subtotal;

        // Prepara relação
        orderProducts.push(
          queryRunner.manager.create(OrderProduct, {
            produto,
            quantidade: item.quantidade,
            precoUnitario: produto.preco,
          })
        );
      }

      // Cria o pedido
      const pedido = queryRunner.manager.create(Order, {
        total_pedido: totalPedido,
        status: OrderStatus.PENDENTE,
      });
      
      const pedidoSalvo = await queryRunner.manager.save(pedido);

      // Associa produtos ao pedido
      await Promise.all(
        orderProducts.map(op => {
          op.pedido = pedidoSalvo;
          return queryRunner.manager.save(OrderProduct, op);
        })
      );

      // Commit da transação
      await queryRunner.commitTransaction();

      // Retorna pedido completo
      return this.getOrderWithProducts(pedidoSalvo.id);
    } catch (error) {
      // Rollback em caso de erro
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Falha ao criar pedido: ' + error.message);
    } finally {
      // Libera o queryRunner
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepo.find({
      relations: ['produtos', 'produtos.produto'],
      order: { id: 'DESC' },
    });
  }

  async updateStatus(id: number, newStatus: OrderStatus): Promise<Order> {
    const pedido = await this.getOrderWithProducts(id);
    
    // Valida transições de status
    this.validateStatusTransition(pedido.status, newStatus);

    // Lógica específica para cancelamento
    if (newStatus === OrderStatus.CANCELADO) {
      await this.restoreStock(pedido);
    }

    pedido.status = newStatus;
    pedido.data_atualizacao = new Date();
    
    return this.orderRepo.save(pedido);
  }

  private async getOrderWithProducts(id: number): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['produtos', 'produtos.produto'],
    });

    if (!order) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }

    return order;
  }

  private async restoreStock(order: Order): Promise<void> {
    await Promise.all(
      order.produtos.map(async (op) => {
        await this.productRepo.increment(
          { id: op.produto.id },
          'quantidade_estoque',
          op.quantidade
        );
      })
    );
  }

    private validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): void {
        const validTransitions: Record<OrderStatus, OrderStatus[]> = {
            [OrderStatus.PENDENTE]: [OrderStatus.CONCLUIDO, OrderStatus.CANCELADO],
            [OrderStatus.CONCLUIDO]: [],
            [OrderStatus.CANCELADO]: [],
        };

        if (!validTransitions[currentStatus].includes(newStatus)) {
            throw new BadRequestException(
                `Transição de status inválida: de ${currentStatus} para ${newStatus}`
            );
        }
    }
}