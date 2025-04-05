import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { EditorialRepository } from '../repositories/editorial.repository';
import { Problem } from '../entities/problem.entity';
import { Editorial } from '../entities/editorial.entity';
import { UnauthorizedException } from 'src/common/exceptions/user.exception';
import { RoleType } from 'src/user/entities/role.entity';
import { AuthService } from 'src/user/auth.service';
import { FilterQuery } from '@mikro-orm/core';

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

  async getEditorialList(option: {
    author?: User;
    problem?: Problem;
    page?: number;
    pageSize?: number;
    sortBy?: string;
  }) {
    const filterQuery: FilterQuery<Editorial> = {};
    const page = option.page || 1;
    const pageSize = option.pageSize || 10;

    // TODO: Add sort by

    if (option.problem) filterQuery.problem = option.problem;
    if (option.author) filterQuery.author = option.author;

    const [editorials, totalCount] =
      await this.editorialRepository.findAndCount(filterQuery, {
        populate: ['author'],
        limit: pageSize,
        offset: (page - 1) * pageSize,
      });

    return {
      results: editorials.map((editorial) => ({
        id: editorial.id,
        createdAt: editorial.createdAt,
        updatedAt: editorial.updatedAt,
        content: editorial.content,
        author: {
          username: editorial.author.username,
        },
      })),
      totalCount,
    };
  }
}
