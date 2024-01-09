import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthWithRoles } from 'src/decorators/auth.decorator';
import { OrderCreateDto } from './dto/order-create.dto';
import { OrderFindManyDto } from './dto/order-find-many.dto';
import { OrderService } from './order.service';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('find-many')
  @ApiBearerAuth()
  @AuthWithRoles()
  findMany(@Body() body: OrderFindManyDto, @Req() req) {
    return this.orderService.findMany(body, req.user.userUuid);
  }

  @Post('create')
  @ApiBearerAuth()
  @AuthWithRoles()
  create(@Body() body: OrderCreateDto, @Req() req) {
    return this.orderService.create(body, req.user.userUuid);
  }
}
