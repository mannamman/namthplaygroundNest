import {
  Controller,
  Get,
  Request,
  UseGuards,
  Render,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-guard/jwt-auth.guard';
import { RolesGuard } from '../auth/roles-guard/role.guard';
import { Roles } from '../auth/roles-guard/roles.decorator';

@ApiTags('user')
// RoleGouard를 해당 함수 전체 영역으로 선언
@UseGuards(RolesGuard)
// Jwt을 먼저 검사 후, validate함수의 결과를 request에 붙여서 요청단계를 이어감
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UsersController {
  constructor(
    private readonly userservice: UsersService,
    private readonly logger: Logger,
  ) {}
  // @Roles('user')은 canActivate를 호출해서 실행되는 것 같음
  @Roles('user')
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Roles('user')
  @Get('index')
  @Render('index.hbs')
  index() {
    return { message: 'Hello world!' };
  }
}
