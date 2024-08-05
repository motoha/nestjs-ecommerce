import { Module } from '@nestjs/common';
 
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductEcomService } from './product-ecom.service';
import { ProductEcomController } from './product-ecom.controller';

@Module({
  imports: [PrismaModule],
  providers: [ProductEcomService],
  controllers: [ProductEcomController]
})
export class ProductEcomModule {}
