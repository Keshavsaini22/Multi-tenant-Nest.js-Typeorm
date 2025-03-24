import { Module } from '@nestjs/common';
import { OutboxMessageRepository } from 'src/infrastructure/repositories/outbox-message/outbox-message.repository';
import { ShipmentRepository } from 'src/infrastructure/repositories/shipment/shipment.repository';
import { PickupAtStopCommand } from './pickup-at-stop.command';
import { PickupAtStopController } from './pickup-at-stop.controller';
import { PickupAtStopHandler } from './pickup-at-stop.handler';

@Module({
  imports: [],
  controllers: [PickupAtStopController],
  providers: [
    PickupAtStopHandler,
    ShipmentRepository,
    PickupAtStopCommand,
    OutboxMessageRepository,
  ],
})
export class PickupAtStopModule {}
