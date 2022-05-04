import {
  Controller,
  Get,
  Post,
  UseGuards,
  HttpCode,
  Response,
  Request,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { FastifyRequest, FastifyReply } from 'fastify';
import { LocalAuthGuard } from './local-guard/local-auth.guard';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { SignInUserDto, SignUpResDto, SignUpReqDto } from 'src/users/dto/user.dto';
import { reqWithUser } from 'src/users/interfaces/reqUser.interface';
import { JwtAuthGuard } from './jwt-guard/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}
  /*
  LocalAuthGruad는 validUser를 호출, 회원인지 아닌지 판단(email, password)
  request 객체에 user 속성이 LocalAuthGurad후에 붙여져서 나옴
  그 후 아래의 함수(login)은 이미 회원인지 아닌지 판단이 끝났으므로, 바로 jwt를 생성하는 함수 호출
  */
  @Post('signin')
  @HttpCode(302)
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: SignInUserDto })
  @ApiResponse({
    status: 302,
    description: 'sign in success and redirect to member page',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(
    @Request() req: reqWithUser,
    @Response({ passthrough: true }) response: FastifyReply,
  ): Promise<string> {
    const { access_token, ...accessOption } = this.authService.getAccessToken(req.user);
    response.setCookie('accessCookie', access_token, accessOption);
    response.redirect('https://www.namthplayground.com');
    return response;
  }

  @Post('signup')
  @HttpCode(201)
  @ApiResponse({ type: SignUpResDto })
  singup(@Body() createUserDto: SignUpReqDto): Promise<SignUpResDto> {
    return this.authService.signup(createUserDto);
  }

  @Get('signout')
  @HttpCode(302)
  @UseGuards(JwtAuthGuard)
  async logout(@Response({ passthrough: true }) response: FastifyReply) {
    const { accessOption } = this.authService.getCookiesForLogOut();
    response.setCookie('accessCookie', '', accessOption);
    response.redirect('https://www.namthplayground.com');
    return response;
  }
}
