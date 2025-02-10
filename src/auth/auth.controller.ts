import { Controller, Post, Body, NotAcceptableException } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

// Services
import { AuthService } from './auth.service';

// Types
import { SigninDto, SigninResponseDto } from './dto/sign-in.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @ApiOkResponse({ type: SigninResponseDto })
  async signIn(@Body() signInDto: SigninDto): Promise<SigninResponseDto> {
    const user = await this.authService.validateUser(
      signInDto.email,
      signInDto.password
    );

    if (!user) {
      throw new NotAcceptableException('Invalid Credentials');
    }

    return this.authService.signin(user);
  }
}
