import { IsInt, IsNumber,  } from 'class-validator';

export class CreateOrderItemDto {
  @IsInt()
  product_id: number;

  @IsInt()
  quantity: number;

  @IsNumber()
  price: number;
}