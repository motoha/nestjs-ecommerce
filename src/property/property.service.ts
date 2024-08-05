import { HttpStatus, Injectable } from '@nestjs/common';
import { PropertyType } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiError } from 'src/utils/apiError';

interface IProperty {
  type: PropertyType;
  area: number;
  price: number;
  bedrooms: number;
  bathrooms: number;
  city: string;
  address: string;
  realtor_id: number;
  images: string[];
}

export const propertyFields = {
  id: true,
  type: true,
  area: true,
  bedrooms: true,
  bathrooms: true,
  city: true,
  address: true,
  price: true,
  realtor_id: true,
  createdAt: true,
  images: {
    select: {
      url: true,
    },
    take: 1,
  },
};

@Injectable()
export class PropertyService {
  constructor(private readonly prismaService: PrismaService) {}

  async addProperty(body: IProperty ) {
    const { images, ...others } = body;
    const property = await this.prismaService.property.create({
      data: others,
    });
    const data = images.map((item) => ({
      url: item,
      
      property_id: property.id,
      
    }));
    await this.prismaService.image.createMany({
      data,
    });
    return { message: 'Property added successfully' };
  }

  async getAllProperties(query) {
    return await this.prismaService.property.findMany({
      where: {
        city: query.city,
        type: query.type,
        price: {
          ...(query.minPrice && { gte: Number(query.minPrice) }),
          ...(query.maxPrice && { lte: Number(query.maxPrice) }),
        },
      },
      select: propertyFields,
    });
  }

  async getSingleProperty(id: number) {
    const result = await this.prismaService.property.findUnique({
      where: {
        id,
      },
      select: propertyFields,
    });

    if (!result) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Property not found');
    }
    return result;
  }

  async updateProperty(id: number, body: Partial<Omit<IProperty, 'images'>>) {
    try {
      await this.prismaService.property.update({
        where: {
          id,
        },
        data: body,
      });
      return { message: 'updated successfully' };
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new ApiError(HttpStatus.BAD_REQUEST, 'Property not found');
      }
      throw err;
    }
  }

  async deleteProperty(id: number) {
    try {
      await this.prismaService.property.delete({
        where: {
          id,
        },
      });
      return { message: 'deleted successfully' };
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new ApiError(HttpStatus.BAD_REQUEST, 'Property not found');
      }
      throw err;
    }
  }

  async getRealtorDetails(id: number, user: number) {
    const result = await this.prismaService.property.findUnique({
      where: {
        id,
        realtor_id: user,
      },
      select: {
        id: true,
        type: true,
        // realtor: {
        //   select: {
        //     name: true,
        //     email: true,
        //     type: true,
        //   },
        // },
      },
    });

    if (!result) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Property not found');
    }
    return result;
  }
}
