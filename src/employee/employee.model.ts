import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Employee {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field()
    email: string;

    @Field()
    password: string
}