import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ReferenceController } from './reference.controller';
import { Module } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Problem } from 'src/problem/entities/problem.entity';
import { Contest } from 'src/problem/entities/contest.entity';
import { Editorial } from 'src/problem/entities/editorial.entity';
import { ReferenceApplication } from './applications/reference.application';
import { ReferenceService } from './services/reference.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [User, Problem, Contest, Editorial],
    }),
  ],
  controllers: [ReferenceController],
  providers: [ReferenceApplication, ReferenceService],
})
export class ReferenceModule {}
