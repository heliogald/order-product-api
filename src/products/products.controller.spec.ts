import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should create a product', () => {
    const dto: CreateProductDto = {
      nome: 'Camiseta',
      categoria: 'Roupas',
      descricao: 'Camiseta de algodão',
      preco: 29.9,
      quantidade_estoque: 100,
    };

    const result = service.create(dto);
    expect(result).toMatchObject(dto);
    expect(result.id).toBeDefined();
  });

  it('should find a product by id', () => {
    const created = service.create({
      nome: 'Boné',
      categoria: 'Acessórios',
      descricao: 'Boné azul',
      preco: 19.9,
      quantidade_estoque: 50,
    });

    const found = service.findOne(created.id);
    expect(found).toEqual(created);
  });
});
