import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let repo: Repository<Product>;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repo = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should create a product', async () => {
    const dto: CreateProductDto = {
      nome: 'Camiseta',
      categoria: 'Roupas',
      descricao: 'Camiseta de algodão',
      preco: 29.9,
      quantidade_estoque: 100,
    };

    const fakeProduct = { id: 1, ...dto };

    mockRepo.create.mockReturnValue(fakeProduct);
    mockRepo.save.mockResolvedValue(fakeProduct);

    const result = await service.create(dto);

    expect(mockRepo.create).toHaveBeenCalledWith(dto);
    expect(mockRepo.save).toHaveBeenCalledWith(fakeProduct);
    expect(result).toEqual(fakeProduct);
  });

  it('should find a product by id', async () => {
    const fakeProduct = {
      id: 1,
      nome: 'Boné',
      categoria: 'Acessórios',
      descricao: 'Boné azul',
      preco: 19.9,
      quantidade_estoque: 50,
    };

  it('should return all products', async () => {
  await service.create({
    nome: 'Produto 1',
    categoria: 'Categoria 1',
    descricao: 'Descrição 1',
    preco: 10,
    quantidade_estoque: 5,
  });

  const products = await service.findAll();
  expect(products.length).toBeGreaterThan(0);
});


    mockRepo.findOneBy.mockResolvedValue(fakeProduct);

    const result = await service.findOne(1);
    expect(result).toEqual(fakeProduct);
  });
});
