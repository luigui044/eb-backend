/* eslint-disable prettier/prettier */
import { Controller, Post, Body, UseGuards, Patch, Param, Get } from '@nestjs/common';
import { EventosService } from './eventos.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { AuthGuard } from '../auth/auth.guards';
import { UpdateEventoDto } from './dto/update-evento.dto';

@Controller('eventos')
export class EventosController {
  constructor(private readonly eventosService: EventosService,) { }


  @UseGuards(AuthGuard)
  @Post('crear-evento')
  create(@Body() createEventoDto: CreateEventoDto) {
    return this.eventosService.create(createEventoDto);
  }

  @UseGuards(AuthGuard)
  @Patch('actualizar-evento/:id')
  update(@Param('id') id: number, @Body() updateEventoDto: UpdateEventoDto) {
    return this.eventosService.update(id, updateEventoDto);
  }

  @UseGuards(AuthGuard)
  @Get('listar-eventos')
  getAllEvents() {
    return this.eventosService.getAll();
  }

  @UseGuards(AuthGuard)
  @Get('listar-eventos/:id')
  getEventById(@Param('id') id: number) {
    return this.eventosService.getOneById(id);
  }


}
