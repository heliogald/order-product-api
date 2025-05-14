import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should create a product', async () => {
    const dto: CreateProductDto = {
      nome: 'Camisa',
      categoria: 'Roupas',
      descricao: 'Camisa de linho',
      preco: 49.9,
      quantidade_estoque: 30,
    };

    const result = await controller.create(dto);
    expect(result).toMatchObject(dto);
    expect(result.id).toBeDefined();
  });

  it('should return all products', async () => {
    const result = await controller.findAll();
    expect(Array.isArray(result)).toBe(true);
  });

  it('should get a product by id', async () => {
    const created = await controller.create({
      nome: 'Tênis',
      categoria: 'Calçados',
      descricao: 'Tênis esportivo',
      preco: 99.9,
      quantidade_estoque: 20,
    });

    const found = await controller.findOne(created.id);
    expect(found).toEqual(created);
  });

  it('should update a product', async () => {
    const created = await controller.create({
      nome: 'Meia',
      categoria: 'Acessórios',
      descricao: 'Meia de algodão',
      preco: 9.9,
      quantidade_estoque: 60,
    });

    const updated = await controller.update(created.id, {
      preco: 12.5,
    });

    expect(updated.preco).toBe(12.5);
  });

  it('should delete a product', async () => {
    const created = await controller.create({
      nome: 'Cinto',
      categoria: 'Acessórios',
      descricao: 'Cinto de couro',
      preco: 25.0,
      quantidade_estoque: 15,
    });

    const removed = await controller.remove(created.id);
    expect(removed).toBeTruthy();
  });
});
