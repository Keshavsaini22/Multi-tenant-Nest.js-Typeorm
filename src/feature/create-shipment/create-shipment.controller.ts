import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { Shipment } from 'src/domain/shipment/shipment.entity';
import { ResourceManager } from 'src/infrastructure/http/transformers/resource-manager';
import { ShipmentTransformer } from 'src/infrastructure/http/transformers/shipment.transformer';
import { CreateShipmentDto } from './create-shipment.dto';
import { CreateShipmentHandler } from './create-shipment.handler';
import { CreateShipmentInterceptor } from './create-shipment.interceptor';
import { CreateShipmentCommand } from './create-shipment.command';

@Controller('shipments')
export class CreateShipmentController {
  constructor(
    private readonly handler: CreateShipmentHandler,
    private readonly resourceManager: ResourceManager,
  ) {}

  @Post()
  @UseInterceptors(new CreateShipmentInterceptor())
  async createShipment(@Body() body: CreateShipmentDto) {
    const { stops } = body;
    const command = new CreateShipmentCommand(stops);
    const shipment = await this.handler.handle(command);

    return await this.resourceManager.item<Shipment>(
      shipment,
      new ShipmentTransformer(),
    );
  }
}
