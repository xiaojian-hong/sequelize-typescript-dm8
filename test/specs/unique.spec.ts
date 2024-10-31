import {getAttributes, Model, Sequelize} from "../../src";
import {Op} from "sequelize-dm8";
import {expect} from "chai";
import {Table} from "../../src/model/table/table";
import {Column} from "../../src/model/column/column";
import {Unique} from "../../src/model/column/column-options/unique";

describe('unique decorator', () => {

  let sequelize;
  let User;

  before(() => {
    @Table
    class UserModel extends Model<UserModel> {
      @Unique('test') @Column name: string;
      @Unique @Column key: string;
    }
    User = UserModel;

    sequelize = new Sequelize({
      operatorsAliases: Op,
      dialect: 'sqlite',
      storage: ':memory:',
      logging: !('SEQ_SILENT' in process.env),
      models: [User],
    });
  });

  it('should set advanced unique options', () => {
    const attributes = getAttributes(User.prototype);
    expect(attributes).to.have.property('name')
      .which.has.property('unique', 'test');
  });

  it('should enable unique options', () => {
    const attributes = getAttributes(User.prototype);
    expect(attributes).to.have.property('key')
      .which.has.property('unique', true);
  });

});
