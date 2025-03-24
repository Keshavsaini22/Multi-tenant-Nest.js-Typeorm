import { Module } from '@nestjs/common';
import { ResourceManager } from 'src/infrastructure/http/transformers/resource-manager';
import { ShipmentRepository } from 'src/infrastructure/repositories/shipment/shipment.repository';
import { CreateShipmentController } from './create-shipment.controller';
import { CreateShipmentHandler } from './create-shipment.handler';

@Module({
  controllers: [CreateShipmentController],
  providers: [
    CreateShipmentHandler,
    ShipmentRepository,
    ResourceManager
  ],
})
export class CreateShipmentModule {}