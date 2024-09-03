import { IsDate, IsNumber, IsString } from "class-validator";

export class CreatePaymentDto {
    @IsDate()
    payment_date: Date;
  
    @IsNumber()
    amount: number;
  
    @IsString()
    payment_method: string;
  
    @IsString()
    status: string;
  }