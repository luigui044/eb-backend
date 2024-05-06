/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateEventoDto } from './create-evento.dto';

export class UpdateEventoDto extends PartialType(CreateEventoDto) {

    nombre_evento: string;
    responsable?: string;
    ubicacion?: string;
    ciudad?: string;

    link_compra?: string;
    descripcion_adicional?: string;
    img_banner?: any;
    img_portrait?: any;
    img_localidades?: any;
    img_vertical?: any;
    fecha_evento?: Date;
    hora?: string;

    estado?: number;

}
