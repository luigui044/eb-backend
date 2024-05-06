/* eslint-disable prettier/prettier */
import { Controller, Post, Body, UseGuards, Patch, Param, Get, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { EventosService } from './eventos.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { AuthGuard } from '../auth/auth.guards';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { format } from 'date-fns';

@Controller('eventos')
export class EventosController {
  constructor(private readonly eventosService: EventosService,) { }


  @UseGuards(AuthGuard)
  @Post('crear-evento')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'img_banner', maxCount: 1 },
    { name: 'img_portrait', maxCount: 1 },
    { name: 'img_localidades', maxCount: 1 },
    { name: 'img_vertical', maxCount: 1 },

  ], {
    storage: diskStorage({
      destination: './uploads', filename: function (req, file, cb) {
        const fechaDeHoy = new Date();
        const nombreAleatorio = format(fechaDeHoy, 'yyyy-MM-dd');


        cb(null, `${nombreAleatorio}${file.originalname}`)
      }
    })
  }))
  create(@Body() createEventoDto: CreateEventoDto, @UploadedFiles() files) {
    return this.eventosService.create(createEventoDto, files);
  }

  @UseGuards(AuthGuard)
  @Patch('actualizar-evento/:id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'img_banner', maxCount: 1 },
    { name: 'img_portrait', maxCount: 1 },
    { name: 'img_localidades', maxCount: 1 },
    { name: 'img_vertical', maxCount: 1 },

  ], {
    storage: diskStorage({
      destination: './uploads',
      filename: function (req, file, cb) {
        try {
          const fechaDeHoy = new Date();
          const nombreAleatorio = format(fechaDeHoy, 'yyyy-MM-dd');
          cb(null, `${nombreAleatorio}${file.originalname}`)
        } catch (error) {
          cb(error, null);
        }
      }
    })
  }))
  async update(
    @Param('id') id: number,
    @Body() updateEventoDto: UpdateEventoDto,
    @UploadedFiles() files,
  ) {
    return await this.eventosService.update(id, updateEventoDto, files);
  }


  @Get('listar-eventos')
  getAllEvents() {
    return this.eventosService.getAll();
  }


  @Get('listar-eventos/:id')
  getEventById(@Param('id') id: number) {
    return this.eventosService.getOneById(id);
  }


}
