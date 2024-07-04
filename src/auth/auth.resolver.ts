import { Context, Mutation, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { UseGuards } from "@nestjs/common";

@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService) {}

    @Mutation(() => String)
    @UseGuards(LocalAuthGuard)
    async login(@Context() context){
        return this.authService.login(context.customer)
    }
}