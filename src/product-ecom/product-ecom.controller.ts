import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    UseInterceptors,
    UploadedFile,
    Delete,
    UseGuards,
    Query,
    ParseIntPipe,
    UploadedFiles,
    Put,
    
  } from '@nestjs/common';
import { ProductEcomService } from './product-ecom.service';
import { Prisma } from '@prisma/client';
import { UpdateProductEcomDto } from './dto/update-product-ecom.dto';
import { CreateProductEcomDto } from './dto/product-ecom';
import { AuthGuard } from 'src/guards/auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/utils/multer-config';
 

@Controller('product')
@UseGuards(AuthGuard)
export class ProductEcomController {
  constructor(private readonly productEcomService: ProductEcomService) {}

  @Post()
  create(@Body() createProductEcomDto: CreateProductEcomDto) {
    return this.productEcomService.create(createProductEcomDto);
  }

  @Get()
  findAll() {
    return this.productEcomService.findAll();
  }

  @Get("/paging")
  async findAllPaging(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;
    const take = pageSize;

    return this.productEcomService.findAllPaging(skip, take);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.productEcomService.findOne(+id);
  // }
  @Get(':id')
  async getProduct(@Param('id', ParseIntPipe) productId: number) {
    return this.productEcomService.getProduct(productId);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductEcomDto: UpdateProductEcomDto) {
    return this.productEcomService.update(+id, updateProductEcomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productEcomService.remove(+id);
  }

  @Post(':id/images')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadProductImage(
    @Param('id', ParseIntPipe) productId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imageUrl = `/uploads/${file.filename}`;
    const productImageData: Prisma.ProductImageCreateInput = {
      image_url: imageUrl,
      Product: {
        connect: {
          product_id: productId,
        },
      },
    };
    return this.productEcomService.createProductImage(productImageData);
  }

  @Post('/images')
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  async createProductWithImages(
    @Body() createProductDto: CreateProductEcomDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productEcomService.createProductWithImages(createProductDto, files);
  }
  @Put('/:id/images')
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  async updateProductWithImages(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductEcomDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productEcomService.updateProductWithImages(parseInt(id), updateProductDto, files);
  }
}

// use case

// const axios = require('axios');
// const FormData = require('form-data');
// const fs = require('fs');

// async function updateProduct() {
//   const form = new FormData();

//   // Add other form fields
//   form.append('name', 'Updated Product');
//   form.append('price', 29.99);
//   form.append('stock_quantity', 50);

//   // Add files
//   const files = ['path/to/file1.jpg', 'path/to/file2.jpg']; // Array of file paths
//   files.forEach((file, index) => {
//     form.append('files', fs.createReadStream(file), `file${index}.jpg`);
//   });

//   try {
//     const response = await axios.put('http://your-api-endpoint/products/1/images', form, {
//       headers: form.getHeaders(),
//     });
//     console.log('Response:', response.data);
//   } catch (error) {
//     console.error('Error:', error.response ? error.response.data : error.message);
//   }
// }

// updateProduct();

//flutter

// Future<void> updateProduct(int productId, String name, double price, int stockQuantity, List<File> files) async {
//   try {
//     final dio = Dio();
//     final formData = FormData();

//     // Add other form fields
//     formData.fields.add(MapEntry('name', name));
//     formData.fields.add(MapEntry('price', price.toString()));
//     formData.fields.add(MapEntry('stock_quantity', stockQuantity.toString()));

//     // Add files
//     for (var file in files) {
//       formData.files.add(MapEntry(
//         'files',
//         await MultipartFile.fromFile(file.path, filename: file.path.split('/').last),
//       ));
//     }

//     final response = await dio.put(
//       'http://your-api-endpoint/products/$productId/images',
//       data: formData,
//     );

//     print('Response: ${response.data}');
//   } catch (e) {
//     print('Error: $e');
//   }
// }

// //page

// class MyHomePage extends StatefulWidget {
//   @override
//   _MyHomePageState createState() => _MyHomePageState();
// }

// class _MyHomePageState extends State<MyHomePage> {
//   List<File> files = [];

//   void _selectFiles() async {
//     FilePickerResult? result = await FilePicker.platform.pickFiles(allowMultiple: true);
//     if (result != null) {
//       setState(() {
//         files = result.files.map((file) => File(file.path!)).toList();
//       });
//     }
//   }

//   void _updateProduct() async {
//     await updateProduct(1, 'Updated Product', 29.99, 50, files);
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: Text('Update Product'),
//       ),
//       body: Center(
//         child: Column(
//           mainAxisAlignment: MainAxisAlignment.center,
//           children: <Widget>[
//             ElevatedButton(
//               onPressed: _selectFiles,
//               child: Text('Select Files'),
//             ),
//             ElevatedButton(
//               onPressed: _updateProduct,
//               child: Text('Update Product'),
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }
