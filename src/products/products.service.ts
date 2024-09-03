import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto  } from './dtos/product';


interface IProduct {
   
 
  name: string;
  price: any;
  sale:any;
   
  availibility:any
  images: string 
}

@Injectable()
export class ProductsService {
    constructor(private readonly databaseService:PrismaService) {}

    async createProduct(createProductDto: CreateProductDto, file: string) {
      const { name, price, sale, availibility } = createProductDto;
  
      // Here you would typically upload the file to a storage service
      // and get back a URL or file path. For this example, we'll just use the filename.
      // const imagePath = file ? file.filename : null;
      // console.log(imagePath)
      const product = await this.databaseService.product.create({
        data: {
          name,
          price,
          sale,
          availibility,
          image: file
        },
      });
  
      return product;
    }
 
    async createPost(data: Prisma.ProductCreateInput)  {
      return this.databaseService.product.create({
        data,
      });
    }

    async create(createProductDto: Prisma.ProductCreateInput) {
      return this.databaseService.product.create({ data: createProductDto });
    }

  
  
    async findAll() {
      return this.databaseService.product.findMany({
      
      });
    }
  
    async findOne(id: number) {
      return this.databaseService.product.findUnique({
        where: {
          id,
        },
        include: {
          description: true,
          tags: true,
          reviews: true,
        },
      });
    }
  
    async update(id: number, updateProductDto: Prisma.ProductUpdateInput) {
      return this.databaseService.product.update({
        where: {
          id,
        },
        data: updateProductDto,
      });
    }
  
    async remove(id: number) {
      return this.databaseService.product.delete({
        where: { id },
      });
    }
  }
