import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('guests', { schema: 'socketchat' })
export class Guests {
    @PrimaryGeneratedColumn({ type: 'int', name: 'guest_id' })
    guestId: number;

    @Column('varchar', { name: 'guest_name', length: 255 })
    guestName: string;

    @Column('datetime', { name: 'expire_on' })
    expireOn: Date;
}
