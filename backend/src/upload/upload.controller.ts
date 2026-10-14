import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { UploadService } from './upload.service';

const uploadDirectory = './uploads';
if (!existsSync(uploadDirectory)) {
  mkdirSync(uploadDirectory, { recursive: true });
}

const storageConfig = diskStorage({
  destination: uploadDirectory,
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

@ApiTags('File Storage & Uploads')
@Controller('api/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('file')
  @ApiOperation({ summary: 'Upload a single file/image' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', { storage: storageConfig, limits: { fileSize: 10 * 1024 * 1024 } }))
  uploadSingle(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return {
      success: true,
      url: this.uploadService.formatFileUrl(file),
      filename: file.filename,
    };
  }

  @Post('files')
  @ApiOperation({ summary: 'Upload multiple files/images' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 5, { storage: storageConfig, limits: { fileSize: 10 * 1024 * 1024 } }))
  uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one file is required');
    }
    return {
      success: true,
      urls: files.map((f) => this.uploadService.formatFileUrl(f)),
    };
  }
}
