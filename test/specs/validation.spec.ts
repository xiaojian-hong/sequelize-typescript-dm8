/* tslint:disable:max-classes-per-file */

import {expect, use} from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {ModelValidateOptions} from "sequelize-dm8";
import {createSequelize, createSequelizeValidationOnly} from "../utils/sequelize";
import {
  ShoeWithValidation, KEY_VALUE, PARTIAL_SPECIAL_VALUE, BRAND_LENGTH,
  hexColor, HEX_REGEX, PRODUCED_AT_IS_AFTER, PRODUCED_AT_IS_BEFORE, UUID_VERSION, MAX, MIN, NOT, IS_IN, NOT_CONTAINS
} from "../models/ShoeWithValidation";
import {Is} from "../../src/validation/is";
import {Model} from "../../src/model/model/model";
import {Table} from "../../src/model/table/table";
import {Column} from "../../src/model/column/column";
import {Length} from "../../src/validation/length";
import {NotEmpty} from "../../src/validation/not-empty";
import {Validator} from '../../src/validation/validator';

use(chaiAsPromised);

describe('validation', () => {

  let sequelize;

  before(() => sequelize = createSequelize());

  beforeEach(() => sequelize.sync({force: true}));

  describe(`rawAttributes of ${ShoeWithValidation.name}`, () => {

    let rawAttributes;
    const shoeAttributes: { [key: string]: ModelValidateOptions } = {
      id: {
        isUUID: UUID_VERSION
      },
      key: {
        equals: KEY_VALUE
      },
      special: {
        contains: PARTIAL_SPECIAL_VALUE
      },
      brand: {
        len: [BRAND_LENGTH.min, BRAND_LENGTH.max]
      },
      brandUrl: {
        isUrl: true
      },
      primaryColor: {
        isHexColor: hexColor
      },
      secondaryColor: {
        isHexColor: hexColor
      },
      tertiaryColor: {
        is: HEX_REGEX
      },
      producedAt: {
        isDate: true,
        isAfter: PRODUCED_AT_IS_AFTER,
        isBefore: PRODUCED_AT_IS_BEFORE,
      },
      dummy: {
        isCreditCard: true,
        isAlpha: true,
        isAlphanumeric: true,
        isEmail: true,
        isDecimal: true,
        isFloat: true,
        isInt: true,
        isIP: true,
        isIPv4: true,
        isIPv6: true,
        isLowercase: true,
        isUppercase: true,
        max: MAX,
        min: MIN,
        not: NOT,
        isIn: IS_IN,
        notIn: IS_IN,
        notContains: NOT_CONTAINS,
        isArray: true,
      }
    };

    before(() => rawAttributes = ShoeWithValidation['rawAttributes']);

    it(`should have properties with defined validations`, () => {
      Object
        .keys(shoeAttributes)
        .forEach(key => {


          expect(rawAttributes[key]).to.have.property('validate');
          const validations = shoeAttributes[key];

          Object
            .keys(validations)
            .forEach(validateKey => {

              expect(rawAttributes[key].validate).to.have.property(validateKey)
                .that.eqls(validations[validateKey]);
            });

        });
    });

  });

  describe('validation', () => {

    const data: { [key: string]: { valid: any[]; invalid: any[] } } = {
      id: {
        valid: ['903830b8-4dcc-4f10-a5aa-35afa8445691', null, undefined],
        invalid: ['', 'abc', 1],
      },
      key: {
        valid: [KEY_VALUE, null, undefined],
        invalid: ['', 'ad', '1234567891234567', 2],
      },
      special: {
        valid: [
          `abc${PARTIAL_SPECIAL_VALUE}`,
          `abc${PARTIAL_SPECIAL_VALUE}def`,
          `${PARTIAL_SPECIAL_VALUE}def`,
          `_${PARTIAL_SPECIAL_VALUE}_`
        ],
        invalid: ['', 'ad', '1234567891234567', 2],
      },
      brand: {
        valid: ['nike', 'adidas', 'puma', null, undefined],
        invalid: ['', 'ad', '1234567891234567', 2],
      },
      brandUrl: {
        valid: ['http://www.google.de', 'https://www.google.com', null, undefined],
        invalid: ['', 'ad', '1234567891234567', 2],
      },
      primaryColor: {
        valid: ['#666', '#666555', null, undefined],
        invalid: ['', 'ad', '1234567891234567', 2],
      },
      secondaryColor: {
        valid: ['#666', '#666555', null, undefined],
        invalid: ['', 'ad', '1234567891234567', 2],
      },
      tertiaryColor: {
        valid: ['#666', '#666555', null, undefined],
        invalid: ['', 'ad', '1234567891234567', 2],
      },
      producedAt: {
        valid: [new Date(2010, 1, 1), null, undefined],
        invalid: ['', 'ad', '1234567891234567', 2, new Date(1980, 1, 1)],
      },
    };

    const validPromises: Array<Promise<any>> = [];
    const invalidPromises: Array<Promise<any>> = [];

    before(() => {
      Object
        .keys(data)
        .forEach(key => {

          const valid = data[key].valid;
          const invalid = data[key].invalid;

          validPromises.push(Promise.all(valid.map(value => {

            const shoe = new ShoeWithValidation({[key]: value});

            return expect(shoe.validate()).to.be.fulfilled;
          })));

          invalidPromises.push(Promise.all(invalid.map(value => {

            const shoe = new ShoeWithValidation({[key]: value});

            return expect(shoe.validate()).to.be.rejected;
          })));

        });
    });

    it(`should not throw due to valid values`, () => Promise.all(validPromises));
    it(`should throw due to invalid values`, () => Promise.all(invalidPromises));

  });

  describe('decorators', () => {

    describe('Is', () => {

      it('Should throw due to missing name of function', () => {
        expect(() => Is(() => null)).to.throw(/Passed validator function must have a name/);
      });

    });

    describe('Length', () => {

      it('should not produce an error', () => {
        @Table
        class User extends Model<User> {
          @Length({min: 0, max: 5}) @Column name: string;
        }

        const sequelizeValidationOnly = createSequelizeValidationOnly(false);
        sequelizeValidationOnly.addModels([User]);
        const user = new User({name: 'elisa'});

        return expect(user.validate()).to.be.not.rejected;
      });

      it('should produce an error due to unfulfilled max', () => {
        @Table
        class User extends Model<User> {
          @Length({min: 0, max: 5}) @Column name: string;
        }

        const sequelizeValidationOnly = createSequelizeValidationOnly(false);
        sequelizeValidationOnly.addModels([User]);
        const user = new User({name: 'elisa tree'});

        return expect(user.validate()).to.be.rejected;
      });

      it('should produce an error due to unfulfilled min', () => {
        @Table
        class User extends Model<User> {
          @Length({min: 5, max: 5}) @Column name: string;
        }

        const sequelizeValidationOnly = createSequelizeValidationOnly(false);
        sequelizeValidationOnly.addModels([User]);
        const user = new User({name: 'elli'});

        return expect(user.validate()).to.be.rejected;
      });

      it('should not produce an error (max only)', () => {
        @Table
        class User extends Model<User> {
          @Length({max: 5}) @Column name: string;
        }

        const sequelizeValidationOnly = createSequelizeValidationOnly(false);
        sequelizeValidationOnly.addModels([User]);
        const user = new User({name: 'elisa'});

        return expect(user.validate()).to.be.not.rejected;
      });

      it('should produce an error (max only)', () => {
        @Table
        class User extends Model<User> {
          @Length({max: 5}) @Column name: string;
        }

        const sequelizeValidationOnly = createSequelizeValidationOnly(false);
        sequelizeValidationOnly.addModels([User]);
        const user = new User({name: 'elisa tree'});

        return expect(user.validate()).to.be.rejected;
      });

      it('should not produce an error (min only)', () => {
        @Table
        class User extends Model<User> {
          @Length({min: 4}) @Column name: string;
        }

        const sequelizeValidationOnly = createSequelizeValidationOnly(false);
        sequelizeValidationOnly.addModels([User]);
        const user = new User({name: 'elisa'});

        return expect(user.validate()).to.be.not.rejected;
      });

      it('should produce an error (min only)', () => {
        @Table
        class User extends Model<User> {
          @Length({min: 5}) @Column name: string;
        }

        const sequelizeValidationOnly = createSequelizeValidationOnly(false);
        sequelizeValidationOnly.addModels([User]);
        const user = new User({name: 'elli'});

        return expect(user.validate()).to.be.rejected;
      });

    });

    describe('NotEmpty', () => {

      it('should not produce an error', () => {
        @Table
        class User extends Model<User> {
          @NotEmpty @Column name: string;
        }

        const sequelizeValidationOnly = createSequelizeValidationOnly(false);
        sequelizeValidationOnly.addModels([User]);
        const user = new User({name: 'elisa'});

        return expect(user.validate()).to.be.not.rejected;
      });

      it('should produce an error', () => {
        @Table
        class User extends Model<User> {
          @NotEmpty @Column name: string;
        }

        const sequelizeValidationOnly = createSequelizeValidationOnly(false);
        sequelizeValidationOnly.addModels([User]);
        const user = new User({name: ''});

        return expect(user.validate()).to.be.rejected;
      });

      it('should not produce an error (with msg)', () => {
        @Table
        class User extends Model<User> {
          @NotEmpty({msg: 'NotEmpty'}) @Column name: string;
        }

        const sequelizeValidationOnly = createSequelizeValidationOnly(false);
        sequelizeValidationOnly.addModels([User]);
        const user = new User({name: 'elisa'});

        return expect(user.validate()).to.be.not.rejected;
      });

      it('should produce an error (with msg)', () => {
        @Table
        class User extends Model<User> {
          @NotEmpty({msg: 'NotEmpty'}) @Column name: string;
        }

        const sequelizeValidationOnly = createSequelizeValidationOnly(false);
        sequelizeValidationOnly.addModels([User]);
        const user = new User({name: ''});

        return expect(user.validate()).to.be.rejected;
      });
    });

    describe('Validator', () => {

      describe('simple model, one validator', () => {

        const VALID_NAME = 'bob';
        const ERROR_MESSAGE = `Invalid name: Only '${VALID_NAME}' is valid`;
        let _sequelize;

        @Table
        class User extends Model<User> {
          @Column name: string;

          @Validator userValidator(): void {
            if (this.name !== VALID_NAME) {
              throw new Error(ERROR_MESSAGE);
            }
          }
        }

        before(() => {
          _sequelize = createSequelize({modelPaths: []});
          _sequelize.addModels([User]);
        });

        it('should throw', () => {
          const user = new User({name: 'will'});

          return expect(user.validate()).to.be.rejected;
        });

        it('should not throw', () => {
          const user = new User({name: VALID_NAME});

          return expect(user.validate()).to.be.fulfilled;
        });

      });

      describe('simple model, multiple validators', () => {

        const VALID_NAME = 'bob';
        const NAME_ERROR_MESSAGE = `Invalid name: Only '${VALID_NAME}' is valid`;
        const VALID_AGE = 99;
        const AGE_ERROR_MESSAGE = `Invalid age: Only '${VALID_AGE}' is valid`;
        let _sequelize;

        @Table
        class User extends Model<User> {
          @Column name: string;
          @Column age: number;

          @Validator nameValidator(): void {
            if (this.name !== VALID_NAME) {
              throw new Error(NAME_ERROR_MESSAGE);
            }
          }

          @Validator ageValidator(): void {
            if (this.age !== VALID_AGE) {
              throw new Error(AGE_ERROR_MESSAGE);
            }
          }
        }

        before(() => {
          _sequelize = createSequelize({modelPaths: []});
          _sequelize.addModels([User]);
        });

        it('should have metadata for multiple validators', () => {
          const {validate} = Reflect.getMetadata('sequelize:options', User.prototype);
          expect(validate).to.have.property('nameValidator');
          expect(validate).to.have.property('ageValidator');
        });

        it('should throw due to wrong name', () => {
          const user = new User({name: 'will', age: VALID_AGE});

          return expect(user.validate()).to.be.rejectedWith(NAME_ERROR_MESSAGE);
        });

        it('should throw due to wrong age', () => {
          const user = new User({name: VALID_NAME, age: 1});

          return expect(user.validate()).to.be.rejectedWith(AGE_ERROR_MESSAGE);
        });

      });

    });

  });

  describe('only', () => {

    it('should not throw', () => {

      expect(() => createSequelizeValidationOnly()).not.to.throw();
    });

  });

});
