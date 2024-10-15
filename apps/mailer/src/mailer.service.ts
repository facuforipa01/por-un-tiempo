import { Injectable } from '@nestjs/common';

@Injectable()
export class MailerServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
