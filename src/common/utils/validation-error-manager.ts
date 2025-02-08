import { ValidationError } from 'class-validator';

export class ValidationErrorManager {
  validaitonErrors: ValidationError[] = [];

  push(property: string, constraintLabel: string) {
    const existingError = this.validaitonErrors.find(
      (validaitonError) => validaitonError.property === property,
    );
    if (existingError) {
      existingError.constraints = {
        ...existingError.constraints,
        [constraintLabel]: constraintLabel,
      };
    } else {
      this.validaitonErrors.push({
        property,
        constraints: {
          [constraintLabel]: constraintLabel,
        },
      });
    }
  }

  isEmpty() {
    return this.validaitonErrors.length === 0;
  }
}
