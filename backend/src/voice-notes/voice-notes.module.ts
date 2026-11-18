import { Module } from '@nestjs/common';
import { BarriersModule } from '../barriers/barriers.module.js';
import { VoiceNotesController } from './voice-notes.controller.js';
import { VoiceNotesService } from './voice-notes.service.js';

@Module({
  imports: [BarriersModule],
  controllers: [VoiceNotesController],
  providers: [VoiceNotesService],
})
export class VoiceNotesModule {}
