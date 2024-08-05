import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductEcomDto } from './dto/product-ecom';
import { UpdateProductEcomDto } from './dto/update-product-ecom.dto';
import { Prisma, ProductEcom, ProductImage } from '@prisma/client';
 
// interface IProductEcom {
   
//     name: string;
//     price: any;
//     description:any;
//     stock_quantity:any
//     category_id: any
//   }
  
@Injectable()
export class ProductEcomService {
    constructor(private readonly databaseService:PrismaService) {}
    async createProductEcomx(createProductEcomDto: CreateProductEcomDto, file: string) {
        const { name, price, description ,stock_quantity, category_id } =  createProductEcomDto;
    
     
        const productEcom = await this.databaseService.productEcom.create({
          data: {
            name,
            price,
            description,
            stock_quantity,
            category_id
   
          },
        });
    
        return productEcom;
      }

      create(createProductEcomDto: CreateProductEcomDto) {
        return   this.databaseService.productEcom.create({
          data: createProductEcomDto,
        });
      }
      async findAllPaging(skip: number, take: number) {
        const products = await this.databaseService.productEcom.findMany({
          skip,
          take,
          include: {
            Category: true,
            OrderItems: true,
            CartItems: true,
            Reviews: true,
          },
        });
    
        const total = await this.databaseService.productEcom.count();
    
        return {
          data: products,
          total,
        };
      }
      findAll() {
        return  this.databaseService.productEcom.findMany();
      }
    
      findOne(product_id: number) {
        return  this.databaseService.productEcom.findUnique({
          where: { product_id },
        });
      }
    
      update(product_id: number, updateProductEcomDto: UpdateProductEcomDto) {
        return  this.databaseService.productEcom.update({
          where: { product_id },
          data: updateProductEcomDto,
        });
      }
    
      remove(product_id: number) {
        return  this.databaseService.productEcom.delete({
          where: { product_id },
        });
      }

      async createProductImage(data: Prisma.ProductImageCreateInput): Promise<ProductImage> {
        return this.databaseService.productImage.create({
          data,
        });
      }
      async getProduct(productId: number): Promise<ProductEcom & { ProductImage: ProductImage[] }> {
        return this.databaseService.productEcom.findUnique({
          where: { product_id: productId },
          include: {
            ProductImage: true, // Include related ProductImage records
          },
        });
      }

      async createProductWithImages(createProductDto: CreateProductEcomDto, files: Express.Multer.File[]): Promise<any> {
        const product = await this.databaseService.productEcom.create({
          data: createProductDto,
        });
    
        const productImages: ProductImage[] = [];
        for (const file of files) {
          const imageUrl = `/uploads/${file.filename}`;
          const productImageData: Prisma.ProductImageCreateInput = {
            image_url: imageUrl,
            Product: {
              connect: {
                product_id: product.product_id,
              },
            },
          };
          const productImage = await this.databaseService.productImage.create({
            data: productImageData,
          });
          productImages.push(productImage);
        }
    
        return {
          ...product,
          ProductImage: productImages,
        };
      }
}
