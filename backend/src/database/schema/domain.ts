import {
  boolean,
  index,
  numeric,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { user } from './auth.js';
import {
  barrierSourceEnum,
  barrierVerificationActionEnum,
} from './enums.js';
import { geographyPoint } from './types.js';

export const roles = pgTable('roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 32 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
});

export const userRoles = pgTable(
  'user_roles',
  {
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
    isPrimary: boolean('is_primary').notNull().default(false),
    assignedAt: timestamp('assigned_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.roleId] })],
);

export const userAccessibilityProfiles = pgTable(
  'user_accessibility_profiles',
  {
    userId: varchar('user_id', { length: 36 })
      .primaryKey()
      .references(() => user.id, { onDelete: 'cascade' }),
    maxCurbHeightCm: smallint('max_curb_height_cm'),
    maxSlopePercent: numeric('max_slope_percent', { precision: 4, scale: 1 }),
    avoidSilentCrossings: boolean('avoid_silent_crossings')
      .notNull()
      .default(false),
    preferTactilePaving: boolean('prefer_tactile_paving')
      .notNull()
      .default(false),
    notes: text('notes'),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
  },
);

export const barrierCategories = pgTable('barrier_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 64 }).notNull().unique(),
  name: varchar('name', { length: 120 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
});

export const barrierStatuses = pgTable('barrier_statuses', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 64 }).notNull().unique(),
  name: varchar('name', { length: 120 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
});

export const barriers = pgTable(
  'barriers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    categoryId: uuid('category_id')
      .notNull()
      .references(() => barrierCategories.id),
    statusId: uuid('status_id')
      .notNull()
      .references(() => barrierStatuses.id),
    reportedByUserId: varchar('reported_by_user_id', { length: 36 })
      .notNull()
      .references(() => user.id),
    description: text('description').notNull(),
    location: geographyPoint('location').notNull(),
    gpsAccuracyM: numeric('gps_accuracy_m', { precision: 6, scale: 2 }),
    source: barrierSourceEnum('source').notNull().default('VOICE'),
    isTemporary: boolean('is_temporary').notNull().default(false),
    expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }),
    confirmedAt: timestamp('confirmed_at', {
      withTimezone: true,
      mode: 'date',
    }),
    deactivatedAt: timestamp('deactivated_at', {
      withTimezone: true,
      mode: 'date',
    }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('barriers_category_id_idx').on(t.categoryId),
    index('barriers_status_id_idx').on(t.statusId),
    index('barriers_reported_by_user_id_idx').on(t.reportedByUserId),
  ],
);

export const voiceNotes = pgTable(
  'voice_notes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    barrierId: uuid('barrier_id')
      .notNull()
      .references(() => barriers.id, { onDelete: 'cascade' }),
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => user.id),
    transcriptionText: text('transcription_text').notNull(),
    rawTranscript: text('raw_transcript'),
    audioStorageKey: varchar('audio_storage_key', { length: 512 }),
    location: geographyPoint('location'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index('voice_notes_barrier_id_idx').on(t.barrierId),
    index('voice_notes_user_id_idx').on(t.userId),
  ],
);

export const barrierVerifications = pgTable(
  'barrier_verifications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    barrierId: uuid('barrier_id')
      .notNull()
      .references(() => barriers.id, { onDelete: 'cascade' }),
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => user.id),
    action: barrierVerificationActionEnum('action').notNull(),
    photoStorageKey: varchar('photo_storage_key', { length: 512 }),
    note: text('note'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex('barrier_verifications_barrier_user_action_uidx').on(
      t.barrierId,
      t.userId,
      t.action,
    ),
  ],
);
