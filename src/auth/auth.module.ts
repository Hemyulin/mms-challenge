import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CustomerModule } from 'src/customer/customer.module';
import { jwtConstants } from './constants';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthResolver } from './auth.resolver';

@Module({
    imports: [
        CustomerModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60m'},
        }),
    ],
    providers: [AuthService, AuthResolver, LocalStrategy, JwtStrategy],
    exports:[AuthService]
})
export class AuthModule {}
