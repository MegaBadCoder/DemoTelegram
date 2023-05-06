import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database'

class User extends Model {
  public id!: number;
  public username!: string;
  public stateId!: number;
  public email!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  // public createdAt!: Date;
  // public updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    stateId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    chatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    sequelize,
  }
);

export default User;