import { Controller, Param, Patch, UseInterceptors } from '@nestjs/common';
import { DeliverAtStopCommand } from './deliver-at-stop.command';
import { DeliverAtStopHandler } from './deliver-at-stop.handler';
import { DeliverAtStopInterceptor } from './deliver-at-stop.interceptor';

@Controller('shipments')
export class DeliverAtStopController {
  constructor(private readonly handler: DeliverAtStopHandler) {}

  @Patch('/:shipment_id/stops/:stop_id/deliver')
  @UseInterceptors(new DeliverAtStopInterceptor())
  async deliverAtStop(
    @Param('shipment_id') shipment_id: string,
    @Param('stop_id') stop_id: string,
  ) {
    const command = new DeliverAtStopCommand(stop_id, shipment_id);
    await this.handler.handle(command);

    return { message: 'Shipment delivered at stop successfully' };
  }
}
