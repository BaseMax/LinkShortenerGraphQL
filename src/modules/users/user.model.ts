import { Field, ID, ObjectType } from '@nestjs/graphql';
import { checkUserMiddleware } from '../auth/dto/checkUserId.field-middleware';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ middleware: [checkUserMiddleware] })
  email: string;

  password: string;
}
