import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateEditorialDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
