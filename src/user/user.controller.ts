import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

// Services
import { UserService } from './user.service';
import { CreateUserDto, UserResponseDto } from './dto/user.dto';
import { User } from './user.decorator';

// Guards and roles
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { AllowedRoles } from '@prisma/client';

@Controller('user')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AllowedRoles.ADMIN)
  @ApiBearerAuth('JWT')
  @ApiOkResponse({ type: () => UserResponseDto, isArray: true })
  findAll(@User() user: UserResponseDto): Promise<UserResponseDto[]> {
    return this.userService.findAll(user);
  }

  @Post()
  @ApiOkResponse({ type: () => UserResponseDto })
  create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(createUserDto);
  }
}
