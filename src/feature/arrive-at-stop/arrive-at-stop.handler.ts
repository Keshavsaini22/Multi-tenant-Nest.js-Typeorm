import { InjectRepository } from '@nestjs/typeorm';
import { ShipmentArrivedAtStop } from 'src/domain/shipment/events/shipment-arrived-at-stop';
import { ShipmentNotFound } from 'src/domain/shipment/exceptions/exceptions';
import { OutboxMessageRepository } from 'src/infrastructure/repositories/outbox-message/outbox-message.repository';
import { ShipmentRepository } from 'src/infrastructure/repositories/shipment/shipment.repository';
import { Transactional } from 'typeorm-transactional';
import { ArriveAtStopCommand } from './arrive-at-stop.command';

export class ArriveAtStopHandler {
  constructor(
    private readonly shipmentRepository: ShipmentRepository,

    @InjectRepository(OutboxMessageRepository)
    private outboxMessageRepository: OutboxMessageRepository,
  ) {}

  @Transactional()
  public async handle(command: ArriveAtStopCommand) {
    const { stop_id, shipment_id } = command;

    const shipment = await this.shipmentRepository.getShipment(shipment_id);

    if (!shipment) {
      throw new ShipmentNotFound();
    }

    shipment.arrive(stop_id);
    await this.shipmentRepository.save(shipment);
    
    await this.outboxMessageRepository.storeOutboxMessage(
        new ShipmentArrivedAtStop({ shipment_id, stop_id }),
    );
  }
}
