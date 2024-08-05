import { Test, TestingModule } from '@nestjs/testing';
import { PropertyService, propertyFields } from './property.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PropertyType } from '@prisma/client';
import { ApiError } from 'src/utils/apiError';

const propertyMockData = [
  {
    id: 4,
    type: 'RESIDENTIAL',
    area: 200,
    bedrooms: 4,
    bathrooms: 4,
    city: 'Greeland',
    address: 'Jupiter',
    price: 320,
    createdAt: '2023-08-13T06:52:18.322Z',
    realtor: 2,
    images: [
      {
        url: 'image1',
      },
      {
        url: 'image2',
      },
    ],
  },
];

const addPropertyMockData = {
  id: 4,
  type: 'RESIDENTIAL',
  area: 200,
  bedrooms: 4,
  bathrooms: 4,
  city: 'Greeland',
  address: 'Jupiter',
  price: 320,
  createdAt: '2023-08-13T06:52:18.322Z',
  realtor: 2,
};

const imageMockData = [
  {
    url: 'image1',
    property_id: 4,
  },
  {
    url: 'image2',
    property_id: 4,
  },
];

const filters = {
  type: PropertyType.RESIDENTIAL,
  city: 'New York',
  minPrice: 1,
  maxPrice: 2000000,
};

describe('PropertyService', () => {
  let service: PropertyService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertyService,
        {
          provide: PrismaService,
          useValue: {
            property: {
              findMany: jest.fn().mockReturnValue(propertyMockData),
              findUnique: jest.fn(),
              create: jest.fn().mockReturnValue(addPropertyMockData),
            },
            image: {
              createMany: jest.fn().mockReturnValue(imageMockData),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PropertyService>(PropertyService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProperties', () => {
    it('should call prisma property.findMany with correct params', async () => {
      const mockData = jest.fn().mockReturnValue(propertyMockData);

      jest
        .spyOn(prismaService.property, 'findMany')
        .mockImplementation(mockData);

      await service.getAllProperties(filters);

      expect(mockData).toBeCalledWith({
        select: propertyFields,
        where: {
          type: filters.type,
          city: filters.city,
          price: {
            gte: filters.minPrice,
            lte: filters.maxPrice,
          },
        },
      });
    });

    it('should throw bad request error with message: not found', async () => {
      const mockData = jest.fn().mockReturnValue(null);

      jest
        .spyOn(prismaService.property, 'findUnique')
        .mockImplementation(mockData);

      await expect(service.getSingleProperty(112)).rejects.toThrowError(
        ApiError,
      );
    });
  });

  describe('addProperty', () => {
    const createPropertyParams = {
      type: PropertyType.RESIDENTIAL,
      area: 200,
      bedrooms: 4,
      bathrooms: 4,
      city: 'Greeland',
      address: 'Jupiter',
      price: 320,
      realtor_id: 2,
      images: ['image1', 'image2'],
    };
    it('should add a new property', async () => {
      const mockData = jest.fn().mockReturnValue(addPropertyMockData);

      jest.spyOn(prismaService.property, 'create').mockImplementation(mockData);

      await service.addProperty(createPropertyParams);

      expect(mockData).toBeCalledWith({
        data: {
          type: 'RESIDENTIAL',
          area: 200,
          bedrooms: 4,
          bathrooms: 4,
          city: 'Greeland',
          address: 'Jupiter',
          price: 320,
          realtor_id: 2,
        },
      });
    });

    it('should add images using createMany', async () => {
      const mockData = jest.fn().mockReturnValue(imageMockData);

      jest
        .spyOn(prismaService.image, 'createMany')
        .mockImplementation(mockData);

      await service.addProperty(createPropertyParams);

      expect(mockData).toBeCalledWith({
        data: imageMockData,
      });
    });
  });
});
