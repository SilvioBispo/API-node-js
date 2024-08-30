import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Url } from "url";

@Entity()
export class Image{

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    url!: Url | string;

    @Column()
    tp!: string;

    @Column()
    value!: number;

    @Column()
    uuid!: number;

    @Column()
    dt!: Date;

    @Column()
    cmcode!: string;


    



}