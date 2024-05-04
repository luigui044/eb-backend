/* eslint-disable prettier/prettier */
import { Controller, Post, Body, UseGuards, Patch, Param, Get, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { EventosService } from './eventos.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { AuthGuard } from '../auth/auth.guards';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('eventos')
export class EventosController {
  constructor(private readonly eventosService: EventosService,) { }


  @UseGuards(AuthGuard)
  @Post('crear-evento')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'img_banner', maxCount: 1 },
    { name: 'img_portrait', maxCount: 1 },

  ], {
    storage: diskStorage({
      destination: './uploads', filename: function (req, file, cb) {
        const nombreAleatorio = Array(32)
          .fill(null)
          .map(() => (Math.round(Math.random() * 16)).toString(16))
          .join('');

        const extension = extname(file.originalname);
        cb(null, `${nombreAleatorio}${extension}`)
      }
    })
  }))
  create(@Body() createEventoDto: CreateEventoDto, @UploadedFiles() files) {
    return this.eventosService.create(createEventoDto, files);
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
