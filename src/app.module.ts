import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { PropertyModule } from './property/property.module';
import { MessageModule } from './message/message.module';
import { ProductModule } from './products/product.module';
import { MulterModule } from '@nestjs/platform-express';
 
import { ProductEcomModule } from './product-ecom/productEcom.module';
 
import { CategoriesModule } from './category/category.module';
import { CartService } from './cart/cart.service';
import { CartController } from './cart/cart.controller';
import { CartModule } from './cart/cart.module';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { OrderModule } from './order/order.module';
@Module({

  imports: [UserModule, PropertyModule,OrderModule, MessageModule,CategoriesModule, CartModule, ProductModule,ProductEcomModule, MulterModule.register({
    dest: './uploads', // directory to save uploaded files
  }),],
  controllers: [AppController   ],
 
})
export class AppModule {}
