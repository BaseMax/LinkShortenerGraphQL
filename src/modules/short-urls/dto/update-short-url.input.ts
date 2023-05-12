import { Field, ID, InputType, PartialType, PickType } from '@nestjs/graphql';
import { CreateShortUrlInput } from './create-short-url.input';

@InputType()
export class UpdateShortUrlInput extends PartialType(
  PickType(CreateShortUrlInput, ['fullLink', 'shortLink'] as const),
) {
  @Field(() => ID)
  id: string;
}
