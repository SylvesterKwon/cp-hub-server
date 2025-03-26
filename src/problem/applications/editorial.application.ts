import { Injectable } from '@nestjs/common';
import { EditorialRepository } from '../repositories/editorial.repository';
import { MikroORM, Transactional } from '@mikro-orm/core';
import { ProblemRepository } from '../repositories/problem.repository';
import {
  EditorialNotFoundException,
  ProblemNotFoundException,
} from 'src/common/exceptions/problem.exception';
import { UserRepository } from 'src/user/repositories/user.repositories';
import { UserNotFoundException } from 'src/common/exceptions/user.exception';
import { EditorialService } from '../services/editorial.service';

@Injectable()
export class EditorialApplication {
  constructor(
    private orm: MikroORM,
    private editorialService: EditorialService,
    private editorialRepository: EditorialRepository,
    private problemRepository: ProblemRepository,
    private userRepository: UserRepository,
  ) {}

  @Transactional()
  async updateEditorial(userId: string, problemId: string, content: string) {
    const problem = await this.problemRepository.findOne({ id: problemId });
    if (!problem) throw new ProblemNotFoundException();
    const user = await this.userRepository.findOne({ id: userId });
    if (!user) throw new UserNotFoundException();

    const editorial = await this.editorialService.updateEditorial(
      user,
      problem,
      content,
    );

    return {
      message: 'Editorial created/updated successfully',
      editorialId: editorial.id,
    };
  }

  @Transactional()
  async deleteEditorial(userId: string, problemId: string) {
    const editorial = await this.editorialRepository.findOne({
      author: { id: userId },
      problem: { id: problemId },
    });
    if (!editorial) throw new EditorialNotFoundException();
    const user = await this.userRepository.findOne({ id: userId });
    if (!user) throw new UserNotFoundException();

    await this.editorialService.deleteEditorial(user, editorial);

    return { message: 'Editorial deleted successfully' };
  }
}
