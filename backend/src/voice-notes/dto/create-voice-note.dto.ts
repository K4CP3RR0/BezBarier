import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateVoiceNoteDto {
  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  transcriptionText!: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  rawTranscript?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(512)
  audioStorageKey?: string | null;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lat?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lng?: number | null;
}
