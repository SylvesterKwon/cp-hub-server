import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import authConfig from './config/auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env`],
      load: [authConfig],
      isGlobal: true,
    }),
    MikroOrmModule.forRoot(),
    UserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
