import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiError } from 'src/utils/apiError';

interface IBody {
  message: string;
  property_id: number;
  buyer_id: number;
}
@Injectable()
export class MessageService {
  constructor(private readonly prismaService: PrismaService) {}

  async addMessage(body: IBody) {
    const foundProperty = await this.prismaService.property.findUnique({
      where: {
        id: body.property_id,
      },
      select: {
        realtor_id: true,
      },
    });
    if (!foundProperty) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Property not found');
    }
    await this.prismaService.message.create({
      data: { ...body, realtor_id: foundProperty.realtor_id },
    });

    return { message: 'message created successfully' };
  }

  async getMessagesForProperty(id: number) {
    return await this.prismaService.message.findMany({
      where: {
        property_id: id,
      },
      select: {
        id: true,
        message: true,
        property: {
          select: {
            id: true,
            type: true,
            city: true,
          },
        },
        // buyer: {
        //   select: {
        //     id: true,
        //     name: true,
        //     email: true,
        //   },
        // },
      },
    });
  }
}
