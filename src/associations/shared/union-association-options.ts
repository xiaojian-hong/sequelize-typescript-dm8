import {BelongsToOptions, HasManyOptions, HasOneOptions, ManyToManyOptions} from 'sequelize-dm8';

export type UnionAssociationOptions =
  BelongsToOptions |
  HasManyOptions |
  HasOneOptions |
  ManyToManyOptions;
