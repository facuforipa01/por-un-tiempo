import { forwardRef, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt'
import { UsuarioDto } from "../usuarios.dto";
import { Role } from "../usuarios.entity";
import { UsuariosService } from "../usuarios.service";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @Inject(forwardRef(() => UsuariosService))
        private userService: UsuariosService
    ) { }

    /**
     * @param password new user's pasword
     * @returns hashed password
     */
    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 12);
    }

    /**
     * @description compares login password with stored
     * @param password input password
     * @param hashPassword sored user's password
     * @returns boolean
     */
    async comparePassword(
        password: string,
        hashPassword: string,
    ): Promise<boolean> {
        return bcrypt.compare(password, hashPassword)
    }

    /**
     * @description compare user session jwt
     * @param jwt jwt from client
     * @returns payload
     */
    async verifyJwt(jwt: string): Promise<any> {
        return await this.jwtService.verifyAsync(jwt)
    }

    /**
     * @param Usuario
     * @returns token generado
     */
    async generateJwt(user: UsuarioDto): Promise<string> {
        /**
         * @description
         *  creamos el payload con la informacion del usuario
         */
        const payload = {
            sub: user.id,
            email: user.email,
            nombre: user.nombre,
        }
        // retornamos el token
        return this.jwtService.signAsync(payload)
    }

    async verificarRol(role: Role, token: string) {
        try {
            const decodedUser = await this.verifyJwt(token);
            const usuario = await this.userService.getOne(decodedUser.sub)


            return role.includes(usuario.role)
        } catch (error) {
            throw new UnauthorizedException('token no valido')
        }
    }


}