import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  Column,
} from 'typeorm';

import { User } from './user.entity';
import { Expose } from 'class-transformer';
import { Size } from 'src/products/types/product';
// import { Exclude, Expose } from 'class-transformer';

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

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('simple-json', { nullable: true })
  products: Array<{
    id: number;
    name: string;
    quantity: number;
    size: Size;
    price: string;
    brand: { id: number; name: string; isProtected: boolean };
  }>;

  @Column({ type: 'varchar', default: 'in-progress' })
  status: string;

  // @Expose()
  // get products() {
  //   if (this.items) {
  //     return this.items
  //       .filter((item) => !!item)
  //       .map((item) => {
  //         delete item.product.createdAt;
  //         delete item.product.updatedAt;
  //         delete item.product.deletedAt;
  //         return {
  //           ...item.product,
  //           quantity: item.quantity,
  //           itemId: item.id,
  //         };
  //       });
  //   }
  //   return [];
  // }

  @Expose()
  get total() {
    if (this.products) {
      return this.products
        .filter((product) => !!product)
        .reduce((total, product) => {
          const subTotal = product.quantity * Number(product.price);
          return total + subTotal;
        }, 0);
    }
    return 0;
  }
}
