import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Generated,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';

export enum UserRoles {
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user',
}

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  index: number;

  @Column({ type: 'binary', nullable: true })
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'varchar', nullable: false, length: 50 })
  email: string;

  // bcrypt의 암호길이는 60
  @Column({ type: 'varchar', nullable: false, length: 60 })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRoles,
    nullable: true,
    default: UserRoles.USER,
  })
  role: UserRoles;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
/*
GRANT 권한 ON 데이터베이스.테이블 TO '아이디'@'호스트' IDENTIFIED BY '비밀번호'
+--------------+-------------------------------+------+-----+---------+----------------+
| Field        | Type                          | Null | Key | Default | Extra          |
+--------------+-------------------------------+------+-----+---------+----------------+
| index        | int                           | NO   | PRI | NULL    | auto_increment |
| uuid         | varchar(36)                   | YES  |     | NULL    |                |
| email        | varchar(50)                   | NO   |     | NULL    |                |
| password     | varchar(60)                   | NO   |     | NULL    |                |
| role         | enum('admin','editor','user') | YES  |     | user    |                |
+--------------+-------------------------------+------+-----+---------+----------------+
*/
