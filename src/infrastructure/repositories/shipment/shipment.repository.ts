import { Inject, Injectable, Scope } from '@nestjs/common';
import { Shipment } from 'src/domain/shipment/shipment.entity';
import { CONNECTION } from 'src/feature/tenancy/tenancy.symbols';
import { DataSource, Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class ShipmentRepository {
  private shipmentRepository: Repository<Shipment>;

  constructor(@Inject(CONNECTION) private readonly dataSource: DataSource) {
    this.shipmentRepository = this.dataSource.getRepository(Shipment);
  }

  async createShipment(shipment: Shipment): Promise<Shipment> {
    return await this.shipmentRepository.save(shipment);
  }

  async save(shipment: Shipment): Promise<Shipment> {
    return await this.shipmentRepository.save(shipment);
  }

  async getShipment(uuid: string): Promise<Shipment | null> {
    return await this.shipmentRepository.findOne({
      where: { uuid },
      relations: ['stops'],
    });
  }
}
