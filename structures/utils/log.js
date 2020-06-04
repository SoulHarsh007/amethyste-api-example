/**
 * @typedef {Object} Draft
 * @property {Boolean} spinning
 * @property {string} text
 * @property {any} draft
 */

const chalk = require('chalk');
const sleep = require('./sleep');
require('draftlog').into(console);

const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
/**
 * Provides some fancy colored logs for errors, warns and info, but also animated logs
 * @prop {Map} drafts A map of all the current draft-logs going on
 * @typedef {Log} Log
 */
class Log {
  /**
   * @constructor
   */
  constructor() {
    /** @type {Map<String | Number, Object>} */
    this.drafts = new Map();
  }

  /**
   * Log to the console a fancy red error message
   * @param {string} err - The error to log
   * @param {Boolean} [returnString] - Optional, default is false: Whether the string should be returned instead of being logged
   * @return {void|string} errror log in red color
   */
  error(err, returnString) {
    const log = `[${chalk.red(
      Date().toString().split(' ').slice(1, 5).join(' ') + ' ERROR'
    )}] ${err}`;
    if (returnString) {
      return log;
    } else {
      console.log(log);
    }
  }

  /**
   * Log to the console a fancy yellow warning message
   * @param {string} warning - The warning to log
   * @param {Boolean} [returnString] - Optional, default is false: Whether the string should be returned instead of being logged
   * @return {void|string} warning log in yellow
   */
  warn(warning, returnString) {
    const log = `[${chalk.yellow(
      Date().toString().split(' ').slice(1, 5).join(' ') + ' WARNING'
    )}] ${warning}`;
    if (returnString) {
      return log;
    } else {
      console.log(log);
    }
  }

  /**
   * Log to the console a fancy yellow warning message
   * @param {string} info - The warning to log
   * @param {Boolean} [returnString] - Optional, default is false: Whether the string should be returned instead of being logged
   * @return {string|void} info log in green
   */
  info(info, returnString = false) {
    const log = `[${chalk.green(
      Date().toString().split(' ').slice(1, 5).join(' ') + ' INFO'
    )}] ${info}`;
    if (returnString) {
      return log;
    } else {
      console.log(log);
    }
  }

  /**
   * Log an animated "loading" message
   * @param {String|Number} name - The name of the draft-log, this is needed to retrieve it later
   * @param {string} text - The text to be logged
   * @return {Promise<void | string>} TODO
   */
  async draft(name, text) {
    // If the terminal cannot handle draft logs, make a simple log
    if (!process.stderr.isTTY) {
      return this.info(text);
    }
    this.drafts.set(name, {
      spinning: true,
      text,
      // @ts-ignore
      draft: console.draft(this.info(`${frames[0]} ${text}`, true)),
    });
    for (let i = 0; this.drafts.get(name).spinning; i++) {
      await sleep(50);
      this.drafts
        .get(name)
        .draft(this.info(`${frames[i % frames.length]} ${text}`, true));
    }
  }

  /**
   * End an animated draft-log
   * @param {String|Number} name - The name of the draft-log to end
   * @param {string} text - Text to update the log with
   * @param {Boolean} [succeed=true] - Whether the operation succeed or not, will respectively result in a info or an error message
   * @return {Promise<void>} TODO
   */
  async endDraft(name, text, succeed = true) {
    this.drafts.get(name).spinning = false;
    await sleep(50);
    this.drafts
      .get(name)
      .draft(
        this[succeed ? 'info' : 'error'](`${succeed ? '✔' : '✖'} ${text}`, true)
      );
    this.drafts.delete(name);
  }
}

module.exports = new Log();
