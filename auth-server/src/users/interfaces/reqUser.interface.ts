import { UserEntity } from 'src/mysql/entities/user.entity';

export interface reqWithUser {
  user: UserEntity;
}
