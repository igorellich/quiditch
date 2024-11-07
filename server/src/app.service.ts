import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getGreetingMessage(name: string): string {
    return `Hello ${name}!`;
  }
}
