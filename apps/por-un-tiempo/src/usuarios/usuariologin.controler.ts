import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth/auth.service";
import { Response } from "express";



@Controller('usuario')
export class UsuarioLoginControler {
  constructor(private readonly auth: AuthService){}

  @Post('/check')
  async checkToken(@Body('token') token:string, @Res() res:Response){
    try{
      console.log(token)
      const isValid = await this.auth.verifyJwt(token);
      if(isValid) res.status(HttpStatus.OK).json({ok:true})
        else res.status(HttpStatus.UNAUTHORIZED).json({ok:false})
    } catch (err:any){
      console.error(err);
      res.status(HttpStatus.UNAUTHORIZED).json({ok:false})
    }
  }
}
