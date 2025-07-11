
import { FindOptions } from 'sequelize';
import { User } from '../models/User.model';
import { LoggerService } from '@app/common/logger';
import { DataBaseRepository } from 'src/repository/base/datarepository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends DataBaseRepository{
  constructor(protected readonly logger: LoggerService) {
    super(User, logger);
  }
  async create(user:Partial<User>){
    this.logger.log("Create User",UserRepository.name);
    return this.model.create(user);
  }

  async findByEmail(email: string) {
    this.logger.log("Find User By Email",UserRepository.name);
    return this.model.findOne({ where: { email } });
  }

  async findOneByQuery(filter: FindOptions) {
    this.logger.log("Find User By Filter",UserRepository.name);
    return this.model.findOne(filter);
  }

  async update(id: number, data: Partial<User>): Promise<[number, User[]]> {
    this.logger.log("Update User",UserRepository.name);
    return this.model.update(data, {
      where: { userId: id },
      returning: true,
    });
  }
}
