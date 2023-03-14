import { format, addColors, LoggerTraceability } from 'traceability';

const colors = {
  info: 'green',
  warn: 'yellow',
  error: 'red',
};
const colorizer = format.colorize();
addColors(colors);

export const loggerConfiguration = LoggerTraceability.getLoggerOptions();

const oldFormat = loggerConfiguration.format || format.combine();
const formated = format.combine(
  oldFormat,
  format.timestamp(),
  format.simple(),
  format.printf(
    (msg) =>
      `${colorizer.colorize(msg.level, `${msg.timestamp} - ${msg.level}:`)} ${
        msg.cid ? `cid: ${msg.cid} ` : ''
      }${
        typeof msg.message === 'string'
          ? msg.message
          : JSON.stringify(msg.message)
      } ${
        msg.eventName ? `eventName: ${JSON.stringify(msg.eventName)} ` : ''
      } ${msg.eventData ? `eventData: ${JSON.stringify(msg.eventData)} ` : ''}`,
  ),
);
loggerConfiguration.format = formated;
