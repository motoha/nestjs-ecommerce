import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/CreateOrderItemDto';
import { CreateOrderDto } from './dto/CreateOrderDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateOrderDto } from './dto/UpdateOrderDto';

@Injectable()
export class OrderService {
  
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<any> {
    const { user_id, order_date, status, total_amount, order_items } = createOrderDto;

    // Validate that all product_ids exist
    for (const item of order_items) {
      const product = await this.prisma.productEcom.findUnique({
        where: { product_id: item.product_id },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${item.product_id} not found`);
      }
    }

    // Create the order
    const order = await this.prisma.order.create({
      data: {
        user_id,
        order_date,
        status,
        total_amount,
      },
    });

    // Create the order items
    const createdOrderItems = await Promise.all(
      order_items.map((item: CreateOrderItemDto) =>
        this.prisma.orderItem.create({
          data: {
            order_id: order.order_id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
          },
        }),
      ),
    );

    return {
      ...order,
      order_items: createdOrderItems,
    };
  }

  async getUserOrders(userId: number): Promise<any> {
    return this.prisma.order.findMany({
      where: { user_id: userId },
      include: {
        OrderItems: {
          include: {
            Product: true,
          },
        },
      },
    });
  }
  async updateOrder(orderId: number, updateOrderDto: UpdateOrderDto): Promise<any> {
    const { order_date, status, total_amount } = updateOrderDto;

    // Check if the order exists
    const order = await this.prisma.order.findUnique({
      where: { order_id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    // Update the order
    return this.prisma.order.update({
      where: { order_id: orderId },
      data: {
        order_date,
        status,
        total_amount,
      },
    });
  }
// async createOrder(createOrderDto: CreateOrderDto): Promise<any> {
//   const { user_id, order_date, status, total_amount, order_items } = createOrderDto;

//   // Validate that all product_ids exist
//   for (const item of order_items) {
//     const product = await this.prisma.productEcom.findUnique({
//       where: { product_id: item.product_id },
//     });

//     if (!product) {
//       throw new NotFoundException(`Product with ID ${item.product_id} not found`);
//     }
//   }

//   // Create the order
//   const order = await this.prisma.order.create({
//     data: {
//       user_id,
//       order_date,
//       status,
//       total_amount,
//     },
//   });

//   // Create the order items
//   const createdOrderItems = await Promise.all(
//     order_items.map((item: CreateOrderItemDto) =>
//       this.prisma.orderItem.create({
//         data: {
//           order_id: order.order_id,
//           product_id: item.product_id,
//           quantity: item.quantity,
//           price: item.price,
//         },
//       }),
//     ),
//   );

//   return {
//     ...order,
//     order_items: createdOrderItems,
//   };
// }

// async getUserOrders(userId: number): Promise<any> {
//   return this.prisma.order.findMany({
//     where: { user_id: userId },
//     include: {
//       OrderItems: {
//         include: {
//           Product: true,
//         },
//       },
//     },
//   });
}

 
