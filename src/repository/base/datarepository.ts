import { LoggerService } from '@app/common/logger';
import { BaseRepository } from './base.repository';
import { Model, ModelCtor } from 'sequelize-typescript';
export abstract class DataBaseRepository extends BaseRepository<Model> {
  constructor(protected model: ModelCtor<any>,protected logger: LoggerService) {
    super()
  }
  async create(data: Partial<Model>): Promise<Model> {
    this.logger.log('Create', DataBaseRepository.name)
    let result = await this.model.create(data);
    return result;
  }
  async findAll(): Promise<Model[]> {
    this.logger.log('Find All', DataBaseRepository.name)
    let result = await this.model.findAll()
    return result;
  }
  async findById(id: number): Promise<Model> {
    this.logger.log('Find By Id', DataBaseRepository.name)
    let result = await this.model.findOne({ where: { id: id } });
    return result;
  }

  async update(id: number, data: Partial<Model>): Promise<object> {
    this.logger.log('Update', DataBaseRepository.name)
    let result = await this.model.update(data, { where: { id: id } });
    return result;
  }

  async delete(id: number): Promise<object> {
    this.logger.log('Delete', DataBaseRepository.name)
    let result = await this.model.update({ isActive: false }, { where: { id: id } });
    return result;
  }
}