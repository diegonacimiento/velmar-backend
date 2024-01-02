import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTablesModProducts1704210254538 implements MigrationInterface {
    name = 'CreateTablesModProducts1704210254538'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" character varying(60) NOT NULL, "image" character varying(255) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "name" character varying(70) NOT NULL, "description" character varying(355) NOT NULL, "price" integer NOT NULL, "stock" integer NOT NULL, "image" character varying(255) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "brand_id" integer, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "brands" ("id" SERIAL NOT NULL, "name" character varying(60) NOT NULL, "image" character varying(255) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories_products" ("product_id" integer NOT NULL, "category_id" integer NOT NULL, CONSTRAINT "PK_99a8246a1c03587ec10bd93836b" PRIMARY KEY ("product_id", "category_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cd4647bd19e92294b58a536798" ON "categories_products" ("product_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_18751735d6d4936849dafa4d75" ON "categories_products" ("category_id") `);
        await queryRunner.query(`CREATE TABLE "brands_categories" ("brand_id" integer NOT NULL, "category_id" integer NOT NULL, CONSTRAINT "PK_fed5e3b1391ec631d101024caed" PRIMARY KEY ("brand_id", "category_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_13cc61cc43ba45ad0499561f1e" ON "brands_categories" ("brand_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_a49d35b225ccab25f7162b9f26" ON "brands_categories" ("category_id") `);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_1530a6f15d3c79d1b70be98f2be" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categories_products" ADD CONSTRAINT "FK_cd4647bd19e92294b58a536798c" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "categories_products" ADD CONSTRAINT "FK_18751735d6d4936849dafa4d751" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "brands_categories" ADD CONSTRAINT "FK_13cc61cc43ba45ad0499561f1e8" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "brands_categories" ADD CONSTRAINT "FK_a49d35b225ccab25f7162b9f267" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "brands_categories" DROP CONSTRAINT "FK_a49d35b225ccab25f7162b9f267"`);
        await queryRunner.query(`ALTER TABLE "brands_categories" DROP CONSTRAINT "FK_13cc61cc43ba45ad0499561f1e8"`);
        await queryRunner.query(`ALTER TABLE "categories_products" DROP CONSTRAINT "FK_18751735d6d4936849dafa4d751"`);
        await queryRunner.query(`ALTER TABLE "categories_products" DROP CONSTRAINT "FK_cd4647bd19e92294b58a536798c"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_1530a6f15d3c79d1b70be98f2be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a49d35b225ccab25f7162b9f26"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_13cc61cc43ba45ad0499561f1e"`);
        await queryRunner.query(`DROP TABLE "brands_categories"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_18751735d6d4936849dafa4d75"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cd4647bd19e92294b58a536798"`);
        await queryRunner.query(`DROP TABLE "categories_products"`);
        await queryRunner.query(`DROP TABLE "brands"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
