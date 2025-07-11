import {
  Table,
  Model,
  Column,
  DataType,
} from 'sequelize-typescript';

@Table({ tableName: 'User', timestamps: false })
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
    field: 'User_ID',
  })
  declare userId: number;

  @Column({ type: DataType.STRING, field: 'FirstName' })
  declare firstName: string;

  @Column({ type: DataType.STRING, field: 'LastName' })
  declare lastName: string;

  @Column({ type: DataType.STRING, field: 'Email', unique: true })
  declare email: string;

  @Column({ type: DataType.STRING, field: 'Password' })
  declare password: string;

  @Column({ type: DataType.STRING, field: 'Gender' })
  declare gender: string;

  @Column({ type: DataType.STRING, field: 'CountryCode' })
  declare countryCode: string;

  @Column({ type: DataType.STRING, field: 'MobileNumber' })
  declare mobile: string;

  @Column({ type: DataType.STRING(2048), field: 'AccessToken' })
  declare accessToken: string;

  @Column({ type: DataType.STRING(2048), field: 'RefreshToken' })
  declare refreshToken: string;

  @Column({ type: DataType.STRING, field: 'ProfileImage' })
  declare profileImage: string;

  @Column({ type: DataType.BOOLEAN, field: 'IsActive' })
  declare isActive: boolean;

  @Column({
    type: DataType.DATE,
    field: 'SysCreatedAt',
    defaultValue: DataType.NOW,
  })
  declare sysCreatedAt: Date;

  @Column({
    type: DataType.DATE,
    field: 'SysUpdatedAt',
    defaultValue: DataType.NOW,
  })
  declare sysUpdatedAt: Date;
}
