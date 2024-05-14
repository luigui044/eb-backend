/* eslint-disable prettier/prettier */
import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { LoginUserDto } from './dto/login-user-dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UsersService {

  constructor(@InjectRepository(User)
  private userRepository: Repository<User>,
    private jwtService: JwtService) {

  }

  private readonly blacklist: string[] = [];

  addToBlacklist(token: string) {
    this.blacklist.push(token);
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklist.includes(token);
  }

  async create(user: CreateUserDto) {

    const { password } = user;
    const plainToHash = await hash(password, 10);
    user = { ...user, password: plainToHash };
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }




  async update(id: number, user: UpdateUserDto) {
    const existingUser = await this.userRepository.findOneBy({ id: id });

    if (!existingUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.password) {
      user.password = await hash(user.password, 10);
    }

    Object.assign(existingUser, user);

    return await this.userRepository.save(existingUser);
  }


  async signin(user: LoginUserDto) {
    const { email, password } = user;
    const userExist = await this.userRepository.findOneBy({
      email: email,
    });
    if (!userExist) {
      return new HttpException('User not found', 404);
    }

    const checkPassword = await compare(password, userExist.password);

    if (!checkPassword) {
      throw new BadRequestException('Password is incorrect');
    }
    const payload = { sub: userExist.id, email: userExist.email };

    const access_token = this.jwtService.sign(payload);
    const data = { userId: userExist.id, email: userExist.email, access_token };

    return data;
  }

  async getUsers() {

    return this.userRepository.find();
  }

  async getUserById(userId: number) {
    const user = await this.userRepository.findOneBy({
      id: userId
    })
    if (user) {
      return {
        id: userId,
        name: user.name,
        email: user.email,
        cedula: user.cedula,
        rol: user.rol,
        password: user.password,
      };
    }
    else {
      return false
    }


  }

}
