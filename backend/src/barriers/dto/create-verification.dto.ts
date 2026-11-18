import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateVerificationDto {
  @IsIn(['CONFIRM', 'DENY', 'RESOLVED'])
  action!: 'CONFIRM' | 'DENY' | 'RESOLVED';

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(512)
  photoStorageKey?: string | null;
}
