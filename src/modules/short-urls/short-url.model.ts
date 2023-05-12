import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '../users/user.model';

@ObjectType()
export class ShortUrl {
  @Field(() => ID)
  id: string;

  @Field()
  shortLink: string;

  @Field()
  fullLink: string;

  @Field(() => User)
  user: User;

  userId: string;
  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
