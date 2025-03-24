import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export class CreateShipment1731923627299 implements MigrationInterface {
  name = 'CreateShipment1731923627299';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const { schema } = queryRunner.connection.options as PostgresConnectionOptions;

    await queryRunner.createTable(
      new Table({
        schema: schema,
        name: 'shipment',
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
            name: 'is_complete',
            type: 'boolean',
            default: false,
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
    const { schema } = queryRunner.connection.options as PostgresConnectionOptions;
    await queryRunner.dropTable(`${schema}.shipment`);
  }
}