import { Controller, Param, Patch, UseInterceptors } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { PickupAtStopCommand } from './pickup-at-stop.command';
import { PickupAtStopInterceptor } from './pickup-at-stop.interceptor';
import { ArriveAtStopHandler } from '../arrive-at-stop/arrive-at-stop.handler';
import { PickupAtStopHandler } from './pickup-at-stop.handler';

@Controller('shipments')
export class PickupAtStopController {
  constructor(private readonly handler: PickupAtStopHandler) {}

  @Patch('/:shipment_id/stops/:stop_id/pickup')
  @UseInterceptors(new PickupAtStopInterceptor())
  async pickupAtStop(
    @Param('shipment_id') shipment_id: string,
    @Param('stop_id') stop_id: string,
  ) {
    const command = new PickupAtStopCommand(stop_id, shipment_id);
    await this.handler.handle(command);

    return { message: 'Shipment picked up from stop successfully' };
  }
}
