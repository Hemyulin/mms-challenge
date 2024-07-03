import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CustomerService } from "src/customer/customer.service";

@Injectable()
export class AuthService {
    constructor(
        private customerService: CustomerService,
        private jtwService: JwtService,
    ) {}
}