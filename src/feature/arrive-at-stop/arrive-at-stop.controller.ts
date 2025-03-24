import { Controller, Param, Patch, UseInterceptors } from '@nestjs/common';
import { ArriveAtStopCommand } from './arrive-at-stop.command';
import { ArriveAtStopHandler } from './arrive-at-stop.handler';
import { ArriveAtStopInterceptor } from './arrive-at-stop.interceptor';

@Controller('shipments')
export class ArriveAtStopController {
  constructor(private readonly handler: ArriveAtStopHandler) {}

  @Patch('/:shipment_id/stops/:stop_id/arrive')
  @UseInterceptors(new ArriveAtStopInterceptor())
  async arriveAtStop(
    @Param('shipment_id') shipment_id: string,
    @Param('stop_id') stop_id: string,
  ) {
    const command = new ArriveAtStopCommand(stop_id, shipment_id);
    await this.handler.handle(command);

    return { message: 'Arrived at stop successfully' };
  }
}
