import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsUUID } from 'class-validator';

class OrderItemDto {
  @ApiProperty({
    required: true,
    type: 'string',
    format: 'uuid',
  })
  @IsUUID(4)
  productUuid: string;

  @ApiProperty({
    required: true,
    type: 'number',
    default: 1,
  })
  @IsNumber()
  quantity: number;
}

export class OrderCreateDto {
  @ApiProperty({
    required: true,
    isArray: true,
    type: OrderItemDto,
  })
  @IsArray()
  orderItems: OrderItemDto[];
}
