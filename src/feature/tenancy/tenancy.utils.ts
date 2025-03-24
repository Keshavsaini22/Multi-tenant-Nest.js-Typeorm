import { ConfigService } from '@nestjs/config';
import { tenantedDataSourceOptions } from 'ormconfig';
import { DataSource, DataSourceOptions } from 'typeorm';

// Store tenant-specific connections in an object
export const tenantConnections: { [schemaName: string]: DataSource } = {};

export async function getTenantConnection(
  tenantId: string,
  configService: ConfigService,
): Promise<DataSource> {
  const connectionName = `tenant_${tenantId}`;

  if (tenantConnections[connectionName]) {
    const existingConnection = tenantConnections[connectionName];

    if (existingConnection.isInitialized) {
      return existingConnection;
    } else {
      await existingConnection.initialize();
      return existingConnection;
    }
  }

  const newDataSource = new DataSource({
    ...tenantedDataSourceOptions(configService),
    schema: connectionName,
    name: connectionName,
    poolSize: 5,
  } as DataSourceOptions);

  await newDataSource.initialize();

  tenantConnections[connectionName] = newDataSource;

  return newDataSource;
}
