import { ConsoleLogger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggerService extends ConsoleLogger {
  constructor(
    private readonly configService: ConfigService,
  ) {
    super();
  }

  log(message: any, context?: string) {
    super.log(`${message}  `, context);
  }

  error(message: any, context?: string) {
    if (this.configService.get('ERROR_LOG') == 'true') {
      super.error(`${message} `, context);
    }
  }

  debug(message: any, context?: string) {
    if (this.configService.get('DEBUG_LOG') == 'true') {
      super.debug(`${message} `, context);
    }
  }
}
