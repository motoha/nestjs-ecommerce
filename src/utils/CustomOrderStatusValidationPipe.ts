import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderStatusValidationPipe implements PipeTransform<string, OrderStatus> {
  readonly allowedStatuses = Object.values(OrderStatus);

  transform(value: any, metadata: ArgumentMetadata): OrderStatus {
    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`"${value}" is an invalid status`);
    }
    return value as OrderStatus;
  }

  private isStatusValid(status: any): boolean {
    return this.allowedStatuses.includes(status);
  }
}