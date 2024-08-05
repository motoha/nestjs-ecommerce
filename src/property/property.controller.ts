import {
  Req,
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { PropertyService } from './property.service';
import { AuthGuard } from 'src/guards/auth.guard';
import {
  AddPropertyDto,
  PropertyResponseDto,
  UpdatePropertyDto,
} from './dtos/property.dto';
import { PropertyType } from '@prisma/client';
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import { extname } from 'path';
interface IQuery {
  type?: PropertyType;
  city?: string;
  minPrice?: ParseIntPipe;
  maxPrice?: ParseIntPipe;
}

@Controller('property')
@UseGuards(AuthGuard)
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))


  async addProperty(@Req() req: Request, @Body() body: AddPropertyDto  ) {
    return await this.propertyService.addProperty({
      ...body,
    
      realtor_id: req.user.user,
    });
  }

  @Post('/post-upload')
  @UseInterceptors(FileInterceptor('file' , {
    storage : diskStorage({
      destination : "./uploads",
      filename : (req , file , cb) => {
        cb(null , `${file.originalname}`)
      }
    })
  }))
  async createProperty(
    @Req() req: Request,
    
    @UploadedFile() file: Express.Multer.File,
    @Body() data: AddPropertyDto ,
  ) {
    return await this.propertyService.addProperty({
      ...data,
      images : [file.filename],
      realtor_id:req.user.user,
    });
  }
  
@Post('/upload')
@UseInterceptors(FileInterceptor('images', {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const filename = `${uniqueSuffix}${ext}`;
      callback(null, filename);
    },
  }),
}))
async uploadNews(@Req() req: Request, @Body() body: AddPropertyDto, @UploadedFile() file) {
  return await this.propertyService.addProperty({
    ...body,
    
    realtor_id: req.user.user,
  });
}


  @Get()
  async getAllProperties(
    @Query() query: IQuery,
  ): Promise<PropertyResponseDto[]> {
    const result = await this.propertyService.getAllProperties(query);
    return result.map((property) => new PropertyResponseDto(property));
  }

  @Get(':id')
  async getPropertyById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PropertyResponseDto> {
    const result = await this.propertyService.getSingleProperty(id);
    return new PropertyResponseDto(result);
  }

  @Put(':id')
  async updatePropertyById(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePropertyDto,
  ) {
    return await this.propertyService.updateProperty(id, body);
  }

  @Delete(':id')
  async deletePropertyById(@Param('id', ParseIntPipe) id: number) {
    return await this.propertyService.deleteProperty(id);
  }

  @Get('realtor/:id')
  async getRelatorByProperty(
    @Req() req: Request,
    @Param('id') id: ParseIntPipe,
  ) {
    return await this.propertyService.getRealtorDetails(
      Number(id),
      req.user.user,
    );
  }
}
