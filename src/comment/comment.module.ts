import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CommentController } from './controllers/comment.controller';
import { Comment } from './entities/comment.entity';
import { CommentApplication } from './applications/comment.application';
import { User } from 'src/user/entities/user.entity';
import { CommentService } from './services/comment.service';
import { UserModule } from 'src/user/user.module';
import { Contest } from 'src/problem/entities/contest.entity';
import { Editorial } from 'src/problem/entities/editorial.entity';
import { Problem } from 'src/problem/entities/problem.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [Comment, User, Contest, Editorial, Problem],
    }),
    UserModule,
  ],
  providers: [CommentApplication, CommentService],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
