import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

// Dtos
import { UserRolesResponseDto } from 'src/role/dto/role.dto';

// Validations
export class CreateUserDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  firstName: string;

  @IsString()
  @ApiProperty()
  lastName: string;

  @IsString()
  @ApiProperty()
  password: string;

  @IsArray()
  @ArrayNotEmpty()
  @ApiProperty({ type: () => String, isArray: true })
  roles: string[];
}

export class UpdateUserDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  firstName: string;

  @IsString()
  @ApiProperty()
  lastName: string;

  @IsOptional()
  @ApiProperty()
  password?: string;

  @IsString({ each: true })
  @ApiProperty()
  roles?: string[];
}

export class ChangePassword {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  oldPassword: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  confirmPassword: string;
}

// Responses
export class BaseUserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;
}

export class UserResponseDto extends BaseUserResponseDto {
  constructor(partial: Partial<UserResponseDto>) {
    super();
    Object.assign(this, partial);
  }

  @Exclude()
  password?: string;

  @ApiProperty({ type: () => UserRolesResponseDto, isArray: true })
  roles: UserRolesResponseDto[];
}

export class UserSigninResponseDto extends BaseUserResponseDto {
  constructor(partial: Partial<UserResponseDto>) {
    super();
    Object.assign(this, partial);
  }

  @Exclude()
  password?: string;

  @ApiProperty({ type: () => UserRolesResponseDto, isArray: true })
  roles?: UserRolesResponseDto[];
}
