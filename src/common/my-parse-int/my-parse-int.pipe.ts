import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class MyParseIntPipe implements PipeTransform {
  transform(value: string) {
    const result = Number(value);

    if (isNaN(result)) {
      throw new BadRequestException(`${value} is not an integer`);
    }

    return result;
  }
}
