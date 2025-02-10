import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

// Guards
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

// Dtos
import { BaseRoleResponseDto, CreateRoleDto } from './dto/role.dto';

// Services
import { RoleService } from './role.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { AllowedRoles } from '@prisma/client';
import { Roles } from 'src/auth/roles.decorator';

@Controller('role')
@ApiTags('Roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AllowedRoles.ADMIN)
  @ApiBearerAuth('JWT')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get('/all')
  @ApiOkResponse({ type: BaseRoleResponseDto, isArray: true })
  findAll(): Promise<BaseRoleResponseDto[]> {
    return this.roleService.findAll();
  }
}
