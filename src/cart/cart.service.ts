import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddToCartDto } from './dto/createCartDto';
import { ShoppingCart } from '@prisma/client';

@Injectable()
export class CartService {

    constructor(private readonly prisma: PrismaService) {}

    async addToCart(user: number, addToCartDto: AddToCartDto): Promise<void> {
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
        where: { user_id: user },
      });
  
      if (!cart) {
        cart = await this.prisma.shoppingCart.create({
          data: { user_id: user },
        });
      }
  
      // Check if the product is already in the cart
      const existingCartItem = await this.prisma.cartItem.findFirst({
        where: {
          cart_id: cart.cart_id,
          product_id,
        },
      });
  
      if (existingCartItem) {
        // Update the quantity of the existing cart item
        await this.prisma.cartItem.update({
          where: { cart_item_id: existingCartItem.cart_item_id },
          data: { quantity: existingCartItem.quantity + quantity },
        });
      } else {
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

    async getUserCart(user: number): Promise<ShoppingCart & { CartItems: any[] }> {
      if (user === undefined) {
        throw new Error('User ID is undefined');
      }
  
      // Retrieve the shopping cart for the user, including the cart items and product details
      const cart = await this.prisma.shoppingCart.findUnique({
        where: { user_id: user },
        include: {
          CartItems: {
            include: {
              Product: true, // Include product details in the cart items
            },
          },
        },
      });
  
      if (!cart) {
        throw new NotFoundException(`Cart for user with ID ${user} not found`);
      }
  
      return cart;
    }
}
