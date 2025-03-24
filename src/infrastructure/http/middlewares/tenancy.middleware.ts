import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';

const TENANT_HEADER = 'x-tenant-id';

// export function tenancyMiddleware(
//   req: any,
//   _res: Response,
//   next: NextFunction,
// ): void {
//   const header = req.headers[TENANT_HEADER] as string;
//   req.tenantId = header?.toString() || null;
//   next();
// }

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  //   constructor(private readonly tenantService: TenantService) {}

  async use(
    req: Request & { tenantId?: string | null },
    _res: Response,
    next: NextFunction,
  ) {
    const header = req.headers[TENANT_HEADER] as string;
    req.tenantId = header?.toString() || null;
    // const tenantId = req.headers['x-tenant-id'] as string;

    // if (tenantId) {
    //   try {
    //     const tenant = await this.tenantService.findById(tenantId);
    //     req['tenant'] = tenant;
    //   } catch (error) {
    //     // If tenant not found, continue without setting tenant
    //     console.error(`Tenant with id ${tenantId} not found`);
    //   }
    // }

    next();
  }
}
