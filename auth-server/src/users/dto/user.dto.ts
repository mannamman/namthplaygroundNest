import { CommonUserDto } from './common-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from 'src/mysql/entities/user.entity';

export class SignUpReqDto extends CommonUserDto {
  @ApiProperty({
    example: 'example@example.com',
    nullable: false,
    maxLength: 50,
  })
  email: string;

  @ApiProperty({ example: 'userPassword!', nullable: false, maxLength: 60 })
  password: string;

  @ApiProperty({
    example: 'user',
    description: 'user role',
    default: 'user',
    enum: UserRoles,
  })
  role: string;
}

export class SignInUserDto extends CommonUserDto {
  @ApiProperty({
    example: 'example@example.com',
    nullable: false,
    maxLength: 50,
  })
  email: string;

  @ApiProperty({ example: 'userPassword!', nullable: false, maxLength: 60 })
  password: string;
}

export class SignUpResDto {
  @ApiProperty({
    type: Boolean,
    nullable: false,
  })
  ok: boolean;
  @ApiProperty({
    type: String,
    nullable: false,
  })
  error: string;
}
