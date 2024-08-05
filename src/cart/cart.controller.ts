 
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
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

}
