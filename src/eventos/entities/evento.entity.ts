/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('t_eventos')
export class Evento {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 150, })
    nombre_evento: string;

    @Column({ type: 'varchar', length: 150, })
    responsable: string;

    @Column({ type: 'varchar', length: 150, })
    ubicacion: string;

    @Column({ type: 'varchar', length: 150, })
    ciudad: string;

    @Column({ type: 'varchar', length: 255, })
    link_compra: string;

    @Column({ type: 'varchar', length: 200, })
    descripcion_adicional: string;


    @Column({ type: 'varchar', length: 255, })
    img_banner: string;

    @Column({ type: 'varchar', length: 255, })
    img_portrait: string;

    @Column({ type: 'varchar', length: 255, })
    img_localidades: string;

    @Column({ type: 'varchar', length: 255, })
    img_vertical: string;


    @Column({ type: 'datetime' })
    fecha_evento: Date;

    @Column({ type: 'varchar', length: 150 })
    hora: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'int', default: 1 })
    estado: number;

}
