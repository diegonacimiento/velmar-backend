import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import config from '../config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: async (configService: ConfigType<typeof config>) => {
        const { database, user, password, host, port } = configService.postgres;
        return {
          type: 'postgres',
          database,
          username: user,
          password,
          host,
          port,
          autoLoadEntities: true,
          ssl: configService.env === 'production',
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
