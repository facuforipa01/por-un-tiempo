import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../auth.service';
import { UsuariosService } from '../../../usuarios.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
constructor(
  private readonly authService: AuthService,
  private readonly usuariosService: UsuariosService,
) {}

  async use(req: any, res: any, next: () => void) {
    try {
      // obtenemos el token desde el headers de la peticion y lo separamos de "Bearer"
      const tokenArray: string[] = req.headers['authorization'].split(' ')

      const decodedToken = await this.authService.verifyJwt(tokenArray[1])

      if (decodedToken) {
        const usuario = await this.usuariosService.getOne(decodedToken.sub)
        if (usuario) next()
          else throw new UnauthorizedException('Token invalido 1')
      } else {
        throw new UnauthorizedException('Token invalido 2')
      }
    } catch (err) {
      console.log(err)
      throw new UnauthorizedException('Token invalido 3')
    }
  }
}
