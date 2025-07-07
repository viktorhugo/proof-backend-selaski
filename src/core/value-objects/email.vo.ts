import { InvalidValueObjectException } from '@core/exceptions/domain-exceptions';

export class Email {
  private readonly value: string;

  constructor(email: string) {
    if (!this.isValid(email)) {
      throw new InvalidValueObjectException('Invalid email format');
    }
    this.value = email.toLowerCase().trim();
  }

  private isValid(email: string): boolean {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  }

  getValue(): string {
    return this.value;
  }

  equals(email: Email): boolean {
    return this.value === email.getValue();
  }
}
