import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from './infrastructure/database/type-orm';
import { ArriveAtStopModule } from './feature/arrive-at-stop/arrive-at-stop.module';
import { CreateShipmentModule } from './feature/create-shipment/create-shipment.module';
import { PickupAtStopModule } from './feature/pickup-at-stop/pickup.module';
import { DeliverAtStopModule } from './feature/deliver-at-stop/delivery-at-stop.module';
import { TenancyModule } from './feature/tenancy/tenancy.module';
import { TenantMiddleware } from './infrastructure/http/middlewares/tenancy.middleware';
import { CreateTenantsModule } from './feature/tenant/create-tenant/create-tenant.module';
import { dataSource } from 'ormconfig';
import { getTenantConnection } from './feature/tenancy/tenancy.utils';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule,
    TenancyModule,
    CreateTenantsModule,
    ArriveAtStopModule,
    CreateShipmentModule,
    PickupAtStopModule,
    DeliverAtStopModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule, OnModuleInit {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .forRoutes({ path: 'shipments*', method: RequestMethod.ALL });
  }

  async onModuleInit() {
    const entityManager = dataSource.manager;
    const schemas = await entityManager.query(
      'SELECT schema_name as name FROM information_schema.schemata;',
    );
    console.log('schemas: ', schemas);

    for (const schema of schemas) {
      if (schema.name.startsWith('tenant_')) {
        const tenantId = schema.name.replace('tenant_', '');
        console.log('tenantId: ', tenantId);

        const tenantConnection = await getTenantConnection(
          tenantId,
          this.configService,
        );

        await tenantConnection.runMigrations();
      }
    }
  }
}
