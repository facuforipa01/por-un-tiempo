import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuarios } from './usuarios.entity';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { saveImagesToStorage } from './helpers/image.storage';
import { envs } from 'src/config';

@Module({
  imports:[
  TypeOrmModule.forFeature([Usuarios]),
  JwtModule.register({
      secret: envs.jwt,
      signOptions: {
        expiresIn: '24h',
      },
}),
MulterModule.register({
  dest: './uploads',
  fileFilter: saveImagesToStorage('avatar').fileFilter,
  storage: saveImagesToStorage('avatar').storage
}),
],
  controllers: [UsuariosController],
  providers: [UsuariosService, AuthService],
  exports: [AuthService, UsuariosService]
})
export class UsuariosModule {}
