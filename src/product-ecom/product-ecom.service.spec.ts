import { Test, TestingModule } from '@nestjs/testing';
import { ProductEcomService } from './product-ecom.service';

describe('ProductEcomService', () => {
  let service: ProductEcomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductEcomService],
    }).compile();

    service = module.get<ProductEcomService>(ProductEcomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
