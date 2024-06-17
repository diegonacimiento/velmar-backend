import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1718664553575 implements MigrationInterface {
    name = 'Update1718664553575'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" ADD "isProtected" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "products" ADD "isProtected" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "brands" ADD "isProtected" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "brands" DROP COLUMN "isProtected"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "isProtected"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "isProtected"`);
    }

}
