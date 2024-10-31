import {FindOptions} from "sequelize-dm8";

export type AssociationCountOptions = {
  scope?: string | boolean;
} & FindOptions;
