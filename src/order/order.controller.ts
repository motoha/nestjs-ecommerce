import { Body, Controller, Get, Post, UseGuards,Request, Param, Put, ParseIntPipe, Query, UsePipes } from '@nestjs/common';
import { CreateOrderDto } from './dto/CreateOrderDto';
import { OrderService } from './order.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateOrderDto } from './dto/UpdateOrderDto';
import { Order, OrderStatus } from '@prisma/client';
import { OrderStatusValidationPipe } from 'src/utils/CustomOrderStatusValidationPipe';

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

  @Get('user/:userId')
  async getOrdersByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.orderService.getOrdersByUserId(userId);
  }
  @Get(':orderId')
  async getOrderById(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderService.getOrderById(orderId);
  }

  @Get('status')
  @UsePipes(new OrderStatusValidationPipe())
  async getOrdersByStatus(@Query('status') status: OrderStatus) {
    return this.orderService.getOrdersByStatus(status);
  }

  @Get('status/:statusId')
  async findOrdersByStatusId(@Param('statusId') statusId: number): Promise<Order[]> {
    return this.orderService.findOrdersByStatusId(statusId);
  }
}
