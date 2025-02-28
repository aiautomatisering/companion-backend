import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/plan.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { AllowedRoles } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('plan')
@ApiTags('Plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AllowedRoles.ADMIN)
  @Post()
  create(@Body() createPlanDto: CreatePlanDto) {
    console.log('createPlanDto', createPlanDto);
    return this.planService.create(createPlanDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AllowedRoles.ADMIN, AllowedRoles.USER)
  @Get('/all')
  findAll() {
    return this.planService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AllowedRoles.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planService.remove(+id);
  }
}
