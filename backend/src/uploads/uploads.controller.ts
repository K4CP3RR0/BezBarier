import {
  BadRequestException,
  Controller,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@thallesp/nestjs-better-auth';
import { memoryStorage } from 'multer';
import { UploadsService } from './uploads.service.js';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploads: UploadsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 15 * 1024 * 1024 },
    }),
  )
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('kind') kindRaw?: string,
  ) {
    if (!file) {
      throw new BadRequestException('file is required');
    }
    const kind = kindRaw === 'audio' ? 'audio' : 'photo';
    return this.uploads.save(file, kind);
  }
}
