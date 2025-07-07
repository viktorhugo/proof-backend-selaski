import { InvalidValueObjectException } from '@core/exceptions/domain-exceptions';

export class Name {
  private readonly value: string;

  constructor(name: string) {
    if (!this.isValid(name)) {
      throw new InvalidValueObjectException('Invalid name format');
    }
    this.value = this.formatName(name);
  }

  private isValid(name: string): boolean {
    return typeof name === 'string' && name.trim().length > 0 && name.trim().length <= 50;
  }

  private formatName(name: string): string {
    return name.trim();
  }

  getValue(): string {
    return this.value;
  }

  equals(name: Name): boolean {
    return this.value === name.getValue();
  }
}

