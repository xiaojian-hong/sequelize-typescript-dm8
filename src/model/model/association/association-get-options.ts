import {FindOptions} from "sequelize-dm8";

export type AssociationGetOptions = {
  scope?: string | boolean;
  schema?: string;
} & FindOptions;
