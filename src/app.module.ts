import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { PropertyModule } from './property/property.module';
import { MessageModule } from './message/message.module';
import { ProductModule } from './products/product.module';
import { MulterModule } from '@nestjs/platform-express';
 
import { ProductEcomModule } from './product-ecom/productEcom.module';
 
import { CategoriesModule } from './category/category.module';
@Module({

  imports: [UserModule, PropertyModule, MessageModule,CategoriesModule,  ProductModule,ProductEcomModule, MulterModule.register({
    dest: './uploads', // directory to save uploaded files
  }),],
  controllers: [AppController ],
  providers: [  ],
})
export class AppModule {}
