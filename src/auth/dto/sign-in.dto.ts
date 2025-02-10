import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { UserSigninResponseDto } from 'src/user/dto/user.dto';

// Validations
export class SigninDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  password: string;
}

// Responses
export class SigninResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  user: UserSigninResponseDto;
}
