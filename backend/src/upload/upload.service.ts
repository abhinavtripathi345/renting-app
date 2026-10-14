import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  formatFileUrl(file: Express.Multer.File): string {
    const baseUrl = process.env.STORAGE_BASE_URL || 'http://localhost:4000/uploads';
    return `${baseUrl}/${file.filename}`;
  }
}
