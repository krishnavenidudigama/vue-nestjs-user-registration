import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity('users')
export class UserTable {
    //Automatically creates an id: 1, 2, 3,...
    @PrimaryGeneratedColumn()
    id: number;

    //user's name
    @Column()
    name: string;

    //user's email
    @Column()
    email: string;

    //user's password
    @Column()
    password: string;

    //user's age
    @Column()
    age: number;
}