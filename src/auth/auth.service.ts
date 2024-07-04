import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt'
import { CustomerService } from "../customer/customer.service";

@Injectable()
export class AuthService {
    constructor(
        private customerService: CustomerService,
        private jwtService: JwtService,
    ) {}

    async validateCostumer(email: string, pass: string): Promise<any>{
        const customer = await this.customerService.findOneByEmail(email)
        if(customer && await bcrypt.compare(pass,customer.password)){
            const { password, ...result } = customer 
            return result
        }
        return null
    }

    async login(customer: any) {
        const payload = { email: customer.email, sub: customer._id}
        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}