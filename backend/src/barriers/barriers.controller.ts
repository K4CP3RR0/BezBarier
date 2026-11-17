import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  AuthGuard,
  Session,
  type UserSession,
} from '@thallesp/nestjs-better-auth';
import { BarriersService } from './barriers.service.js';

@Controller()
export class BarriersController {
  constructor(private readonly barriers: BarriersService) {}

  @Get('meta/categories')
  categories() {
    return this.barriers.listCategories();
  }

  @Get('meta/statuses')
  statuses() {
    return this.barriers.listStatuses();
  }

  @Get('barriers')
  list(
    @Query('lat') latRaw?: string,
    @Query('lng') lngRaw?: string,
    @Query('radiusMeters') radiusRaw?: string,
  ) {
    return this.barriers.listNearby(
      Number(latRaw),
      Number(lngRaw),
      radiusRaw ? Number(radiusRaw) : 500,
    );
  }

  @Get('barriers/:id')
  getOne(@Param('id') id: string) {
    return this.barriers.getById(id);
  }

  @Post('barriers')
  @UseGuards(AuthGuard)
  create(
    @Session() session: UserSession,
    @Body()
    body: {
      categoryCode: string;
      description: string;
      lat: number;
      lng: number;
      source?: 'VOICE' | 'MANUAL' | 'PHOTO';
      isTemporary?: boolean;
      expiresAt?: string | null;
      gpsAccuracyM?: number | null;
    },
  ) {
    return this.barriers.create({
      ...body,
      userId: session.user.id,
    });
  }

  @Get('barriers/:id/verifications')
  listVerifications(@Param('id') id: string) {
    return this.barriers.listVerifications(id);
  }

  @Post('barriers/:id/verifications')
  @UseGuards(AuthGuard)
  createVerification(
    @Param('id') id: string,
    @Session() session: UserSession,
    @Body()
    body: {
      action: 'CONFIRM' | 'DENY' | 'RESOLVED';
      note?: string | null;
      photoStorageKey?: string | null;
    },
  ) {
    return this.barriers.createVerification({
      barrierId: id,
      userId: session.user.id,
      ...body,
    });
  }
}