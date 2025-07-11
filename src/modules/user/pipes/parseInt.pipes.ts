import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIdIntPipe implements PipeTransform {
  transform(value: any): number {
    const parsed = Number(value);
    if (isNaN(parsed)) {
      throw new BadRequestException('Invalid userid');
    }
    return parsed;
  }
}
