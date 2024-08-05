import { Availibility } from '@prisma/client';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsNumber()
  price: number;

   
  @IsOptional()
  sale?: boolean;

  @IsString()
  @IsOptional()
  availibility?: Availibility

  // We don't validate 'image' here because it will be a file, not a string
}