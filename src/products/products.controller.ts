
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
    UseGuards
  } from '@nestjs/common';
  import { ProductsService } from './products.service';
  import { Prisma } from '@prisma/client';
  import { AuthGuard } from 'src/guards/auth.guard';
  import {FileInterceptor} from "@nestjs/platform-express";
  import {diskStorage} from "multer";
  import multer from 'multer';
  import {Response} from "express";
  import  * as path from "path";
  import { extname } from 'path';
import { CreateProductDto } from './dtos/product';
  
@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController { constructor(private readonly productsService: ProductsService) {}

@Post("/upload")
@UseInterceptors(FileInterceptor('file' , {
  storage : diskStorage({
    destination : "./uploads",
    filename : (req , file , cb) => {
      cb(null , `${file.originalname}`)
    }
  })
}))
async uploadFile(@Body() body,@UploadedFile() file : any) {
  console.log(file);
  return "success";
}

// @Post('/post-upload')
//   @UseInterceptors(FileInterceptor('file' , {
//     storage : diskStorage({
//       destination : "./uploads",
//       filename : (req , file , cb) => {
//         cb(null , `${file.originalname}`)
//       }
//     })
//   }))
//   async createProduct(
//     @UploadedFile() file: Express.Multer.File,
//     @Body() data: createProductDto ,
//   ) {
//     return await this.productsService.addProduct({
//       ...data,
//       images :  file.filename ,
         
     
//     });
//   }

  @Post('/up')
  @UseInterceptors(FileInterceptor('file' , {
    storage : diskStorage({
      destination : "./uploads",
      filename : (req , file , cb) => {
        cb(null , `${file.originalname}`)
      }
    })
  }))
  async createProducts(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productsService.createProduct(createProductDto, file.filename);
  }
 

@Post('news')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `${uniqueSuffix}${ext}`;
        callback(null, filename);
      },
    }),
  }))
  async uploadNews(@Body() createProductDto: Prisma.ProductCreateInput, @UploadedFile() file) {
    console.log(file.path)
    return this.productsService.create(createProductDto);
  }
 
@Post()
create(@Body() createProductDto: Prisma.ProductCreateInput) {
  return this.productsService.create(createProductDto);
}

@Get()
findAll() {
  return this.productsService.findAll();
}

@Get(':id')
findOne(@Param('id') id: string) {
  return this.productsService.findOne(+id);
}

@Patch(':id')
update(
  @Param('id') id: string,
  @Body() updateProductDto: Prisma.ProductUpdateInput,
) {
  return this.productsService.update(+id, updateProductDto);
}

@Delete(':id')
remove(@Param('id') id: string) {
  return this.productsService.remove(+id);
}
}
