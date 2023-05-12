import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class CreateShortUrlInput {
  @Field()
  fullLink: string;

  @Field({ nullable: true })
  shortLink?: string;
}
