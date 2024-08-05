import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from '@prisma/client';
import { UpdateCategoryDto } from './dto/update-category.dto';
 

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) {}
    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        return this.prisma.category.create({ data: createCategoryDto });
      }
    
      async findAll(): Promise<Category[]> {
        return this.prisma.category.findMany();
      }
    
      async findOne(id: number): Promise<Category> {
        return this.prisma.category.findUnique({ where: { category_id: id } });
      }
    
      async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        return this.prisma.category.update({
          where: { category_id: id },
          data: updateCategoryDto,
        });
      }
    
      async remove(id: number): Promise<Category> {
        return this.prisma.category.delete({ where: { category_id: id } });
      }
}