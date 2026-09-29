
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';

/*
  This is the safe user record returned by our API.
  Notice that it does NOT contain a password.
*/
type UserRecord = {
  id: number;
  name: string;
  email: string;
  age: number;
};

@Injectable()
export class UsersService {

  /*
    Temporary in-memory storage.
  */
  private users: UserRecord[] = [];

  // Generate simple IDs for this practice project.
  private nextId = 1;

  // Create a user from the submitted DTO.
  create(createUserDto: CreateUserDto) {

    /*
      The password is deliberately not stored
    */
    const user: UserRecord = {
      id: this.nextId++,
      name: createUserDto.name,
      email: createUserDto.email,
      age: createUserDto.age,
    };

    this.users.push(user);

    return {
      message: 'User created successfully!',
      user,
    };
  }

  // Return all stored users without passwords.
  findAll(): UserRecord[] {
    return this.users;
  }
}