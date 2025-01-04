// src/product-ecom/dto/update-product-ecom.dto.ts
import { IsInt, IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class UpdateProductEcomDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsInt()
  @IsOptional()
  stock_quantity?: number;

  @IsInt()
  @IsOptional()
  category_id?: number;

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
 
