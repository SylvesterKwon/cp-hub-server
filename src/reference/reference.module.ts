import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ReferenceController } from './reference.controller';
import { Module } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Problem } from 'src/problem/entities/problem.entity';
import { Contest } from 'src/problem/entities/contest.entity';
import { Editorial } from 'src/problem/entities/editorial.entity';
import { ReferenceApplication } from './applications/reference.application';
import { ReferenceService } from './services/reference.service';
import { Reference } from './entities/reference.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { ReferenceEventListener } from './reference.event-listener';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [Reference, User, Problem, Contest, Editorial, Comment],
    }),
  ],
  controllers: [ReferenceController, ReferenceEventListener],
  providers: [ReferenceApplication, ReferenceService],
  exports: [ReferenceService],
})
export class ReferenceModule {}
