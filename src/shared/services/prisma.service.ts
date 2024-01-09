import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { Prisma, PrismaClient } from 'prisma/prisma-client';

@Injectable()
export class PrismaService extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'info' | 'warn' | 'error'> implements OnModuleInit {
  constructor(
    private readonly logger: PinoLogger,
    private configService: ConfigService
  ) {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
      ],
    });

    this.logger.setContext(PrismaService.name);
  }

  async onModuleInit() {
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    const isDBLogsEnabled = this.configService.get<number>('ENABLE_DB_LOGS');

    if (!isProduction && isDBLogsEnabled) {
      this.$on('query', (event: Prisma.QueryEvent) => {
        this.logger.info(`\nQUERY: ${event.query} \nPARAMS: ${event.params} \nDURATION: ${event.duration} ms`);
      });
      this.$on('error', (event: Prisma.LogEvent) => {
        this.logger.error(`\nERROR_MESSAGE: ${event.message} \nTARGET: ${event.target} \nTIMESTAMP: ${event.timestamp} ms`);
      });
    }

    await this.$connect();
  }
}
