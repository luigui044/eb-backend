/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateEventoDto } from './create-evento.dto';

export class UpdateEventoDto extends PartialType(CreateEventoDto) {

    nombre_evento?: string;
    ubicacion?: string;
    descripcion_adicional?: string;
    img_banner?: string;
    img_portrait?: string;
    fecha_evento?: Date;
}
