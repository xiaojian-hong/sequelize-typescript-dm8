import {ThroughOptions as OriginThroughOptions} from 'sequelize-dm8';
import {ModelClassGetter} from "../../model/shared/model-class-getter";

export type ThroughOptions = {
  [K in keyof OriginThroughOptions]: K extends 'model'
    ? ModelClassGetter | string
    : OriginThroughOptions[K]
};
