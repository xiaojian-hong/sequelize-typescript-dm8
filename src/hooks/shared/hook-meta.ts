import {HookOptions} from "./hook-options";
import {SequelizeHooks} from "sequelize-dm8/types/lib/hooks";

export interface HookMeta {
  hookType: keyof SequelizeHooks;
  methodName: string;
  options?: HookOptions;
}
