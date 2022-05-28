import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users', { schema: 'socketchat' })
export class Users {
    @PrimaryGeneratedColumn({ type: 'int', name: 'user_id' })
    userId: number;

    @Column('varchar', { name: 'user_name', length: 255 })
    userName: string;

    @Column('varchar', { name: 'password', length: 255 })
    password: string;
}
