import { MigrationInterface, QueryRunner } from "typeorm";

export class NewUser1711221187817 implements MigrationInterface {
    name = 'NewUser1711221187817'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "adress" TO "address"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "address" TO "adress"`);
    }

}
