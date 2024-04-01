import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';

enum LogLevel {
  LOG = 'log',
  ERROR = 'error',
  WARN = 'warn',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
}

const DEFAULT_LOG_FILE_SIZE = 50;
const KiB = 1024;

@Injectable()
export class LoggingService extends ConsoleLogger implements LoggerService {
  private logLevel: Array<LogLevel>;
  private logFileSize: number;
  private logDir: string;

  private currentLogFile: string;
  private currentErrorFile: string;

  constructor(private configService: ConfigService) {
    super();

    this.parseLogLevelArg();
    this.parseLogDirArg();
    this.logFileSize =
      Number(configService.get('LOG_FILE_SIZE')) || DEFAULT_LOG_FILE_SIZE;

    this.currentLogFile = this.saltFileName('logs.log');
    this.createFile(this.currentLogFile);
    this.currentErrorFile = this.saltFileName('error.log');
    this.createFile(this.currentErrorFile);
  }

  log(message: any) {
    this.register(LogLevel.LOG, message);
  }

  error(message: any) {
    this.register(LogLevel.ERROR, message);
  }

  warn(message: any) {
    this.register(LogLevel.WARN, message);
  }

  debug(message: any) {
    this.register(LogLevel.DEBUG, message);
  }

  verbose(message: any) {
    this.register(LogLevel.VERBOSE, message);
  }

  private parseLogDirArg() {
    const logFolderName = this.configService.get('LOG_DIR') || 'logs';
    const pathToDir = path.normalize(path.join(process.cwd(), logFolderName));
    try {
      fs.readdirSync(pathToDir);
    } catch (error) {
      // will be error if directory does not exist
      fs.mkdirSync(pathToDir, { recursive: true });
    }
    this.logDir = pathToDir;
  }

  private createFile(fileName: string) {
    const pathToFile = path.join(this.logDir, fileName);
    // try {
    //     fs.readFileSync(pathToFile)
    // } catch (error) {
    //     // if file not exist
    //     fs.writeFileSync(pathToFile, '')
    // }
    fs.writeFileSync(pathToFile, '');
  }

  private parseLogLevelArg() {
    const split = (
      this.configService.get('LOG_LEVEL')?.trim().split(' ') as Array<LogLevel>
    ).filter((value) => Object.values(LogLevel).includes(value));
    if (split?.length) {
      this.logLevel = split;
      return;
    }
    // otherwise default value
    this.logLevel = [
      LogLevel.LOG,
      LogLevel.ERROR,
      LogLevel.WARN,
      LogLevel.DEBUG,
      LogLevel.VERBOSE,
    ];
  }

  private saltFileName(fileName: string): string {
    return new Date().toISOString().replace(':', '-') + '_' + fileName;
  }

  private register(level: LogLevel, message: string) {
    if (this.needToRegister(level)) {
      super[level](message);
      const formatted =
        new Date().toISOString() +
        '_' +
        level.toUpperCase() +
        '_' +
        message +
        '\n';
      if (level === LogLevel.ERROR) {
        this.errorToFile(formatted);
      } else {
        this.logToFile(formatted);
      }
    }
  }

  private needToRegister(level: LogLevel): boolean {
    return this.logLevel.includes(level);
  }

  private logToFile(message: string) {
    let pathToFile = path.join(this.logDir, this.currentLogFile);
    if (this.isFileFull(pathToFile)) {
      // create new file
      this.currentLogFile = this.saltFileName('logs.log');
      this.createFile(this.currentLogFile);
      pathToFile = path.join(this.logDir, this.currentLogFile);
    }
    this.appendToFile(pathToFile, message);
  }

  private errorToFile(message: string) {
    let pathToFile = path.join(this.logDir, this.currentErrorFile);
    if (this.isFileFull(pathToFile)) {
      // create new file
      this.currentErrorFile = this.saltFileName('error.log');
      this.createFile(this.currentErrorFile);
      pathToFile = path.join(this.logDir, this.currentErrorFile);
    }
    this.appendToFile(pathToFile, message);
  }

  private isFileFull(filePath: string): boolean {
    let fileSize: number;
    try {
      fileSize = fs.statSync(filePath).size;
    } catch (error) {
      return true;
    }
    return fileSize > (this.logFileSize - 3) * KiB;
  }

  private appendToFile(pathToFile: string, message: string) {
    fs.appendFileSync(pathToFile, message);
  }
}
