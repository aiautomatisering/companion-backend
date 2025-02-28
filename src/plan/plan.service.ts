import { Injectable } from '@nestjs/common';
import { CreatePlanDto } from './dto/plan.dto';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PlanService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) {}
  create(createPlanDto: CreatePlanDto) {
    return this.prisma.plan.create({ data: createPlanDto });
  }

  findAll() {
    return this.prisma.plan.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} plan`;
  }

  remove(id: number) {
    return `This action removes a #${id} plan`;
  }
}
