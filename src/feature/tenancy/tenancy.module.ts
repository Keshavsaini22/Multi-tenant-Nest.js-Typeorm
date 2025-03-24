import { Global, Module, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { CONNECTION } from './tenancy.symbols';
import { getTenantConnection } from './tenancy.utils';

const connectionFactory = {
  provide: CONNECTION,
  scope: Scope.REQUEST,
  useFactory: async (request: any, configService: ConfigService) => {
    const { tenantId } = request;
    if (tenantId) {
      return await getTenantConnection(tenantId, configService);
    }

    return null;
  },
  inject: [REQUEST],
};

@Global()
@Module({
  providers: [connectionFactory],
  exports: [CONNECTION],
})
export class TenancyModule {}
