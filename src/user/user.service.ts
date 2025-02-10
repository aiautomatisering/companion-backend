import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
// Services
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto, UserResponseDto } from './dto/user.dto';
import { ConfigService } from '@nestjs/config';
import { AllowedRoles } from '@prisma/client';

export const USER_FIELDS = {
  id: true,
  email: true,
  password: false,
  lastName: true,
  firstName: true,
  updatedAt: true,
  createdAt: true,
  roles: { include: { role: true } },
};

export const SIGN_IN_USER_FIELDS = {
  id: true,
  email: true,
  password: false,
  lastName: true,
  firstName: true,
  updatedAt: true,
  createdAt: true,
  roles: { include: { role: true } },
};

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) {}

  async getUserByEmail(
    email: string,
    getPassword = true
  ): Promise<UserResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { ...SIGN_IN_USER_FIELDS, password: getPassword },
    });

    if (!user) return null;

    return new UserResponseDto(user);
  }

  static hasUserRole(user: UserResponseDto, roleName: AllowedRoles) {
    const role = user?.roles.find(({ role }) => role?.name === roleName);
    return Boolean(role);
  }

  async findAll(user: UserResponseDto): Promise<UserResponseDto[]> {
    const authorIsAdmin = UserService.hasUserRole(user, AllowedRoles.ADMIN);

    if (!authorIsAdmin) {
      throw new ForbiddenException(
        'You do not have permission to view all users'
      );
    }

    const users = await this.prisma.user.findMany({
      select: { ...USER_FIELDS },
    });

    return users.map((user) => new UserResponseDto(user));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        ...USER_FIELDS,
        roles: { include: { role: true } },
      },
    });

    if (!user) {
      throw new UnprocessableEntityException('User does not exist.');
    }

    return new UserResponseDto(user);
  }

  async create({
    roles,
    ...createUserDto
  }: CreateUserDto): Promise<UserResponseDto> {
    // Check if user is already stored in database
    const storedUser = await this.getUserByEmail(createUserDto.email);

    if (storedUser) {
      throw new NotAcceptableException(
        `User with the email: '${storedUser.email}' is already registered.`
      );
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
    const salt = await bcrypt.genSalt(saltRounds);

    // Create new user
    const newUser = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, salt),
        roles: {
          createMany: {
            data: roles.map((roleId) => ({ roleId })),
          },
        },
      },
      select: { ...USER_FIELDS },
    });

    return new UserResponseDto(newUser);
  }
}
