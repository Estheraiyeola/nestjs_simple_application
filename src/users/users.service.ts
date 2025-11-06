
import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
  {
    "id": 1,
    "name": "Edwin John",
    "email": "edwinjohn@example.com",
    "role": "superAdmin",
    "password": "12345Pass"
  },
  {
    "id": 2,
    "name": "Jackson Page",
    "email": "jp@example.com",
    "role": "admin",
    "password": "1234567Pass"
  },
  {
    "id": 3,
    "name": "Larry Adam",
    "email": "ladam@example.com",
    "role": "staff",
    "password": "123456789Pass"
  }
]

  async findOne(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }
}
