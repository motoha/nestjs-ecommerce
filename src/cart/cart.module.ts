import { Module } from '@nestjs/common';
 
import { PrismaModule } from 'src/prisma/prisma.module';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
 

@Module({
  imports: [PrismaModule],
  providers: [CartService ],
  controllers: [CartController]
})
export class CartModule {}
