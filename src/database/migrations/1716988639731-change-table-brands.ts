import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTableBrands1716988639731 implements MigrationInterface {
    name = 'ChangeTableBrands1716988639731'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "brands" DROP COLUMN "image"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "brands" ADD "image" character varying(255) NOT NULL`);
    }

}
