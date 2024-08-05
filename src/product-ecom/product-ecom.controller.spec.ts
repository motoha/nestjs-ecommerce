import { Test, TestingModule } from '@nestjs/testing';
import { ProductEcomController } from './product-ecom.controller';

describe('ProductEcomController', () => {
  let controller: ProductEcomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductEcomController],
    }).compile();

    controller = module.get<ProductEcomController>(ProductEcomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
