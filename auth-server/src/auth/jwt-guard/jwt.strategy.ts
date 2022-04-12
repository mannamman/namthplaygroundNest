import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/*
원본 설명
link : https://docs.nestjs.com/security/authentication#implementing-passport-jwt

With our JwtStrategy, we've followed the same recipe described earlier for all Passport strategies.
This strategy requires some initialization, so we do that by passing in an options object in the super() call.
You can read more about the available options here. In our case, these options are:
  jwtFromRequest: supplies the method by which the JWT will be extracted from the Request. We will use the standard approach of supplying a bearer token in the Authorization header of our API requests. Other options are described here.
  ignoreExpiration: just to be explicit, we choose the default false setting, which delegates the responsibility of ensuring that a JWT has not expired to the Passport module. This means that if our route is supplied with an expired JWT, the request will be denied and a 401 Unauthorized response sent. Passport conveniently handles this automatically for us.
  secretOrKey: we are using the expedient option of supplying a symmetric secret for signing the token. Other options, such as a PEM-encoded public key, may be more appropriate for production apps (see here for more information). In any case, as cautioned earlier, do not expose this secret publicly.

The validate() method deserves some discussion. For the jwt-strategy, Passport first verifies the JWT's signature and decodes the JSON.
It then invokes our validate() method passing the decoded JSON as its single parameter.
Based on the way JWT signing works, we're guaranteed that we're receiving a valid token that we have previously signed and issued to a valid user.

As a result of all this, our response to the validate() callback is trivial: we simply return an object containing the userId and username properties.
Recall again that Passport will build a user object based on the return value of our validate() method, and attach it as a property on the Request object.

It's also worth pointing out that this approach leaves us room ('hooks' as it were) to inject other business logic into the process.
For example, we could do a database lookup in our validate() method to extract more information about the user, resulting in a more enriched user object being available in our Request.
This is also the place we may decide to do further token validation, such as looking up the userId in a list of revoked tokens, enabling us to perform token revocation.
The model we've implemented here in our sample code is a fast, "stateless JWT" model, where each API call is immediately authorized based on the presence of a valid JWT, and a small bit of information about the requester (its userId and username) is available in our Request pipeline.
*/

/*
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        if (!req || !req.cookies) return null;
        return req.cookies['access_token'];
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(data: any): Promise<any> {
    return true;
  }
}
*/
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      // jwtFromRequest : jwt를 어떤 방식으로 받을지
      // ignoreExpiration : 기본적으로 false, 자체적으로 에러를 걸러줌, 시간이 만료가 되었거나, 서명이 다를경우 알아서 401 Unauthorized을 응답
      // secretOrKey : jwt에 서명할 키값
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: (req) => {
        if (!req || !req.cookies) return null;
        return req.cookies['accessCookie'];
      },
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: any) {
    // 먼저 토큰이 들어오면 서명한 암호 검사, 디코딩을 끝내고 이 함수(validate)를 호출을 함
    // 전달받는 값은 디코딩된 json 데이터
    // 해당 결과는 request에 붙여저서 다음 요청단계로 넘어감
    // 이 함수에서는 User객체가 request에 붙여서 들어가서, request.user로 접근이 가능해짐, request.user.role를 바탕으로 RoleGuard로 role 검사를 하고있음.
    // 그런데 어떠한 방식으로 user로 값을 넣엇는지....
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
