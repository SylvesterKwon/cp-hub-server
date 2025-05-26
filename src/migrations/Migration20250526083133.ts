import { Migration } from '@mikro-orm/migrations';

export class Migration20250526083133 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "contest" ("id" varchar(11) not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "name" varchar(255) not null, "type" text check ("type" in ('CF', 'IOI', 'KOI', 'JOI', 'ICPC', 'BOJ', 'USACO', 'ATCODER', 'UNKNOWN')) not null, "detailed_type" text check ("detailed_type" in ('CF_DIV1', 'CF_DIV2', 'CF_DIV3', 'CF_DIV4', 'CF_DIV1_DIV2', 'CF_EDU', 'CF_GLOBAL', 'CF_KOTLIN_HEROS', 'CF_Q_SHARP', 'CF_ETC', 'ATCODER_ABC', 'ATCODER_ARC', 'ATCODER_AGC', 'ATCODER_ETC')) null, "platform_contest_id" varchar(255) null, "started_at" timestamptz null, "duration_seconds" bigint null, "denormalized_info" jsonb not null, constraint "contest_pkey" primary key ("id"));`);

    this.addSql(`create table "permission" ("id" varchar(255) not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "name" varchar(255) not null, "description" varchar(255) null, constraint "permission_pkey" primary key ("id"));`);
    this.addSql(`alter table "permission" add constraint "permission_name_unique" unique ("name");`);

    this.addSql(`create table "problem" ("id" varchar(11) not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "name" varchar(255) not null, "available_online_judges" jsonb not null, "additional_info" jsonb not null default '{"exponentialDecayScoreCachedValueUpdatedAt":null}', "denormalized_info" jsonb not null, constraint "problem_pkey" primary key ("id"));`);

    this.addSql(`create table "contest_problems" ("contest_id" varchar(11) not null, "problem_id" varchar(11) not null, "index" varchar(255) null, constraint "contest_problems_pkey" primary key ("contest_id", "problem_id"));`);

    this.addSql(`create table "reference" ("id" varchar(255) not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "source_type" text check ("source_type" in ('comment', 'editorial')) not null, "source_id" varchar(255) not null, "target_type" text check ("target_type" in ('problem', 'editorial', 'contest', 'user')) not null, "target_id" varchar(255) not null, "denormalized_info" jsonb not null, constraint "reference_pkey" primary key ("id"));`);
    this.addSql(`create index "reference_source_id_index" on "reference" ("source_id");`);
    this.addSql(`create index "reference_target_id_index" on "reference" ("target_id");`);

    this.addSql(`create table "role" ("id" varchar(255) not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "name" varchar(255) not null, "description" varchar(255) null, constraint "role_pkey" primary key ("id"));`);
    this.addSql(`alter table "role" add constraint "role_name_unique" unique ("name");`);

    this.addSql(`create table "role_permissions" ("role_id" varchar(255) not null, "permission_id" varchar(255) not null, constraint "role_permissions_pkey" primary key ("role_id", "permission_id"));`);

    this.addSql(`create table "tag" ("id" varchar(255) not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "name" varchar(255) not null, constraint "tag_pkey" primary key ("id"));`);
    this.addSql(`alter table "tag" add constraint "tag_name_unique" unique ("name");`);

    this.addSql(`create table "problem_tags" ("problem_id" varchar(11) not null, "tag_id" varchar(255) not null, constraint "problem_tags_pkey" primary key ("problem_id", "tag_id"));`);

    this.addSql(`create table "user" ("id" varchar(255) not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "username" varchar(255) not null, "email" varchar(255) not null, "profile_picture_url" varchar(255) null, "hashed_password" varchar(255) not null, "role_id" varchar(255) null, "external_platform_ids" jsonb null, "biography" text null, "denormalized_info" jsonb not null, constraint "user_pkey" primary key ("id"));`);
    this.addSql(`alter table "user" add constraint "user_username_unique" unique ("username");`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);

    this.addSql(`create table "editorial" ("id" varchar(11) not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "problem_id" varchar(11) not null, "author_id" varchar(255) not null, "content" text not null, "denormalized_info" jsonb not null, constraint "editorial_pkey" primary key ("id"));`);
    this.addSql(`  CREATE INDEX denormalized_info_wilson_score_interval_lower_bound_float ON editorial (((denormalized_info->'wilsonScoreInterval'->'lowerBound')::float));`);
    this.addSql(`  ;`);

    this.addSql(`create table "editorial_votes" ("id" varchar(255) not null, "editorial_id" varchar(11) not null, "user_id" varchar(255) not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "type" text check ("type" in ('upvote', 'downvote')) not null, constraint "editorial_votes_pkey" primary key ("id", "editorial_id", "user_id"));`);

    this.addSql(`create table "comment" ("id" varchar(255) not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "context_id" jsonb not null, "is_deleted" boolean not null default false, "author_id" varchar(255) not null, "parent_comment_id" varchar(255) null, "depth" int not null, "content" text null, constraint "comment_pkey" primary key ("id"));`);
    this.addSql(`create index "comment_context_id_type_context_id_id_index" on "comment" (("context_id"->>'type'), ("context_id"->>'id'));`);

    this.addSql(`alter table "contest_problems" add constraint "contest_problems_contest_id_foreign" foreign key ("contest_id") references "contest" ("id") on update cascade;`);
    this.addSql(`alter table "contest_problems" add constraint "contest_problems_problem_id_foreign" foreign key ("problem_id") references "problem" ("id") on update cascade;`);

    this.addSql(`alter table "role_permissions" add constraint "role_permissions_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "role_permissions" add constraint "role_permissions_permission_id_foreign" foreign key ("permission_id") references "permission" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "problem_tags" add constraint "problem_tags_problem_id_foreign" foreign key ("problem_id") references "problem" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "problem_tags" add constraint "problem_tags_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "user" add constraint "user_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "editorial" add constraint "editorial_problem_id_foreign" foreign key ("problem_id") references "problem" ("id") on update cascade;`);
    this.addSql(`alter table "editorial" add constraint "editorial_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "editorial_votes" add constraint "editorial_votes_editorial_id_foreign" foreign key ("editorial_id") references "editorial" ("id") on update cascade;`);
    this.addSql(`alter table "editorial_votes" add constraint "editorial_votes_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "comment" add constraint "comment_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "comment" add constraint "comment_parent_comment_id_foreign" foreign key ("parent_comment_id") references "comment" ("id") on update cascade on delete set null;`);
  }

}
