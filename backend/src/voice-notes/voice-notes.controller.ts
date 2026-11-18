import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  AuthGuard,
  Session,
  type UserSession,
} from '@thallesp/nestjs-better-auth';
import { CreateVoiceNoteDto } from './dto/create-voice-note.dto.js';
import { VoiceNotesService } from './voice-notes.service.js';

@Controller()
export class VoiceNotesController {
  constructor(private readonly voiceNotes: VoiceNotesService) {}

  @Get('barriers/:id/voice-notes')
  list(@Param('id') id: string) {
    return this.voiceNotes.listByBarrier(id);
  }

  @Post('barriers/:id/voice-notes')
  @UseGuards(AuthGuard)
  create(
    @Param('id') id: string,
    @Session() session: UserSession,
    @Body() body: CreateVoiceNoteDto,
  ) {
    return this.voiceNotes.create({
      barrierId: id,
      userId: session.user.id,
      ...body,
    });
  }
}
