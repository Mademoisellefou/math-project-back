import { Module } from '@nestjs/common'
import { AuthenticationModule } from './authentication/authentication.module'
import { AuthorizationModule } from './authorization/authorization.module'
import { ConfigCoreModule } from './config/config.module'

@Module({
  imports: [
    ConfigCoreModule,
    AuthorizationModule,
    AuthenticationModule,
  ],
})
export class CoreModule {}
