import {CreateOptions} from "sequelize-dm8";

export type AssociationCreateOptions = {
  through?: any;
} & CreateOptions;
