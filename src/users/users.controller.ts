/* eslint-disable prettier/prettier */
import { Controller, Post, Body, UseGuards, Get, Param, Req, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user-dto';
import { AuthGuard } from 'src/auth/auth.guards';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  @Post('signin')
  signin(@Body() singninUserDto: LoginUserDto) {
    return this.usersService.signin(singninUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('get-users')
  async getUsers() {

    const result = await this.usersService.getUsers();
    return result;

  }
  @UseGuards(AuthGuard)
  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const result = await this.usersService.create(createUserDto);
      return result;
    } catch (error) {

      throw new Error('No se pudo crear el usuario');
    }
  }


  @UseGuards(AuthGuard)
  @Post('update-user/:id')
  async updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {


    try {
      const result = await this.usersService.update(id, updateUserDto);
      return { success: true, data: result, message: 'Usuario actualizado correctamente' };
    } catch (error) {
      console.log(error)
      throw new HttpException('No se pudo actualizar el usuario', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @UseGuards(AuthGuard)
  @Get('get-user/:id')
  async getUser(@Param('id') id: number) {
    return await this.usersService.getUserById(id);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Req() req) {
    const token = req.headers.authorization.split(' ')[1];
    this.usersService.addToBlacklist(token);
    return { message: 'Token invalidado exitosamente' };
  }

}
