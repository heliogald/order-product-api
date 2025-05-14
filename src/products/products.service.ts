import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  // Cria um novo produto
  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(dto);
    try {
      return await this.productRepository.save(product);
    } catch (error) {
      this.logger.error('Erro ao criar produto', error.stack);
      throw new Error('Erro ao criar produto');
    }
  }

  // Retorna todos os produtos
  async findAll(): Promise<Product[]> {
    try {
      return await this.productRepository.find();
    } catch (error) {
      this.logger.error('Erro ao buscar produtos', error.stack);
      throw new Error('Erro ao buscar produtos');
    }
  }

  // Retorna um produto pelo ID
  async findOne(id: number): Promise<Product> {
    try {
      const product = await this.productRepository.findOne({ where: { id } });
      if (!product) {
        this.logger.warn(`Produto com ID ${id} não encontrado`);
        throw new NotFoundException(`Produto com ID ${id} não encontrado`);
      }
      return product;
    } catch (error) {
      this.logger.error(`Erro ao buscar produto com ID ${id}`, error.stack);
      throw new Error(`Erro ao buscar produto com ID ${id}`);
    }
  }

  // Atualiza um produto existente
  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    try {
      const product = await this.findOne(id);
      this.productRepository.merge(product, dto);
      return await this.productRepository.save(product);
    } catch (error) {
      this.logger.error(`Erro ao atualizar produto com ID ${id}`, error.stack);
      throw new Error(`Erro ao atualizar produto com ID ${id}`);
    }
  }

  // Remove um produto pelo ID
  async remove(id: number): Promise<void> {
    try {
      const result = await this.productRepository.delete(id);
      if (result.affected === 0) {
        this.logger.warn(`Produto com ID ${id} não encontrado para remoção`);
        throw new NotFoundException(`Produto com ID ${id} não encontrado`);
      }
    } catch (error) {
      this.logger.error(`Erro ao remover produto com ID ${id}`, error.stack);
      throw new Error(`Erro ao remover produto com ID ${id}`);
    }
  }
}
