import { IsInt, IsOptional, IsString, IsEnum } from 'class-validator';
import { BillingInterval } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { BaseSubscriptionResponseDto } from 'src/subscription/dto/subscription.dto';

// ✅ Validation DTO
export class CreatePlanDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  priceId: string;

  @ApiProperty({ enum: BillingInterval })
  @IsEnum(BillingInterval) // ✅ Ensure enum validation
  interval: BillingInterval;

  @ApiProperty()
  @IsInt()
  amount: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  trialDays?: number;
}

// ✅ Base Response DTO
export class BasePlanResponseDto {
  constructor(partial: Partial<BasePlanResponseDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  priceId: string;

  @ApiProperty({ enum: BillingInterval })
  interval: BillingInterval;

  @ApiProperty()
  amount: number;

  @ApiProperty({ required: false })
  trialDays?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

// ✅ Plan Response DTO (adds subscription relation)
export class PlanResponseDto extends BasePlanResponseDto {
  constructor(partial: Partial<PlanResponseDto>) {
    super(partial);
  }

  @ApiProperty({ type: () => BaseSubscriptionResponseDto, required: false })
  subscription?: BaseSubscriptionResponseDto;
}
