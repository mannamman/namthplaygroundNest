import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// guards are executed after each middleware, but before any interceptor or pipe.
// https://velog.io/@junguksim/NestJS-%EB%85%B8%ED%8A%B8-2-Guards

const roleMap = {
  admin: 3,
  editor: 2,
  user: 1,
};

// 권한에 따라서 가중치를 넣어서 체크
const roleCheck = (setRoles: string[], inputRole: string) => {
  const setRole = setRoles[0];
  const setWeight = roleMap[setRole];
  const inputWeight = roleMap[inputRole];
  if (setWeight > inputWeight) {
    return false;
  }
  return true;
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    // const mathRole = () => {
    //   const input_role = user.role;
    //   for (const setRole of roles) {
    //     if (setRole === input_role) {
    //       return true;
    //     }
    //   }
    //   return false;
    // };
    // const originValid = !!user.roles.find((role) => !!roles.find((item) => item === role));
    return user && user.role && !!roleCheck(roles, user.role);
  }
}
