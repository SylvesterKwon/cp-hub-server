import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { CommandFactory } from 'nest-commander';
import { CommandModule } from './commands/command.module';

async function bootstrap() {
  // Dayjs config
  dayjs.extend(utc);

  // nest-commander
  // TODO(Log): Add logger instead of ['warn', 'error']
  await CommandFactory.run(CommandModule, [
    'warn',
    'error',
    'debug',
    'log', // use it only for debugging mikro-orm query
  ]);
}

bootstrap();
