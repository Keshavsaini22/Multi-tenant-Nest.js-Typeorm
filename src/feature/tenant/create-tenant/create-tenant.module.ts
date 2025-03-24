import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from 'src/infrastructure/database/type-orm';
import { TenantRepository } from 'src/infrastructure/repositories/tenant/tenant.repository';
import { CreateTenantController } from './create-tenant.controller';
import { CreateTenantHandler } from './create-tenant.handler';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule,
  ],
  controllers: [CreateTenantController],
  providers: [TenantRepository, CreateTenantHandler],
})
export class CreateTenantsModule {}
