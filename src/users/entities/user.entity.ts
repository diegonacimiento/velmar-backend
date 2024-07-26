import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { Order } from './order.entity';
import { Cart } from './cart.entity';
import { ROLE } from '../../auth/models/role.model';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 75 })
  fullname: string;

  @Column({ type: 'enum', enum: ROLE, default: ROLE.CUSTOMER })
  role: ROLE;

  @Column({ type: 'varchar', length: 45, default: null })
  phone: number;

  @Column({ type: 'simple-json', default: null })
  address: {
    street: string;
    apartment: string;
    city: string;
    state: string;
    country: string;
  };

  @Exclude()
  @Column({ type: 'varchar', length: 555, default: null })
  recoveryToken: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: null,
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', default: null })
  deletedAt: Date;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToOne(() => Cart, (cart) => cart.user, { cascade: true })
  cart: Cart;
}
