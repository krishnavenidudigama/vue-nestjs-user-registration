import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';

export type User = {
    id: number;
    name: string;
    email: string;
    password: string;
    age: number;
};

@Injectable()
export class UsersService {
    async  findUserByName(username: string): Promise<User | undefined> {
        return this.users.find(user => user.name === username);
    }

    private users: User[] = [];

    private nextId = 1;

    create(createUserDto: CreateUserDto) {

        const user: User= {
            id: this.nextId++,
            name: createUserDto.name,
            email: createUserDto.email,
            password: createUserDto.password,
            age: createUserDto.age,

        };

        this.users.push(user);

        return {
            message: 'User created successfully!',
            user,
        };
    }

    login(email: string, password: string) {
        const user = this.users.find(
            user => user.email === email,
        );

        if (!user) {
            return null;
        }

        if (user.password !== password) {
            return null;
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            age: user.age,
        };
    }


    // GET /users
    findAll(): User[] {
        return this.users;
    }

    // GET /users/list?page=1&limit=5&name=krish
    getUsers(
        page: number,
        limit: number,
        name?: string,
    ): User[] {

        // Start with all users
        let filteredUsers = this.users;

        // Search by name
        if (name) {
            filteredUsers = filteredUsers.filter(user =>
                user.name.toLowerCase().includes(name.toLowerCase()),
            );
        }

        // Calculate starting index
        const start = (page - 1) * limit;

        // Return only 5 users (or whatever limit is provided)
        return filteredUsers.slice(start, start + limit);
    }
}