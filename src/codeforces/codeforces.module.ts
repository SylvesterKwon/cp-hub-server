import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CodeforcesClient } from './client/codeforces.client';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule, HttpModule],
  exports: [],
  providers: [CodeforcesClient],
})
export class CodeforcesModule {}
