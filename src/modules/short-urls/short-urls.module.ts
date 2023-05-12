import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ShortUrlsResolver } from './short-urls.resolver';
import { ShortUrlsService } from './short-urls.service';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [ShortUrlsResolver, ShortUrlsService],
})
export class ShortUrlsModule { }
