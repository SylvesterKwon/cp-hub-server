import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CommentController } from './controllers/comment.controller';
import { Comment } from './entities/comment.entity';
import { CommentApplication } from './applications/comment.application';
import { User } from 'src/user/entities/user.entity';
import { CommentService } from './services/comment.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [Comment, User],
    }),
    UserModule,
  ],
  providers: [CommentApplication, CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
