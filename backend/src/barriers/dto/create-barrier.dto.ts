import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateBarrierDto {
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  categoryCode!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(2000)
  description!: string;

  @Type(() => Number)
  @IsNumber()
  lat!: number;

  @Type(() => Number)
  @IsNumber()
  lng!: number;

  @IsOptional()
  @IsIn(['VOICE', 'MANUAL', 'PHOTO'])
  source?: 'VOICE' | 'MANUAL' | 'PHOTO';

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isTemporary?: boolean;

  @IsOptional()
  @IsString()
  expiresAt?: string | null;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  gpsAccuracyM?: number | null;
}
