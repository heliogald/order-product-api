import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { OrderProduct } from './entities/order-product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './entities/order.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

// Mock implementations com tipos completos
const mockOrderRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  manager: {
    connection: {
      createQueryRunner: jest.fn(() => ({
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          findOne: jest.fn(),
          save: jest.fn(),
          create: jest.fn(),
        },
      })),
    },
  },
});

const mockProductRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  increment: jest.fn(),
});

const mockOrderProductRepository = () => ({
  save: jest.fn(),
});

describe('OrdersService', () => {
  let service: OrdersService;
  let orderRepository: ReturnType<typeof mockOrderRepository>;
  let productRepository: ReturnType<typeof mockProductRepository>;
  let orderProductRepository: ReturnType<typeof mockOrderProductRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useFactory: mockOrderRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useFactory: mockProductRepository,
        },
        {
          provide: getRepositoryToken(OrderProduct),
          useFactory: mockOrderProductRepository,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    orderRepository = module.get(getRepositoryToken(Order));
    productRepository = module.get(getRepositoryToken(Product));
    orderProductRepository = module.get(getRepositoryToken(OrderProduct));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('should successfully create an order', async () => {
      const mockProduct = {
        id: 1,
        nome: 'Produto Teste',
        preco: 100,
        quantidade_estoque: 10,
      };

      const mockOrderDto: CreateOrderDto = {
        produtos: [
          { produtoId: 1, quantidade: 2 }
        ]
      };

      productRepository.findOne.mockResolvedValue(mockProduct);
      orderRepository.create.mockReturnValue({ id: 1, total_pedido: 200 });
      orderRepository.save.mockResolvedValue({ id: 1, status: OrderStatus.PENDENTE });

      const result = await service.create(mockOrderDto);

      expect(result).toBeDefined();
      expect(result.status).toBe(OrderStatus.PENDENTE);
      expect(productRepository.findOne).toHaveBeenCalled();
      expect(orderRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when product does not exist', async () => {
      productRepository.findOne.mockResolvedValue(null);

      await expect(service.create({
        produtos: [{ produtoId: 999, quantidade: 1 }]
      })).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when stock is insufficient', async () => {
      productRepository.findOne.mockResolvedValue({
        id: 1,
        quantidade_estoque: 5
      });

      await expect(service.create({
        produtos: [{ produtoId: 1, quantidade: 10 }]
      })).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll()', () => {
    it('should return an array of orders', async () => {
      const mockOrders = [
        { id: 1, status: OrderStatus.PENDENTE },
        { id: 2, status: OrderStatus.CONCLUIDO }
      ];

      orderRepository.find.mockResolvedValue(mockOrders);

      const result = await service.findAll();

      expect(result).toEqual(mockOrders);
      expect(orderRepository.find).toHaveBeenCalled();
    });
  });

  describe('updateStatus()', () => {
    it('should update order status to CONCLUIDO', async () => {
      const mockOrder = {
        id: 1,
        status: OrderStatus.PENDENTE,
        produtos: [{ produto: { id: 1 }, quantidade: 2 }]
      };

      orderRepository.findOne.mockResolvedValue(mockOrder);
      orderRepository.save.mockResolvedValue({ ...mockOrder, status: OrderStatus.CONCLUIDO });

      const result = await service.updateStatus(1, OrderStatus.CONCLUIDO);

      expect(result.status).toBe(OrderStatus.CONCLUIDO);
      expect(orderRepository.save).toHaveBeenCalled();
    });

    it('should restore stock when cancelling order', async () => {
      const mockOrder = {
        id: 1,
        status: OrderStatus.PENDENTE,
        produtos: [{ produto: { id: 1 }, quantidade: 2 }]
      };

      orderRepository.findOne.mockResolvedValue(mockOrder);
      orderRepository.save.mockResolvedValue({ ...mockOrder, status: OrderStatus.CANCELADO });

      const result = await service.updateStatus(1, OrderStatus.CANCELADO);

      expect(result.status).toBe(OrderStatus.CANCELADO);
      expect(productRepository.increment).toHaveBeenCalledWith(
        { id: 1 },
        'quantidade_estoque',
        2
      );
    });

    it('should throw BadRequestException for invalid status transition', async () => {
      const mockOrder = {
        id: 1,
        status: OrderStatus.CONCLUIDO,
        produtos: []
      };

      orderRepository.findOne.mockResolvedValue(mockOrder);

      await expect(service.updateStatus(1, OrderStatus.PENDENTE))
        .rejects.toThrow(BadRequestException);
    });
  });
});