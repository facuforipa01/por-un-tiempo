import { Module } from '@nestjs/common';
import { MailerController } from './mailer.controller';
import { MailerServiceService } from './mailer.service';

@Module({
  imports: [],
  controllers: [MailerController],
  providers: [MailerServiceService],
})
export class MailerModule {}
