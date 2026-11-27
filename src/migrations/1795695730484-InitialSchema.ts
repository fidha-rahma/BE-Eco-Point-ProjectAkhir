
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1795695730484 implements MigrationInterface {
    name = 'InitialSchema1795695730484';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Tabel kategori sampah
        await queryRunner.query(`
            CREATE TABLE "waste_categories" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(100) NOT NULL,
                "points_per_kg" integer NOT NULL,
                CONSTRAINT "UQ_55fbe5da1290150a4753db55172" UNIQUE ("name"),
                CONSTRAINT "PK_9783f736537a21a16afce9a2133" PRIMARY KEY ("id")
            )
        `);

        // Tabel transaksi sampah
        await queryRunner.query(`
            CREATE TABLE "waste_transactions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "weight_kg" numeric(10,2) NOT NULL,
                "total_points_earned" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "user_id" uuid NOT NULL,
                "waste_category_id" uuid NOT NULL,
                CONSTRAINT "PK_b8163c9580b3865eb0fea3f0b9d" PRIMARY KEY ("id")
            )
        `);

        // Tabel rewards
        await queryRunner.query(`
            CREATE TABLE "rewards" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(150) NOT NULL,
                "points_required" integer NOT NULL,
                "stock" integer NOT NULL DEFAULT '0',
                CONSTRAINT "PK_3d947441a48debeb9b7366f8b8c" PRIMARY KEY ("id")
            )
        `);

        // Tabel penukaran rewards
        await queryRunner.query(`
            CREATE TABLE "redemptions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "points_spent" integer NOT NULL,
                "quantity" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "user_id" uuid NOT NULL,
                "reward_id" uuid NOT NULL,
                CONSTRAINT "PK_def143ab94376fea5985bb04219" PRIMARY KEY ("id")
            )
        `);

        // Menyesuaikan kolom users tanpa menghapus data
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "email" TYPE character varying(150)
        `);

        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "password" TYPE character varying
        `);

        // Mempertahankan unique constraint email
        await queryRunner.query(`
            ALTER TABLE "users"
            RENAME CONSTRAINT "users_email_key"
            TO "UQ_97672ac88f789774dd47f7c8be3"
        `);

        // Mengubah role menjadi enum
        await queryRunner.query(`
            CREATE TYPE "public"."users_role_enum"
            AS ENUM('admin', 'member')
        `);

        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "role" DROP DEFAULT
        `);

        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "role"
            TYPE "public"."users_role_enum"
            USING "role"::text::"public"."users_role_enum"
        `);

        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "role" SET DEFAULT 'member'
        `);

        // Relasi transaksi dengan users
        await queryRunner.query(`
            ALTER TABLE "waste_transactions"
            ADD CONSTRAINT "FK_9173757902791305d2a34bdb1ce"
            FOREIGN KEY ("user_id") REFERENCES "users"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        // Relasi transaksi dengan kategori sampah
        await queryRunner.query(`
            ALTER TABLE "waste_transactions"
            ADD CONSTRAINT "FK_0d4af8e0e27f64e1d912af3ab66"
            FOREIGN KEY ("waste_category_id") REFERENCES "waste_categories"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        // Relasi penukaran dengan users
        await queryRunner.query(`
            ALTER TABLE "redemptions"
            ADD CONSTRAINT "FK_c59b27ed1a764e578add290572c"
            FOREIGN KEY ("user_id") REFERENCES "users"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        // Relasi penukaran dengan rewards
        await queryRunner.query(`
            ALTER TABLE "redemptions"
            ADD CONSTRAINT "FK_e845e4dbdf77458f29473e5e0cf"
            FOREIGN KEY ("reward_id") REFERENCES "rewards"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Menghapus foreign key
        await queryRunner.query(`
            ALTER TABLE "redemptions"
            DROP CONSTRAINT "FK_e845e4dbdf77458f29473e5e0cf"
        `);

        await queryRunner.query(`
            ALTER TABLE "redemptions"
            DROP CONSTRAINT "FK_c59b27ed1a764e578add290572c"
        `);

        await queryRunner.query(`
            ALTER TABLE "waste_transactions"
            DROP CONSTRAINT "FK_0d4af8e0e27f64e1d912af3ab66"
        `);

        await queryRunner.query(`
            ALTER TABLE "waste_transactions"
            DROP CONSTRAINT "FK_9173757902791305d2a34bdb1ce"
        `);

        // Mengembalikan tipe password
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "password" TYPE character varying(255)
        `);

        // Mengembalikan tipe role
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "role" DROP DEFAULT
        `);

        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "role"
            TYPE character varying(50)
            USING "role"::text
        `);

        await queryRunner.query(`
            DROP TYPE "public"."users_role_enum"
        `);

        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "role" SET DEFAULT 'USER'
        `);

        // Mengembalikan tipe email
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "email" TYPE character varying(255)
        `);

        // Mengembalikan nama constraint email
        await queryRunner.query(`
            ALTER TABLE "users"
            RENAME CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"
            TO "users_email_key"
        `);

        // Menghapus tabel yang dibuat migration
        await queryRunner.query(`DROP TABLE "redemptions"`);
        await queryRunner.query(`DROP TABLE "rewards"`);
        await queryRunner.query(`DROP TABLE "waste_transactions"`);
        await queryRunner.query(`DROP TABLE "waste_categories"`);
    }
}
