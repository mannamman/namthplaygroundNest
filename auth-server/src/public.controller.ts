import { Controller, Get, Post, Render, HttpCode, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { SignUpReqDto, SignUpResDto } from './users/dto/user.dto';

@ApiTags('public')
@Controller()
export class PublicController {
  constructor(private readonly authService: AuthService) {}
  @Get('signin')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'print sing in from' })
  @Render('login.hbs')
  loginPage(): void {
    return;
  }

  @Post('signup')
  @HttpCode(201)
  @ApiResponse({ type: SignUpResDto })
  singup(@Body() createUserDto: SignUpReqDto): Promise<SignUpResDto> {
    return this.authService.signup(createUserDto);
  }

  @Get('ping')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'for health check'})
  healthCheck(): string {
    return 'pong';
  }
}
