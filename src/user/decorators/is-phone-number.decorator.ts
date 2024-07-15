import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { MESSAGES } from 'src/constants/message.constant';

@ValidatorConstraint({ name: 'IsPhoneNumberConstraint', async: true })
@Injectable()
export class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    return this.isValid(value);
  }

  private isValid(phoneNumber: string): boolean {
    const cellPhoneRegex = /^(?:(010)|(01[1|6|7|8|9]))-\d{3,4}-(\d{4})$/;
    return cellPhoneRegex.test(phoneNumber);
  }

  defaultMessage(args: ValidationArguments) {
    return MESSAGES.AUTH.COMMON.PHONE_NUMBER.INVALID_FORMAT;
  }
}
