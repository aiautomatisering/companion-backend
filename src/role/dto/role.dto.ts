import { ApiProperty } from '@nestjs/swagger';
import { AllowedRoles } from '@prisma/client';
import { IsString } from 'class-validator';

// Validations
export class CreateRoleDto {
  @IsString()
  @ApiProperty()
  name: AllowedRoles;
}

export class CreateUserRoleDto {
  @IsString()
  @ApiProperty()
  userId?: string;

  @IsString()
  @ApiProperty()
  roleId: string;
}

// Responses
export class BaseRoleResponseDto {
  constructor(partial: Partial<BaseRoleResponseDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class UserRolesResponseDto {
  constructor(partial: Partial<UserRolesResponseDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  userId: string;

  @ApiProperty()
  roleId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: () => BaseRoleResponseDto })
  role: BaseRoleResponseDto;
}

export class AttachRoleDto {
  @ApiProperty()
  roleId: string;
}
