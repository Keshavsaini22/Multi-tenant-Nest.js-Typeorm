import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateTenantCommand } from './create-tenant.command';
import { CreateTenantDto } from './create-tenant.dto';

@Controller('tenants')
export class CreateTenantController {
  constructor(private commandBus: CommandBus) {}

  @Post()
  async createTenant(@Body() body: CreateTenantDto) {
    const { name } = body;
    const command = new CreateTenantCommand(name);
    await this.commandBus.execute(command);

    return { message: 'Tenant created successfully' };
  }
}
