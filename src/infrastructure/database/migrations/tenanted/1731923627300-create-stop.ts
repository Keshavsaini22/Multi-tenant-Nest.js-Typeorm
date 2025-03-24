import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export class CreateStop1731923627300 implements MigrationInterface {
  name = 'CreateStop1731923627300';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const { schema } = queryRunner.connection
      .options as PostgresConnectionOptions;

    await queryRunner.query(`
        CREATE TYPE "${schema}"."stop_type_enum" AS ENUM('PICKUP', 'DELIVERY');
      `);

    await queryRunner.query(`
        CREATE TYPE "${schema}"."stop_status_enum" AS ENUM('IN_TRANSIT', 'ARRIVED', 'DEPARTED');
      `);

    await queryRunner.createTable(
      new Table({
        schema: schema,
        name: 'stop',
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
            name: 'sequence',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'enum',
            enumName: 'stop_type_enum',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enumName: 'stop_status_enum',
            default: `'IN_TRANSIT'`,
          },
          {
            name: 'shipment_id',
            type: 'int',
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

    await queryRunner.createForeignKey(
      'stop',
      new TableForeignKey({
        columnNames: ['shipment_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'shipment',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const { schema } = queryRunner.connection
      .options as PostgresConnectionOptions;

    await queryRunner.dropTable(`${schema}.stop`);

    await queryRunner.dropTable('stop');
    await queryRunner.query(`
      DROP TYPE "${schema}".stop_type_enum;
    `);
    await queryRunner.query(`
      DROP TYPE "${schema}".stop_status_enum;
    `);
  }
}
