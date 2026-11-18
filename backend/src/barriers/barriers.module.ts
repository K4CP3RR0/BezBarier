import { Module } from '@nestjs/common';
import { BarriersController } from './barriers.controller.js';
import { BarriersService } from './barriers.service.js';

@Module({
  controllers: [BarriersController],
  providers: [BarriersService],
  exports: [BarriersService],
})
export class BarriersModule {}