import { Query, Resolver } from '@nestjs/graphql';
import { User } from './user.model';

@Resolver()
export class UsersResolver {
  @Query(() => [User])
  users(): User[] {
    return [];
  }
}
