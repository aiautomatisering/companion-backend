import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

// Configs
import { configuration } from 'src/lib/config/configuration';

// Services
import { UserService } from 'src/user/user.service';

// Types
import { BaseUserResponseDto, UserResponseDto } from 'src/user/dto/user.dto';
import { SigninResponseDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}
  async validateUser(
    email: string,
    password: string
  ): Promise<UserResponseDto | null> {
    const user = await this.userService.getUserByEmail(email, true);

    if (!user?.password) return null;

    const isMatch = Boolean(bcrypt.compare(password, user.password));

    if (!isMatch) {
      return null;
    }

    return user;
  }

  signin(user: BaseUserResponseDto): SigninResponseDto {
    const payload = { ...user };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: configuration().jwtSecret,
        expiresIn: `${configuration().jwtExpiresIn}s`,
      }),
      user,
    };
  }
}
