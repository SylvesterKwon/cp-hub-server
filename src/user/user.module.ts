import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { UserApplication } from './user.application';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthService } from './auth.service';
import { Permission } from './entities/permission.entity';
import { Role } from './entities/role.entity';
import { EditorialVotes } from 'src/problem/entities/editorial-votes.entity';
import { Editorial } from 'src/problem/entities/editorial.entity';
import { Comment } from 'src/comment/entities/comment.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [User, Permission, Role, Comment, Editorial, EditorialVotes],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('auth.jwtSecret'),
        signOptions: { expiresIn: configService.get<string>('auth.expiresIn') },
      }),
    }),
  ],
  providers: [
    UserApplication,
    UserService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [AuthService],
  controllers: [UserController],
})
export class UserModule {}
