/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { EventosService } from './eventos.service';
import { EventosController } from './eventos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evento } from './entities/evento.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({

  imports: [TypeOrmModule.forFeature([Evento]), ConfigModule.forRoot()
  ],
  controllers: [EventosController],
  providers: [EventosService, JwtService],

})
export class EventosModule { }
