import { Body, Controller, Get, Post, UseGuards,Request, Param, Put } from '@nestjs/common';
import { CreateOrderDto } from './dto/CreateOrderDto';
import { OrderService } from './order.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateOrderDto } from './dto/UpdateOrderDto';

@Controller('order')
@UseGuards(AuthGuard)
export class OrderController {constructor(private readonly orderService: OrderService) {}

@Post()
async createOrder(@Body() createOrderDto: CreateOrderDto) {
  return this.orderService.createOrder(createOrderDto);
}

@Get()
  async getUserOrders(@Request() req) {
    const userId = req.user.userId; // Ensure this is correctly set
    return this.orderService.getUserOrders(userId);
  }
  @Put(':id')
  async updateOrder(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.updateOrder(parseInt(id), updateOrderDto);
  }

}
