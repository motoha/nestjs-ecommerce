import { Module } from '@nestjs/common';
 
import { PrismaModule } from 'src/prisma/prisma.module';
import { CategoriesService } from './category.service';
import { CategoriesController } from './category.controller';
 

@Module({
  imports: [PrismaModule],
  providers: [CategoriesService ],
  controllers: [CategoriesController]
})
export class CategoriesModule {}
