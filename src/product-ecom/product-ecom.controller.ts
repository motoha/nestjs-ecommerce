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
    Query,
    ParseIntPipe,
    UploadedFiles,
    
  } from '@nestjs/common';
import { ProductEcomService } from './product-ecom.service';
import { Prisma } from '@prisma/client';
import { UpdateProductEcomDto } from './dto/update-product-ecom.dto';
import { CreateProductEcomDto } from './dto/product-ecom';
import { AuthGuard } from 'src/guards/auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/utils/multer-config';
 

@Controller('product')
@UseGuards(AuthGuard)
export class ProductEcomController {
  constructor(private readonly productEcomService: ProductEcomService) {}

  @Post()
  create(@Body() createProductEcomDto: CreateProductEcomDto) {
    return this.productEcomService.create(createProductEcomDto);
  }

  @Get()
  findAll() {
    return this.productEcomService.findAll();
  }

  @Get("/paging")
  async findAllPaging(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;
    const take = pageSize;

    return this.productEcomService.findAllPaging(skip, take);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.productEcomService.findOne(+id);
  // }
  @Get(':id')
  async getProduct(@Param('id', ParseIntPipe) productId: number) {
    return this.productEcomService.getProduct(productId);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductEcomDto: UpdateProductEcomDto) {
    return this.productEcomService.update(+id, updateProductEcomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productEcomService.remove(+id);
  }

  @Post(':id/images')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadProductImage(
    @Param('id', ParseIntPipe) productId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imageUrl = `/uploads/${file.filename}`;
    const productImageData: Prisma.ProductImageCreateInput = {
      image_url: imageUrl,
      Product: {
        connect: {
          product_id: productId,
        },
      },
    };
    return this.productEcomService.createProductImage(productImageData);
  }

  @Post('/images')
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  async createProductWithImages(
    @Body() createProductDto: CreateProductEcomDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productEcomService.createProductWithImages(createProductDto, files);
  }
}
