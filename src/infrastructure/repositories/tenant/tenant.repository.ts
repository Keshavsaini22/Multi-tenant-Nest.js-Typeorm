import { Injectable } from '@nestjs/common';
import { Tenant } from 'src/domain/tenant/tenant.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TenantRepository extends Repository<Tenant> {
  constructor(dataSource: DataSource) {
    super(Tenant, dataSource.createEntityManager());
  }

  async createTenant(stops: any): Promise<Tenant> {
    return await this.save(stops);
  }

  async findTenant(uuid: string): Promise<Tenant> {
    return await this.findOne({ where: { uuid: uuid } });
  }
}
