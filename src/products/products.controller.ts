import { Controller } from '@nestjs/common';

@Controller('products')
export class ProductsController {}


// import {
//     Controller,
//     Post,
//     Get,
//     Put,
//     Delete,
//     Param,
//     Body,
//     UseGuards,
//     ParseIntPipe,
//   } from '@nestjs/common';
//   import { ProductsService } from './products.service';
//   import { CreateProductDto } from './dto/create-product.dto';
//   import { UpdateProductDto } from './dto/update-product.dto';
//   import { JwtAuthGuard } from '../auth/jwt-auth.guard';
//   import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
  
//   @ApiTags('Produtos')
//   @ApiBearerAuth()
//   @UseGuards(JwtAuthGuard)
//   @Controller('products')
//   export class ProductsController {
//     constructor(private readonly productService: ProductsService) {}
  
//     @Post()
//     @ApiOperation({ summary: 'Criar novo produto' })
//     create(@Body() dto: CreateProductDto) {
//       return this.productService.create(dto);
//     }
  
//     @Get()
//     @ApiOperation({ summary: 'Listar todos os produtos' })
//     findAll() {
//       return this.productService.findAll();
//     }
  
//     @Get(':id')
//     @ApiOperation({ summary: 'Buscar produto por ID' })
//     findOne(@Param('id', ParseIntPipe) id: number) {
//       return this.productService.findOne(id);
//     }
  
//     @Put(':id')
//     @ApiOperation({ summary: 'Atualizar produto por ID' })
//     update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
//       return this.productService.update(id, dto);
//     }
  
//     @Delete(':id')
//     @ApiOperation({ summary: 'Deletar produto por ID' })
//     remove(@Param('id', ParseIntPipe) id: number) {
//       return this.productService.remove(id);
//     }
//   }
  