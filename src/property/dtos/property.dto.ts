import { PartialType } from '@nestjs/mapped-types';
import { PropertyType } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class AddPropertyDto {
  @IsEnum(PropertyType)
  type: PropertyType;

  @IsNumber()
  @Min(10)
  area: number;

  @IsNumber()
  @Min(1)
  price: number;

  @Min(1)
  bedrooms: number;

  @Min(1)
  bathrooms: number;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsArray()
  @IsOptional()
  images: string[];
}

export class UpdatePropertyDto extends PartialType(AddPropertyDto) {}

export class PropertyResponseDto {
  id: number;
  type: string;
  area: number;
  price: number;
  bedrooms: number;
  bathrooms: number;
  city: string;
  address: string;

  @Exclude()
  realtor_id: number;

  @Expose({ name: 'realtor' })
  realtor() {
    return this.realtor_id;
  }

  @Exclude()
  images: {
    url: string;
  }[];

  @Expose({ name: 'image' })
  image() {
    return this.images[0]?.url;
  }

  createdAt: Date;
  @Exclude()
  updatedAt: Date;

  constructor(data: Partial<PropertyResponseDto>) {
    Object.assign(this, data);
  }
}
