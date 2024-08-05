import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddToCartDto } from './dto/createCartDto';

@Injectable()
export class CartService {

    constructor(private readonly prisma: PrismaService) {}

    async addToCart(user : number, addToCartDto: AddToCartDto): Promise<void> {
      const { product_id, quantity } = addToCartDto;
  
      // Check if the product exists
      const product = await this.prisma.productEcom.findUnique({
        where: { product_id },
      });
  
      if (!product) {
        throw new NotFoundException(`Product with ID ${product_id} not found`);
      }
  
      // Check if the user has a shopping cart, if not, create one
      let cart = await this.prisma.shoppingCart.findUnique({
        where: { user_id: user  },
      });
  
      if (!cart) {
        cart = await this.prisma.shoppingCart.create({
          data: { user_id: user  },
        });
      }
  
      // Add the product to the cart
      await this.prisma.cartItem.create({
        data: {
          cart_id: cart.cart_id,
          product_id,
          quantity,
        },
      });
    }
}
