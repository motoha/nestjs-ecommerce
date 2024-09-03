import { IsInt, IsDate, IsString,  IsOptional, IsNumber, IsEnum, IsArray } from 'class-validator';
import { CreateOrderItemDto } from './CreateOrderItemDto';
import { OrderStatus } from '@prisma/client';
import { CreatePaymentDto } from './createPaymentDto';
export class CreateOrderDto {
  @IsInt()
  user_id: number;

  @IsDate()
  order_date: Date;

  @IsOptional()
  @IsInt()
  status_id?: number;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsNumber()
  total_amount: number;

  @IsArray()
  orderItems: CreateOrderItemDto[];

  @IsOptional()
  payment?: CreatePaymentDto;

  // @IsOptional()
  // order_items?: CreateOrderItemDto[];
}