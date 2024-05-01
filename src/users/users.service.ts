/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { LoginUserDto } from './dto/login-user-dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UsersService {

  constructor(@InjectRepository(User)
  private userRepositorty: Repository<User>,
    private jwtService: JwtService) {

  }



  async create(user: CreateUserDto) {
    const { password } = user;
    const plainToHash = await hash(password, 10);
    user = { ...user, password: plainToHash };
    const newUser = this.userRepositorty.create(user);
    return this.userRepositorty.save(newUser);
  }

  async signin(user: LoginUserDto) {
    const { email, password } = user;
    const userExist = await this.userRepositorty.findOneBy({
      email: email,
    });
    if (!userExist) {
      return new HttpException('User not found', 404);
    }

    const checkPassword = await compare(password, userExist.password);

    if (!checkPassword) {
      return new HttpException('Password is incorrect', 403);
    }
    const payload = { sub: userExist.id, email: userExist.email };

    const access_token = this.jwtService.sign(payload);
    const data = { ...userExist, access_token };

    return data;
  }

}
