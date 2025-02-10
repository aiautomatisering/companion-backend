import { Module } from '@nestjs/common';

import { RoleService } from './role.service';

import { PrismaService } from 'src/prisma.service';
import { RoleController } from './role.controller';

@Module({
  controllers: [RoleController],
  providers: [RoleService, PrismaService],
})
export class RoleModule {}
