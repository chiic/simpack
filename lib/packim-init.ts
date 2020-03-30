#!/usr/bin/env node
const program = require('commander');
const chalk = require('chalk');
const download = require('download-git-repo');
const inquirer = require('inquirer');
const { writeFile } = require('fs');

const ora = require('ora');
const path = require('path');
const fse = require('fs-extra');
program
    .usage(`<template-type> ['js' | 'ts']  <dir?> [dir-name]` );
/**
 * Help.
 */
program.on('--help', () => {
    console.log('  Examples:');
    console.log();
    console.log(chalk.gray('    # create a new js-type project with webpack'));
    console.log('    $ packim init js');
    console.log();
    console.log(chalk.gray('    # create a new ts-type project in test dir with webpack'));
    console.log('    $ packim init ts test');
    console.log();
});
function help() {
    program.parse(process.argv);
    if (program.args.length < 1)
        return program.help();
}
help();
const type = program.args[0];
let desk = program.args[1];

const pkg = require('../package');

if(desk) {
    if(/^\w+$/.test(desk)) {
        loadTpl();
    } else {
        console.log(chalk.red(`[Name error]: ${desk} is a terrible name!`));
        process.exit(1);
    }
} else {
    inquirer.prompt([{
        type: 'confirm',
        message: 'Generate project in current directory?',
        name: 'ok'
      }]).then(
          answers => {
              if(answers.ok) {
                desk = '';
                loadTpl();
              } else {
                  process.exit(0);
              }
          }
      )
}

function loadTpl() {
    const spinner = ora('loading template')
    spinner.start()
    fse.copy(
        path.resolve(__dirname, `../template/${type}-tpl`),
        path.resolve(process.cwd(), desk)
    ).then(
        () => {
            spinner.stop();
            console.log(chalk.green('[Create]: Initialization complete!'))
        }
    ).catch(
        err => console.log(err)
    );
}