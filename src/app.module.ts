/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EventosModule } from './eventos/eventos.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'extraboletas',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,

    }),
    UsersModule,
    JwtModule.registerAsync(
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '1h' },
          global: true
        })
      }
    ),
    EventosModule

  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule { }