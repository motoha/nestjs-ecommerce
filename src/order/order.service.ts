import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/CreateOrderItemDto';
import { CreateOrderDto } from './dto/CreateOrderDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateOrderDto } from './dto/UpdateOrderDto';
import { Order, OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<any> {
    const { user_id, order_date, status, total_amount, orderItems } = createOrderDto;

    // Validate that all product_ids exist
    for (const item of orderItems) {
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
      orderItems.map((item: CreateOrderItemDto) =>
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

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: { user_id: userId },
      include: {
        OrderItems: true,
        Payments: true,
      },
    });
  }

  async getOrderById(orderId: number): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { order_id: orderId },
      include: {
        OrderItems: true,
        Payments: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return order;
  }
  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: { status },
      include: {
        OrderItems: true,
        Payments: true,
      },
    });
  }

  async findOrdersByStatusId(statusId: number): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: {
        status_id: statusId,
      },
      include: {
        User: true,
   


        OrderItems: true,
        Payments: true,
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


async createOrderx(createOrderDto: CreateOrderDto) {
  const { user_id, order_date, status, status_id, total_amount, orderItems, payment } = createOrderDto;

  // Validate product IDs
  const productIds = orderItems.map(item => item.product_id);
  const products = await this.prisma.productEcom.findMany({
    where: {
      product_id: {
        in: productIds,
      },
    },
  });

  if (products.length !== productIds.length) {
    const invalidProductIds = productIds.filter(id => !products.some(product => product.product_id === id));
    throw new NotFoundException(`Invalid product IDs: ${invalidProductIds.join(', ')}`);
  }

  const order = await this.prisma.order.create({
    data: {
      user_id,
      order_date,
      status,
      status_id,
      total_amount,
      OrderItems: {
        create: orderItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: {
      OrderItems: true,
    },
  });

  if (payment) {
    await this.prisma.payment.create({
      data: {
        order_id: order.order_id,
        payment_date: payment.payment_date,
        amount: payment.amount,
        payment_method: payment.payment_method,
        status: payment.status,
      },
    });
  }

  return order;
}
}

 
