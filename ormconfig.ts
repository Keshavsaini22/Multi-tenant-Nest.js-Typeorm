import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import {
  addTransactionalDataSource,
  initializeTransactionalContext,
} from 'typeorm-transactional';
require('dotenv').config();

initializeTransactionalContext();

let dataSourceInstance: DataSource | null = null;

export const publicDataSourceOptions = (
  configService: ConfigService,
): DataSourceOptions & SeederOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USER'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  entities: ['dist/src/domain/**/*.entity.js'],
  synchronize: false,
  migrationsTableName: 'migrations',
  migrations: ['dist/src/infrastructure/database/migrations/public/*.js'],
  seedTableName: 'seeds',
  seedName: 'seeder',
  seeds: ['dist/src/infrastructure/database/seeders/*.js'],
  seedTracking: true,
});

export const dataSource = (() => {
  if (!dataSourceInstance) {
    dataSourceInstance = new DataSource(
      publicDataSourceOptions(new ConfigService()),
    );
    return addTransactionalDataSource(dataSourceInstance);
  }
  return dataSourceInstance;
})();

export const tenantedDataSourceOptions = (configService: ConfigService) => ({
  ...publicDataSourceOptions(configService),
  entities: ['dist/src/domain/**/*entity.js'],
  migrations: ['dist/src/infrastructure/database/migrations/tenanted/*.js'],
});
