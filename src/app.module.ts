import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import authConfig from './config/auth.config';
import { ProblemModule } from './problem/problem.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env`],
      load: [authConfig],
      isGlobal: true,
    }),
    MikroOrmModule.forRoot(),
    UserModule,
    ProblemModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
