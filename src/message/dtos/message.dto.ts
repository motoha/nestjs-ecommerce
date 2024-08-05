import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class AddMessageDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  message: string;

  @IsNumber()
  @IsNotEmpty()
  property_id: number;
}
