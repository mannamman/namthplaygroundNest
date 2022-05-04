import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpResDto } from 'src/users/dto/user.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  getAccessToken(user: any): any {
    const payload = {
      iss: 'namthplayground',
      aud: 'namthplayground',
      email: user.email,
      role: user.role,
      sub: user.uuid,
    };
    const accessCookie = {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn:
          this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRE') + 's',
      }),
      httpOnly: true,
      maxAge: this.configService.get<number>('JWT_ACCESS_TOKEN_EXPIRE') * 6,
      path: '/',
      sameSite: true,
      secure: true,
      // signed: true,
    };
    return accessCookie;
  }

  getCookiesForLogOut() {
    return {
      accessOption: {
        httpOnly: true,
        maxAge: 0,
        path: '/',
        sameSite: true,
        secure: true,
      },
    };
  }

  signup(user: any): Promise<SignUpResDto> {
    return this.usersService.create(user);
  }
}
