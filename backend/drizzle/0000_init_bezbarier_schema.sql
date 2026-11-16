CREATE TYPE "public"."barrier_source" AS ENUM('VOICE', 'MANUAL', 'PHOTO');--> statement-breakpoint
CREATE TYPE "public"."barrier_verification_action" AS ENUM('CONFIRM', 'DENY', 'RESOLVED');--> statement-breakpoint
CREATE TABLE "account" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"accountId" varchar(255) NOT NULL,
	"providerId" varchar(64) NOT NULL,
	"userId" varchar(36) NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp with time zone,
	"refreshTokenExpiresAt" timestamp with time zone,
	"scope" text,
	"password" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "barrier_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(64) NOT NULL,
	"name" varchar(120) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "barrier_categories_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "barrier_statuses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(64) NOT NULL,
	"name" varchar(120) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "barrier_statuses_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "barrier_verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"barrier_id" uuid NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"action" "barrier_verification_action" NOT NULL,
	"photo_storage_key" varchar(512),
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "barriers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"status_id" uuid NOT NULL,
	"reported_by_user_id" varchar(36) NOT NULL,
	"description" text NOT NULL,
	"location" geography(Point,4326) NOT NULL,
	"gps_accuracy_m" numeric(6, 2),
	"source" "barrier_source" DEFAULT 'VOICE' NOT NULL,
	"is_temporary" boolean DEFAULT false NOT NULL,
	"expires_at" timestamp with time zone,
	"confirmed_at" timestamp with time zone,
	"deactivated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(32) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "roles_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"token" varchar(255) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"ipAddress" varchar(64),
	"userAgent" text,
	"userId" varchar(36) NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"emailVerified" boolean DEFAULT false NOT NULL,
	"image" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_accessibility_profiles" (
	"user_id" varchar(36) PRIMARY KEY NOT NULL,
	"max_curb_height_cm" smallint,
	"max_slope_percent" numeric(4, 1),
	"avoid_silent_crossings" boolean DEFAULT false NOT NULL,
	"prefer_tactile_paving" boolean DEFAULT false NOT NULL,
	"notes" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"user_id" varchar(36) NOT NULL,
	"role_id" uuid NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_roles_user_id_role_id_pk" PRIMARY KEY("user_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"identifier" varchar(255) NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "voice_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"barrier_id" uuid NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"transcription_text" text NOT NULL,
	"raw_transcript" text,
	"audio_storage_key" varchar(512),
	"location" geography(Point,4326),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barrier_verifications" ADD CONSTRAINT "barrier_verifications_barrier_id_barriers_id_fk" FOREIGN KEY ("barrier_id") REFERENCES "public"."barriers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barrier_verifications" ADD CONSTRAINT "barrier_verifications_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barriers" ADD CONSTRAINT "barriers_category_id_barrier_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."barrier_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barriers" ADD CONSTRAINT "barriers_status_id_barrier_statuses_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."barrier_statuses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barriers" ADD CONSTRAINT "barriers_reported_by_user_id_user_id_fk" FOREIGN KEY ("reported_by_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_accessibility_profiles" ADD CONSTRAINT "user_accessibility_profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voice_notes" ADD CONSTRAINT "voice_notes_barrier_id_barriers_id_fk" FOREIGN KEY ("barrier_id") REFERENCES "public"."barriers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voice_notes" ADD CONSTRAINT "voice_notes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "account_provider_account_uidx" ON "account" USING btree ("providerId","accountId");--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX "barrier_verifications_barrier_user_action_uidx" ON "barrier_verifications" USING btree ("barrier_id","user_id","action");--> statement-breakpoint
CREATE INDEX "barriers_category_id_idx" ON "barriers" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "barriers_status_id_idx" ON "barriers" USING btree ("status_id");--> statement-breakpoint
CREATE INDEX "barriers_reported_by_user_id_idx" ON "barriers" USING btree ("reported_by_user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "voice_notes_barrier_id_idx" ON "voice_notes" USING btree ("barrier_id");--> statement-breakpoint
CREATE INDEX "voice_notes_user_id_idx" ON "voice_notes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "barriers_location_gix" ON "barriers" USING gist ("location");--> statement-breakpoint
CREATE INDEX "voice_notes_location_gix" ON "voice_notes" USING gist ("location");--> statement-breakpoint
CREATE UNIQUE INDEX "user_roles_one_primary_per_user_uidx" ON "user_roles" ("user_id") WHERE "is_primary" = true;--> statement-breakpoint
ALTER TABLE "barriers" ADD CONSTRAINT "barriers_temporary_requires_expires_at" CHECK ("is_temporary" = false OR "expires_at" IS NOT NULL);