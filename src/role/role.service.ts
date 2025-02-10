import { Injectable, UnprocessableEntityException } from '@nestjs/common';

// Import services
import { PrismaService } from 'src/prisma.service';

// Dtos
import {
  BaseRoleResponseDto,
  CreateRoleDto,
  UserRolesResponseDto,
} from './dto/role.dto';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto): Promise<BaseRoleResponseDto> {
    const role = await this.prisma.role.upsert({
      where: { name: createRoleDto.name },
      update: { name: createRoleDto.name },
      create: { name: createRoleDto.name },
    });
    return new BaseRoleResponseDto(role);
  }

  async findOne(id: string): Promise<BaseRoleResponseDto> {
    const role = await this.prisma.role.findUnique({ where: { id } });

    if (!role) {
      throw new UnprocessableEntityException('Role does not exist.');
    }
    return new BaseRoleResponseDto(role);
  }

  async findAll(): Promise<BaseRoleResponseDto[]> {
    const roles = await this.prisma.role.findMany();

    return roles.map((role) => new BaseRoleResponseDto(role));
  }

  async attachRole(
    roleId: string,
    userId: string
  ): Promise<UserRolesResponseDto> {
    const userRole = await this.prisma.userRole.upsert({
      where: { userId_roleId: { userId, roleId } },
      update: {
        roleId,
      },
      create: {
        userId,
        roleId,
      },
    });

    return new UserRolesResponseDto(userRole);
  }

  async delete(id: string) {
    const role = await this.prisma.role.delete({ where: { id } });
    return new BaseRoleResponseDto(role);
  }

  async detachRole(
    roleId: string,
    userId: string
  ): Promise<UserRolesResponseDto> {
    const userRoles = await this.prisma.userRole.count({
      where: { userId },
    });

    if (userRoles <= 1) {
      throw new UnprocessableEntityException('You must have at least one role');
    }

    const userRole = await this.prisma.userRole.delete({
      where: { userId_roleId: { userId, roleId } },
    });

    return new UserRolesResponseDto(userRole);
  }
}
