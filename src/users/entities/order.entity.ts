import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { User } from './user.entity';
import { ItemOrder } from './item-order.entity';
import { Exclude, Expose } from 'class-transformer';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Exclude()
  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Exclude()
  @OneToMany(() => ItemOrder, (item) => item.order)
  items: ItemOrder[];

  @Expose()
  get userDetails() {
    if (this.user) {
      delete this.user.createdAt;
      delete this.user.updatedAt;
      delete this.user.deletedAt;
      return this.user;
    }
    return null;
  }

  @Expose()
  get products() {
    if (this.items) {
      return this.items
        .filter((item) => !!item)
        .map((item) => {
          delete item.product.createdAt;
          delete item.product.updatedAt;
          delete item.product.deletedAt;
          return {
            ...item.product,
            quantity: item.quantity,
            itemId: item.id,
          };
        });
    }
    return [];
  }

  @Expose()
  get total() {
    if (this.items) {
      return this.items
        .filter((item) => !!item)
        .reduce((total, item) => {
          const subTotal = item.quantity * item.product.price;
          return total + subTotal;
        }, 0);
    }
    return 0;
  }
}
