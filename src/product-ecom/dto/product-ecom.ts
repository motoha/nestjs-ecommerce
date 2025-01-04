// src/product-ecom/dto/create-product-ecom.dto.ts
import { IsInt, IsString, IsNotEmpty, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateProductEcomDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsInt()
  @IsNotEmpty()
  stock_quantity: number;

  @IsInt()
  @IsNotEmpty()
  category_id: number;

  
  @IsOptional()
  @IsNumber()
  brand_id?: number;

  @IsOptional()
  @IsArray()
  color_ids?: number[];

  @IsOptional()
  @IsArray()
  size_ids?: number[];
}
