import { IsUUID, IsString, IsOptional, IsEnum } from 'class-validator';
import { SubscriptionStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { BaseUserResponseDto } from 'src/user/dto/user.dto';
import { BasePlanResponseDto } from 'src/plan/dto/plan.dto';

// Validations
export class CreateSubscriptionDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsUUID()
  planId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  stripeSubId?: string; // Stripe Subscription ID

  @ApiProperty({ enum: SubscriptionStatus })
  @IsEnum(SubscriptionStatus)
  status: SubscriptionStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  canceledAt?: Date;
}

// Responses

export class BaseSubscriptionResponseDto {
  constructor(partial: Partial<BaseSubscriptionResponseDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  planId: string;

  @ApiProperty({ required: false })
  stripeSubId?: string; // Stripe Subscription ID

  @ApiProperty({ enum: SubscriptionStatus })
  status: SubscriptionStatus;

  @ApiProperty()
  startDate: Date;

  @ApiProperty({ required: false })
  endDate?: Date;

  @ApiProperty({ required: false })
  canceledAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class SubscriptionResponseDto extends BaseSubscriptionResponseDto {
  constructor(partial: Partial<SubscriptionResponseDto>) {
    super(partial);
  }

  @ApiProperty({ type: () => BaseUserResponseDto, required: false })
  user?: BaseUserResponseDto;

  @ApiProperty({ type: () => BasePlanResponseDto, required: false })
  plan?: BasePlanResponseDto;
}
