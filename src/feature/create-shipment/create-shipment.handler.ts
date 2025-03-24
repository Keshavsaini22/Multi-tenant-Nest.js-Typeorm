import { Injectable } from '@nestjs/common';
import { Shipment } from 'src/domain/shipment/shipment.entity';
import { Stop } from 'src/domain/shipment/stop.entity';
import { ShipmentRepository } from 'src/infrastructure/repositories/shipment/shipment.repository';
import { CreateShipmentDto } from './create-shipment.dto';
import { CreateShipmentCommand } from './create-shipment.command';


@Injectable()
export class CreateShipmentHandler {
  constructor(private readonly shipmentRepository: ShipmentRepository) {}

  public async handle(command: CreateShipmentCommand ): Promise<Shipment> {
    const { stops } = command;
    let shipment = new Shipment();

    shipment.stops = stops.map((stopData) => {
      const stop = new Stop();
      stop.sequence = stopData.sequence;
      stop.type = stopData.type as any;
      return stop;
    });

    return await this.shipmentRepository.createShipment(shipment);
  }
}
