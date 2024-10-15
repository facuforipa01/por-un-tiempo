import { Controller, Get } from '@nestjs/common';
import { MailerServiceService } from './mailer.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class MailerController {
  constructor(private readonly mailerServiceService: MailerServiceService) {}

@EventPattern('send-mail')
  sendMail(@Payload() payload: any): string {
      console.log(payload)
    return this.mailerServiceService.getHello();
  }
}
