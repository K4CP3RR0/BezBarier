import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { auth } from './auth/auth.js';
import { BarriersModule } from './barriers/barriers.module.js';
import { DatabaseModule } from './database/database.module.js';
import { UploadsModule } from './uploads/uploads.module.js';
import { VoiceNotesModule } from './voice-notes/voice-notes.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule.forRoot({
      auth,
      disableGlobalAuthGuard: true,
      disableTrustedOriginsCors: true,
    }),
    DatabaseModule,
    BarriersModule,
    UsersModule,
    UploadsModule,
    VoiceNotesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}