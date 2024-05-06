/* eslint-disable prettier/prettier */
import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateEventoDto } from './dto/create-evento.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Evento } from './entities/evento.entity';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { createReadStream, createWriteStream, existsSync, mkdirSync } from 'fs';
import { format } from 'date-fns';

import { promisify } from 'util';
import { pipeline } from 'stream';
const pipelineAsync = promisify(pipeline);
@Injectable()
export class EventosService {

  constructor(@InjectRepository(Evento) private eventRepository: Repository<Evento>) { }

  async create(createEventoDto: CreateEventoDto, files: { img_banner: Express.Multer.File[], img_portrait: Express.Multer.File[], img_localidades: Express.Multer.File[], img_vertical: Express.Multer.File[] }) {

    const urlImgPortrait = this.generarNombreUnico(files.img_portrait[0].originalname);
    const urlImgBanner = this.generarNombreUnico(files.img_banner[0].originalname);
    const urlImgLocalidades = this.generarNombreUnico(files.img_localidades[0].originalname);
    const urlImgVertical = this.generarNombreUnico(files.img_vertical[0].originalname);


    createEventoDto.img_banner = urlImgBanner;
    createEventoDto.img_portrait = urlImgPortrait;
    createEventoDto.img_localidades = urlImgLocalidades;
    createEventoDto.img_vertical = urlImgVertical;

    const newEvent = this.eventRepository.create(createEventoDto);
    return this.eventRepository.save(newEvent);
  }



  async update(
    id: number,
    updateEventoDto: UpdateEventoDto,
    files: { img_banner: Express.Multer.File[], img_portrait: Express.Multer.File[], img_localidades: Express.Multer.File[], img_vertical: Express.Multer.File[] },
  ) {
    if (files.img_portrait && files.img_portrait.length > 0 && files.img_portrait[0].originalname) {
      const urlImgPortrait = this.generarNombreUnico(files.img_portrait[0].originalname);
      updateEventoDto.img_portrait = urlImgPortrait;
    }
    if (files.img_banner && files.img_banner.length > 0 && files.img_banner[0].originalname) {
      const urlImgBanner = this.generarNombreUnico(files.img_banner[0].originalname);
      updateEventoDto.img_banner = urlImgBanner;
    }
    if (files.img_localidades && files.img_localidades.length > 0 && files.img_localidades[0].originalname) {
      const urlImgLocalidades = this.generarNombreUnico(files.img_localidades[0].originalname);
      updateEventoDto.img_localidades = urlImgLocalidades;
    }

    if (files.img_vertical && files.img_vertical.length > 0 && files.img_vertical[0].originalname) {
      const urlImgVertical = this.generarNombreUnico(files.img_vertical[0].originalname);
      updateEventoDto.img_vertical = urlImgVertical;
    }

    const evento = await this.eventRepository.findOneBy({ id: id });
    if (!evento) {
      throw new HttpException('Error al actualizar el evento', 500);
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
    const fechaDeHoy = new Date();
    const nombreAleatorio = format(fechaDeHoy, 'yyyy-MM-dd');


    return `${nombreAleatorio}${originalname}`;
  }

}
