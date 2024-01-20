import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedRecoveryTokenUsers1705680835677 implements MigrationInterface {
    name = 'AddedRecoveryTokenUsers1705680835677'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "recoveryToken" character varying(555)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "recoveryToken"`);
    }

}
