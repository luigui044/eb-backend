/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from '@nestjs/common';
import { CreateEventoDto } from './dto/create-evento.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Evento } from './entities/evento.entity';
import { UpdateEventoDto } from './dto/update-evento.dto';

@Injectable()
export class EventosService {

  constructor(@InjectRepository(Evento) private eventRepository: Repository<Evento>) { }

  async create(createEventoDto: CreateEventoDto) {

    const newEvent = this.eventRepository.create(createEventoDto);
    return this.eventRepository.save(newEvent);
  }


  async update(id: number, updateEventoDto: UpdateEventoDto) {

    const evento = await this.eventRepository.findOneBy({
      id: id
    })

    if (!evento) {
      return new HttpException('error al actualizar el evento', 500)
    }

    Object.assign(evento, updateEventoDto);

    return await this.eventRepository.save(evento);
  }

  async getAll() {
    const eventos = await this.eventRepository.find();

    if (!eventos) {

      return new HttpException('Ningun evento encontrado', 404)
    }

    return eventos;

  }

  async getOneById(id: number) {
    const evento = await this.eventRepository.findOneBy({
      id: id
    });

    if (!evento) {

      return new HttpException('Ningun evento encontrado', 404)
    }

    return evento;
  }

}
