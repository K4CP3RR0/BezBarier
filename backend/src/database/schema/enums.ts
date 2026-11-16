import { pgEnum } from 'drizzle-orm/pg-core';

export const barrierSourceEnum = pgEnum('barrier_source', [
  'VOICE',
  'MANUAL',
  'PHOTO',
]);

export const barrierVerificationActionEnum = pgEnum(
  'barrier_verification_action',
  ['CONFIRM', 'DENY', 'RESOLVED'],
);
