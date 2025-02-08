import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  rememberMe?: boolean;
}

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsString()
  @IsNotEmpty()
  passwordConfirmation: string;
}
