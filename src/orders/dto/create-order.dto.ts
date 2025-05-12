import { IsArray, ValidateNested, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ProdutoPedidoDto {
  @ApiProperty({ example: 1, description: 'ID do produto' })
  @Type(() => Number) // ✅ converte string para número
  @IsNumber()
  produtoId: number;

  @ApiProperty({ example: 2, description: 'Quantidade desejada' })
  @Type(() => Number) // ✅ converte string para número
  @IsNumber()
  @IsPositive()
  quantidade: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [ProdutoPedidoDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProdutoPedidoDto)
  produtos: ProdutoPedidoDto[];
}
