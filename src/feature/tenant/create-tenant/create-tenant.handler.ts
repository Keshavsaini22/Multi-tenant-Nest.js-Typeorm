import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { tenantedDataSourceOptions } from 'ormconfig';
import { Tenant } from 'src/domain/tenant/tenant.entity';
import { TenantRepository } from 'src/infrastructure/repositories/tenant/tenant.repository';
import { DataSource, DataSourceOptions } from 'typeorm';
import { CreateTenantCommand } from './create-tenant.command';

@CommandHandler(CreateTenantCommand)
export class CreateTenantHandler
  implements ICommandHandler<CreateTenantCommand>
{
  constructor(
    private readonly configService: ConfigService,
    @InjectDataSource() private dataSource: DataSource,

    @InjectRepository(TenantRepository)
    private readonly repository: TenantRepository,
  ) {}

  // @Transactional()
  async execute(command: CreateTenantCommand) {
    const { name } = command;
    const tenant = new Tenant();

    const schemaName = `tenant_${name}`;
    tenant.name = name;
    tenant.schema = schemaName;

    await this.repository.createTenant(tenant);

    await this.dataSource.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

    await this.runMigrations(schemaName);
  }

  private async runMigrations(schemaName: string) {
    const tenantDataSource = new DataSource({
      ...tenantedDataSourceOptions(this.configService),
      schema: schemaName,
      name: schemaName,
      poolSize: 5,
    } as DataSourceOptions);
    try {
      await tenantDataSource.initialize();
      await this.dataSource.query(
        `SELECT schema_name FROM information_schema.schemata WHERE schema_name = '${schemaName}'`,
      );

      await tenantDataSource.runMigrations().catch((error) => {
        console.error('Error running migrations: ', error);
      });
    } catch (error) {
      console.error('Error running migrations: ', error);
    } finally {
      await tenantDataSource.destroy();
    }
  }
}
