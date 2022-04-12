import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/mysql/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpResDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(user: UserEntity): Promise<SignUpResDto> {
    const exsits = await this.findOne(user.email);
    if (exsits) {
      return { ok: false, error: 'already exsits' };
    }
    try {
      const curUser = this.userRepository.create(user);
      await this.userRepository.insert(curUser);
      return { ok: true, error: '' };
    } catch (e) {
      console.log(e);
      return { ok: false, error: 'someting error' };
    }
  }

  findAll(): Promise<UserEntity[] | undefined> {
    return this.userRepository.find();
  }

  findOne(email: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({ email: email });
  }
}
