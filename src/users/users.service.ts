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
  private userRepositorty: Repository<User>,
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
    const newUser = this.userRepositorty.create(user);
    return this.userRepositorty.save(newUser);
  }




  async update(id: number, user: UpdateUserDto) {
    const existingUser = await this.userRepositorty.findOneBy({ id: id });

    // Si el usuario no existe, lanzar un error 404 (Not Found)
    if (!existingUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Actualizar las propiedades del usuario existente con las nuevas propiedades
    Object.assign(existingUser, user);

    // Guardar los cambios en la base de datos
    return await this.userRepositorty.save(existingUser);
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
      throw new BadRequestException('Password is incorrect');
    }
    const payload = { sub: userExist.id, email: userExist.email };

    const access_token = this.jwtService.sign(payload);
    const data = { userId: userExist.id, email: userExist.email, access_token };

    return data;
  }

  async getUsers() {

    return this.userRepositorty.find();
  }

  async getUserById(userId: number) {
    const user = await this.userRepositorty.findOneBy({
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
