import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateShortUrlInput } from './dto/create-short-url.input';
import { UpdateShortUrlInput } from './dto/update-short-url.input';

@Injectable()
export class ShortUrlsService {
  constructor(private prisma: PrismaService) { }
  async create(creatorId: string, input: CreateShortUrlInput) {
    if (
      input.shortLink &&
      (await this.prisma.shortUrl.findUnique({
        where: { shortLink: input.shortLink },
      }))
    ) {
      throw new BadRequestException('short link exists');
    }
    return this.prisma.shortUrl.create({
      data: {
        userId: creatorId,
        fullLink: input.fullLink,
        shortLink: input.shortLink || crypto.randomUUID(),
      },
    });
  }
  async update(creatorId: string, input: UpdateShortUrlInput) {
    const shortUrl = await this.prisma.shortUrl.findUnique({
      where: { id: input.id },
    });
    if (!shortUrl) {
      throw new NotFoundException('short link does not exists');
    }
    if (shortUrl.userId !== creatorId) {
      throw new ForbiddenException('short link is not owned');
    }
    return this.prisma.shortUrl.update({
      where: {
        id: input.id,
      },
      data: {
        fullLink: input.fullLink,
        shortLink: input.shortLink,
      },
    });
  }
  async delete(creatorId: string, id: string) {
    const shortUrl = await this.prisma.shortUrl.findUnique({
      where: { id: id },
    });
    if (!shortUrl) {
      throw new NotFoundException('short link does not exists');
    }
    if (shortUrl.userId !== creatorId) {
      throw new ForbiddenException('short link is not owned');
    }
    return this.prisma.shortUrl.delete({
      where: {
        id: id,
      },
    });
  }
  async getShortUrlById(id: string) {
    const shortUrl = await this.prisma.shortUrl.findUnique({
      where: { id },
    });
    return shortUrl;
  }
  async getShortUrlByShortLink(shortLink: string) {
    const shortUrl = await this.prisma.shortUrl.findUnique({
      where: { shortLink },
    });
    return shortUrl;
  }
}
