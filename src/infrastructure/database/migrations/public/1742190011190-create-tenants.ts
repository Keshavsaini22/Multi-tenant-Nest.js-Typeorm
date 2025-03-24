import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTenant1742190011190 implements MigrationInterface {
  name = 'CreateTenant1742190011190';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tenant',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'uuid',
            type: 'uuid',
            isUnique: true,
            default: 'uuid_generate_v4()',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'character varying',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'schema',
            type: 'character varying',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tenant');
  }
}
