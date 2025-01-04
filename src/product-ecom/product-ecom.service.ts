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
            ProductImage :true
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
            ProductImage: true, 
            Colors: {
              include: {
                Color: true,
              },
            },
            Sizes: {
              include: {
                Size: true,
              },
            },
          },
        });
      }
      async getProductx(productId: number) {
        const product = await this.databaseService.productEcom.findUnique({
          where: { product_id: productId },
          include: {
            ProductImage: true,
            Brand: true,
            Category: true,
            Colors: {
              include: {
                Color: true,
              },
            },
            Sizes: {
              include: {
                Size: true,
              },
            },
          },
        });
      
        if (!product) {
          throw new NotFoundException(`Product with ID ${productId} not found`);
        }
      
        // // Check for invalid datetime and replace it
        // if (product.created_at.getFullYear() === 0) {
        //   product.created_at = new Date(); // Replace with a valid datetime
        // }
      
        return product;
      }
      async createProductWithImagesx(createProductDto: CreateProductEcomDto, files: Express.Multer.File[]): Promise<any> {
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

      async updateProductWithImagesx(productId: number, updateProductDto: UpdateProductEcomDto, files: Express.Multer.File[]): Promise<any> {
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

      async getProductsByCategory(categoryId: number) {
        return this.databaseService.productEcom.findMany({
          where: {
            category_id: categoryId,
          },
          include: {
            Category: true,
            ProductImage: true,
          },
        });
      }
    
      async getAllProductsWithCategories() {
        return this.databaseService.productEcom.findMany({
          include: {
            Category: true,
            ProductImage: true,
          },
        });
      }

      //update
      async createProductWithImages(
        createProductDto: CreateProductEcomDto,
        files: Express.Multer.File[],
      ): Promise<any> {
        // Extract brand_id, color_ids, and size_ids from DTO
        const { brand_id, color_ids, size_ids, category_id, ...productData } = createProductDto;
      
        // Convert color_ids and size_ids to numbers
        const numericColorIds = color_ids?.map((id) => Number(id)) || [];
        const numericSizeIds = size_ids?.map((id) => Number(id)) || [];
      
        console.log('Brand ID:', brand_id);
        console.log('Color IDs:', numericColorIds);
        console.log('Size IDs:', numericSizeIds);
        console.log('Category ID:', category_id);
      
        // Create the product
        const product = await this.databaseService.productEcom.create({
          data: {
            ...productData,
            Category: { connect: { category_id } }, // Ensure category_id exists
            Brand: brand_id ? { connect: { brand_id } } : undefined, // Connect brand if provided
            Colors: numericColorIds.length > 0
              ? {
                  create: numericColorIds.map((colorId) => ({
                    Color: { connect: { color_id: colorId } },
                  })),
                }
              : undefined, // Create colors only if provided
            Sizes: numericSizeIds.length > 0
              ? {
                  create: numericSizeIds.map((sizeId) => ({
                    Size: { connect: { size_id: sizeId } },
                  })),
                }
              : undefined, // Create sizes only if provided
          },
          include: {
            Brand: true,
            Colors: true,
            Sizes: true,
          },
        });
      
        // Add product images
        const productImages = await Promise.all(
          files.map((file) =>
            this.databaseService.productImage.create({
              data: {
                image_url: `/uploads/${file.filename}`,
                Product: { connect: { product_id: product.product_id } },
              },
            }),
          ),
        );
      
        return {
          ...product,
          ProductImage: productImages,
        };
      }

      async updateProductWithImages(
        productId: number,
        updateProductDto: UpdateProductEcomDto,
        files: Express.Multer.File[],
      ): Promise<any> {
        const { brand_id, category_id, color_ids, size_ids, ...productData } = updateProductDto;
      
        // Update product details with relations
        const product = await this.databaseService.productEcom.update({
          where: { product_id: productId },
          data: {
            ...productData,
            Category: {
              connect: { category_id },
            },
            Brand: brand_id
              ? {
                  connect: { brand_id },
                }
              : undefined,
          },
        });
      
        // Handle colors (if provided)
        if (color_ids) {
          // Delete existing colors for the product
          await this.databaseService.productColor.deleteMany({
            where: { product_id: productId },
          });
      
          // Add new colors
          await Promise.all(
            color_ids.map((colorId) =>
              this.databaseService.productColor.create({
                data: {
                  product_id: productId,
                  color_id: colorId,
                },
              }),
            ),
          );
        }
      
        // Handle sizes (if provided)
        if (size_ids) {
          // Delete existing sizes for the product
          await this.databaseService.productSize.deleteMany({
            where: { product_id: productId },
          });
      
          // Add new sizes
          await Promise.all(
            size_ids.map((sizeId) =>
              this.databaseService.productSize.create({
                data: {
                  product_id: productId,
                  size_id: sizeId,
                },
              }),
            ),
          );
        }
      
        // Update product images
        // Delete existing images for the product
        await this.databaseService.productImage.deleteMany({
          where: { product_id: productId },
        });
      
        // Add new images
        const productImages = await Promise.all(
          files.map((file) =>
            this.databaseService.productImage.create({
              data: {
                image_url: `/uploads/${file.filename}`,
                Product: { connect: { product_id: productId } },
              },
            }),
          ),
        );
      
        return {
          ...product,
          ProductImage: productImages,
        };
      }
      
}
