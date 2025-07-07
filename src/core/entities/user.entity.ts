import { Email } from '@core/value-objects/email.vo';
import { Name } from '@core/value-objects/name.vo';
import { v4 as uuid } from 'uuid';


export class User {
  id: string;
  email: Email;
  name: Name;

  constructor(
    email: Email,
    name: Name,
    id?: string,
  ) {
    this.id = id || uuid(); // Default to 0 if not provided
    this.email = email;
    this.name = name;
  }

}
