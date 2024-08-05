import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    UseInterceptors,
    UploadedFile,
    Delete,
    UseGuards,
    Put
  } from '@nestjs/common';
import { CategoriesService } from './category.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
 

@Controller('categories')
@UseGuards(AuthGuard)
export class CategoriesController {
    constructor(private readonly categoryService: CategoriesService) {}

    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto) {
      return this.categoryService.create(createCategoryDto);
    }
  
    @Get()
    findAll() {
      return this.categoryService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.categoryService.findOne(+id);
    }
  
    @Put(':id')
    update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
      return this.categoryService.update(+id, updateCategoryDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.categoryService.remove(+id);
    }
}