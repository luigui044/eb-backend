/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('t_eventos')
export class Evento {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 150, })
    nombre_evento: string;

    @Column({ type: 'varchar', length: 150, })
    ubicacion: string;
    @Column({ type: 'varchar', length: 200, })
    descripcion_adicional: string;

    @Column({ type: 'varchar', length: 255, })
    img_banner: string;

    @Column({ type: 'varchar', length: 255, })
    img_portrait: string;

    @Column({ type: 'datetime' })
    fecha_evento: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'tinyint', default: 1 })
    estado: number;

}
