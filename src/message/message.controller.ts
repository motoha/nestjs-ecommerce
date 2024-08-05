import {
  Controller,
  Body,
  Post,
  Get,
  Req,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { AddMessageDto } from './dtos/message.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('message')
@UseGuards(AuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async addMessage(@Body() body: AddMessageDto, @Req() req: Request) {
    return await this.messageService.addMessage({
      ...body,
      buyer_id: req.user.user,
    });
  }

  @Get('property/:id')
  async getAllMessages(@Param('id') id: ParseIntPipe) {
    return await this.messageService.getMessagesForProperty(Number(id));
  }
}
