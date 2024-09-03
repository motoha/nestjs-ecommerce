import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductEcomDto } from './dto/product-ecom';
import { UpdateProductEcomDto } from './dto/update-product-ecom.dto';
import { Prisma, ProductEcom, ProductImage } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
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
        return  this.databaseService.productEcom.findMany({
          include: {
            ProductImage: true, // Include related ProductImage records
          },
        });
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

      async updateProductWithImages(productId: number, updateProductDto: UpdateProductEcomDto, files: Express.Multer.File[]): Promise<any> {
        // Update the product details
        const product = await this.databaseService.productEcom.update({
          where: { product_id: productId },
          data: updateProductDto,
        });
    
        // Handle product images
        const productImages: Prisma.ProductImageCreateInput[] = files.map(file => ({
          image_url: `/uploads/${file.filename}`,
          Product: {
            connect: {
              product_id: product.product_id,
            },
          },
        }));
    
        // Delete existing images if needed
        await this.databaseService.productImage.deleteMany({
          where: { product_id: product.product_id },
        });
    
        // Create new images
        const createdImages = await Promise.all(
          productImages.map(image => this.databaseService.productImage.create({ data: image })),
        );
    
        return {
          ...product,
          ProductImage: createdImages,
        };
      }

      async deleteProductImage(productId: number, imageId: number): Promise<void> {
        // 1. Find the image in the database
        const image = await this.databaseService.productImage.findFirst({
          where: { 
            image_id: imageId,
            Product: {
              product_id: productId
            }
          },
        });
    
        if (!image) {
          throw new NotFoundException(`Image with ID ${imageId} not found for product ${productId}`);
        }
    
        // 2. Delete the image file from the filesystem
        const imagePath = path.join(process.cwd(), image.image_url);
        try {
          fs.unlinkSync(imagePath);
        } catch (error) {
          console.error(`Failed to delete image file: ${error.message}`);
          // Optionally, you can choose to throw an error here if file deletion is crucial
          // throw new InternalServerErrorException('Failed to delete image file');
        }
    
        // 3. Delete the image record from the database
        await this.databaseService.productImage.delete({
          where: { image_id: imageId },
        });
      }
}
