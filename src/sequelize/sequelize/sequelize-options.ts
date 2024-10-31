import {Options} from "sequelize-dm8";
import {ModelCtor} from "../../model/model/model";

export type ModelMatch = (filename: string, member: string) => boolean;

export interface SequelizeOptions extends Options {

  /**
   * Path to models or actual models,
   * which should be loaded for sequelize instance
   */
  models?: string[] | ModelCtor[];

  /**
   * Path to models, which should be loaded
   * @deprecated
   */
  modelPaths?: string[];

  /**
   * Matches models by filename using a custom function.
   * @default (filename, member) => filename === member
   */
  modelMatch?: ModelMatch;

  /**
   * If true enables repository mode when true
   */
  repositoryMode?: boolean;


  /**
   * If true enables validate only mode
   */
  validateOnly?: boolean;
}
