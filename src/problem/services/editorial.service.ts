import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { EditorialRepository } from '../repositories/editorial.repository';
import { Problem } from '../entities/problem.entity';
import { Editorial } from '../entities/editorial.entity';
import { UnauthorizedException } from 'src/common/exceptions/user.exception';
import { RoleType } from 'src/user/entities/role.entity';
import { AuthService } from 'src/user/auth.service';

@Injectable()
export class EditorialService {
  constructor(
    private editorialRepository: EditorialRepository,
    private authService: AuthService,
  ) {}

  async updateEditorial(user: User, problem: Problem, content: string) {
    const existingEditorial = await this.editorialRepository.findOne({
      problem,
      author: user,
    });
    if (existingEditorial) {
      existingEditorial.content = content;
      return existingEditorial;
    } else {
      const editorial = this.editorialRepository.create({
        problem,
        author: user,
        content,
      });
      return editorial;
    }
  }

  async deleteEditorial(user: User, editorial: Editorial) {
    const isAdmin = await this.authService.checkIfUserInRole(
      user,
      RoleType.ADMIN,
    );
    if (!isAdmin && editorial.author.id !== user.id)
      throw new UnauthorizedException();
    const em = this.editorialRepository.getEntityManager();
    return await em.removeAndFlush(editorial);
  }
}
