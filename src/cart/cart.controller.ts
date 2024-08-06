 
import { Controller, Post, Body, UseGuards, Request, Req, Get } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/createCartDto';
import { AuthGuard } from 'src/guards/auth.guard';
@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
    constructor(private readonly shoppingCartService: CartService ) {}
    @Post('add')
  async addToCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
    const user  = req.user.user ;
    await this.shoppingCartService.addToCart(user , addToCartDto);
    return { message: 'Product added to cart successfully' };
  }

  @Get() @Get()
  async getCart(@Req() req) {
    const user = req.user.user; // Assuming the user ID is available in the request

    if (user === undefined) {
      throw new Error('User ID is undefined');
    }

    const cart = await this.shoppingCartService.getUserCart(user);
    return cart;
  }

}
