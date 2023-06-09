import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  Length,
  Matches,
} from 'class-validator';

@InputType()
export class RegisterUserInput {
  @IsEmail()
  @Field()
  email: string;

  @Field()
  @Length(3, 40)
  firstName: string;

  @Field()
  @Length(2, 40)
  lastName: string;

  @Field()
  @Matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[\da-zA-Z!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/,
  )
  @Length(8, 100)
  password: string;
}
