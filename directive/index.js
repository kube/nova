'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var _ = require('underscore.string');

var utils = require('../util');

var NovaGenerator = yeoman.generators.NamedBase.extend({

  initializing: function () {
    this.appName = _.camelize(this.appname);
    this.capName = _.capitalize(this.appName);
    this.camelName = _.camelize(this.name);
    this.dashName = _.dasherize(this.name);
  },

  prompting: function () {

    var self = this;
    var done = self.async();

    self.prompt([{
      type: 'confirm',
      name: 'template',
      message: 'Do this directive needs an html template?',
      default: false
    }, {
        type: 'confirm',
        name: 'import',
        message: 'Do you want to create and import the ' + chalk.blue(this.dashName + '.scss') + ' style in your app.scss?',
        default: false
      }], function (props) {
        self.needTemplate = props.template;
        self.import = props.import;
        done();
      });

  },

  writing: function () {
    var basePath = 'client/directives/' + this.dashName + '/' + this.dashName;

    this.template('directive.ts', basePath + '.directive.ts');

    var filters = this.config.get('filters');

    if (filters && filters.karma)
      this.template('directive.spec.js', basePath + '.spec.js');

    if (this.needTemplate)
      this.template('directive.html', basePath + '.html');

    if (this.import) {
      this.template('style.scss', basePath + '.scss');

      utils.appendNeedleOrOnTop({
        needle: '// imports',
        file: 'client/styles/app.scss',
        append: '@import "../directives/' + this.dashName + '/' + this.dashName + '";'
      }, function importCallback(err) {
          /* istanbul ignore if */
          if (err)
            utils.bangLog('There was an error importing the style.', 'red');
          else
            utils.bangLog('Your style was successfully injected.', 'green');
        });
    }

  }

});

module.exports = NovaGenerator;
