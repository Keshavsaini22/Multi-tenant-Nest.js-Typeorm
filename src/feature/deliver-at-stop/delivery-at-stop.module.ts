import { Module } from '@nestjs/common';
import { OutboxMessageRepository } from 'src/infrastructure/repositories/outbox-message/outbox-message.repository';
import { ShipmentRepository } from 'src/infrastructure/repositories/shipment/shipment.repository';
import { DeliverAtStopCommand } from './deliver-at-stop.command';
import { DeliverAtStopController } from './deliver-at-stop.controller';
import { DeliverAtStopHandler } from './deliver-at-stop.handler';

@Module({
  imports: [],
  controllers: [DeliverAtStopController],
  providers: [
    ShipmentRepository,
    OutboxMessageRepository,
    DeliverAtStopHandler,
    DeliverAtStopCommand,
  ],
})
export class DeliverAtStopModule {}
