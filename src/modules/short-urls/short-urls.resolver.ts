import { UseGuards } from '@nestjs/common';
import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthGuard } from '../auth/auth.guard';
import { OptionalAuth } from '../auth/optional.decorator';
import { UserId } from '../auth/userId.decorator';
import { UsersService } from '../users/users.service';
import { CreateShortUrlInput } from './dto/create-short-url.input';
import { UpdateShortUrlInput } from './dto/update-short-url.input';
import { ShortUrl } from './short-url.model';
import { ShortUrlsService } from './short-urls.service';

@UseGuards(AuthGuard)
@Resolver(() => ShortUrl)
export class ShortUrlsResolver {
  constructor(
    private service: ShortUrlsService,
    private usersService: UsersService,
  ) { }
  @OptionalAuth()
  @Query(() => ShortUrl, { nullable: true })
  async getShortUrlById(
    @Args({ name: 'id', type: () => ID })
    id: string,
  ) {
    return this.service.getShortUrlById(id);
  }
  @OptionalAuth()
  @Query(() => ShortUrl, { nullable: true })
  async getShortUrlByShortLink(
    @Args({ name: 'shortLink', type: () => ID })
    shortLink: string,
  ) {
    return this.service.getShortUrlByShortLink(shortLink);
  }
  @Mutation(() => ShortUrl)
  async createShortUrl(
    @UserId() userId: string,
    @Args({ name: 'input', type: () => CreateShortUrlInput })
    input: CreateShortUrlInput,
  ) {
    return this.service.create(userId, input);
  }

  @Mutation(() => ShortUrl)
  async updateShortUrl(
    @UserId() userId: string,
    @Args({ name: 'input', type: () => UpdateShortUrlInput })
    input: UpdateShortUrlInput,
  ) {
    return this.service.update(userId, input);
  }
  @Mutation(() => Boolean)
  async deleteShortUrl(
    @UserId() userId: string,
    @Args({ name: 'id', type: () => ID })
    id: string,
  ) {
    await this.service.delete(userId, id);
    return true;
  }

  @ResolveField()
  async user(@Parent() shortUrl: ShortUrl) {
    const id = shortUrl.userId;
    return this.usersService.getUserById(id);
  }
}
