// src/product-ecom/dto/update-product-ecom.dto.ts
import { IsInt, IsString, IsNumber, IsOptional } from 'class-validator';

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
}
