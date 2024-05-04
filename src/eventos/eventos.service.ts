/* eslint-disable prettier/prettier */
import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateEventoDto } from './dto/create-evento.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Evento } from './entities/evento.entity';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { createReadStream, createWriteStream, existsSync, mkdirSync } from 'fs';

import { extname } from 'path';
import { promisify } from 'util';
import { pipeline } from 'stream';
const pipelineAsync = promisify(pipeline);
@Injectable()
export class EventosService {

  constructor(@InjectRepository(Evento) private eventRepository: Repository<Evento>) { }

  async create(createEventoDto: CreateEventoDto, files: { img_banner: Express.Multer.File[], img_portrait: Express.Multer.File[] }) {

    const urlImgPortrait = this.generarNombreUnico(files.img_banner[0].originalname);
    const urlImgBanner = this.generarNombreUnico(files.img_portrait[0].originalname);


    createEventoDto.img_banner = urlImgBanner;
    createEventoDto.img_portrait = urlImgPortrait;

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

  async guardarImagen(imagen: any): Promise<string> {
    // Verificar si se proporcionó una imagen
    if (!imagen) {
      throw new BadRequestException('No se proporcionó ninguna imagen');
    }

    try {
      // Generar un nombre único para la imagen

      const nombreImagen = this.generarNombreUnico(imagen[0].originalname);

      // Guardar la imagen en el servidor
      await this.guardarArchivo(imagen, nombreImagen);
      // Retornar la URL de la imagen
      return `/uploads/${nombreImagen}`;
    } catch (error) {

      throw new InternalServerErrorException('Error al guardar la imagen');
    }
  }

  private async guardarArchivo(imagen: any, nombreArchivo: string): Promise<void> {
    const directorio = './uploads';
    if (!existsSync(directorio)) {
      mkdirSync(directorio);
    }
    const stream = createReadStream(imagen.path);

    const writeStream = createWriteStream(`${directorio}/${nombreArchivo}`);


    await pipelineAsync(stream, writeStream);
  }

  private generarNombreUnico(originalname: string): string {
    // Generar un nombre único para la imagen
    const nombreAleatorio = Array(32)
      .fill(null)
      .map(() => (Math.round(Math.random() * 16)).toString(16))
      .join('');

    const extension = extname(originalname);
    return `${nombreAleatorio}${extension}`;
  }

}
