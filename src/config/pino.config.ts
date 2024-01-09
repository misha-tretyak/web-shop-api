import { ConfigService } from '@nestjs/config';
import { Params as PinoConfig } from 'nestjs-pino';

export const pinoConfigFactory = (configService: ConfigService) => {
  const pinoConfig: PinoConfig = {
    pinoHttp: {
      level: configService.get<string>('PINO_LOG_LEVEL'),
      transport: {
        target: 'pino-pretty',
        options: {
          sync: true,
          colorize: true,
          colorizeObjects: true,
          levelFirst: false,
          messageKey: configService.get<string>('PINO_MESSAGE_KEY'), // use 'msg' instead of 'message' as the log message key
          translateTime: 'dd/mm/yyyy HH:MM:ss TT Z',
          hideObject: configService.get<number>('PINO_HIDE_OBJECTS') === 1, // hide objects in the output
          ignore: configService.get<string>('PINO_IGNORE'), // ignore the 'req' and 'res' properties of log objects
        },
      },
    },
  };

  return pinoConfig;
};
