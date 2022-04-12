import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // 기본적으로 로컬은 username을 예상하므로 email로 변경해서 전달을 위해 parent에게 전달
    super({ usernameField: 'email', passwordField: 'password' });
  }
  /*
  우리는 또한 validate()메소드를 구현했습니다.
  각 전략에 대해 Passport는 적절한 전략별 매개 변수 세트를 사용하여 verify 함수 (@nestjs/passport의 validate()메소드로 구현)를 호출합니다.
  로컬 전략의 경우 Passport는 validate(email: string, password: string): any서명이 있는 validate()메소드를 예상합니다.
  */
  // 이 함수 또한 요청(request)에 user객체를 붙여서 반환(request.user)
  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
