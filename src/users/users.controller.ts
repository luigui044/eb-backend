/* eslint-disable prettier/prettier */
import { Controller, Post, Body, UseGuards, Get, Param, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user-dto';
import { AuthGuard } from 'src/auth/auth.guards';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('signin')
  signin(@Body() singninUserDto: LoginUserDto) {
    return this.usersService.signin(singninUserDto);
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
