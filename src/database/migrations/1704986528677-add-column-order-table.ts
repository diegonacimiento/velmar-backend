import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnOrderTable1704986528677 implements MigrationInterface {
    name = 'AddColumnOrderTable1704986528677'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "status" character varying NOT NULL DEFAULT 'in-progress'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "status"`);
    }

}
