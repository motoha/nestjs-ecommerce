import { IsInt, IsDate, IsString,  IsOptional, IsNumber, IsEnum } from 'class-validator';
import { CreateOrderItemDto } from './CreateOrderItemDto';
import { OrderStatus } from '@prisma/client';
export class CreateOrderDto {
  @IsInt()
  user_id: number;

  @IsDate()
  order_date: Date;

 

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsNumber()
  total_amount: number;

  @IsOptional()
  order_items?: CreateOrderItemDto[];
}