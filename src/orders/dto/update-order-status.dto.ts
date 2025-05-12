import { IsEnum } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: OrderStatus,
    example: OrderStatus.CONCLUIDO,
    description: 'Novo status do pedido'
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}