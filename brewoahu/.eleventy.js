const moment = require('moment');
const handlebars = require('handlebars');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("files");
  eleventyConfig.addPassthroughCopy("style/*.css");

  eleventyConfig.addHandlebarsHelper(
    "traverse",
    function (object, options) {
      let key = options.hash["children"];
      if (object) {
        let rendered = "";
        let queue = object instanceof Array ? object.slice() : [object];

        while (queue.length) {
          let next = queue.shift();
          rendered += options.fn(next);

          if (next[key] instanceof Array) {
            queue = next[key].concat(queue);
          }
        }

        return rendered;
      }
    }
  );

  eleventyConfig.addHandlebarsHelper(
    "if-any",
    function () {
      let conditions = Array.from(arguments).slice(0, -1);
      let options = arguments[arguments.length - 1];
      let value = conditions.filter(v => v)[0];
      if (value) {
        return options.fn({ ...this, value });
      } else if (options.inverse) {
        return options.inverse();
      }
    }
  );

  eleventyConfig.addHandlebarsHelper(
    "$coalesce",
    function () {
      let ary = Array.from(arguments).slice(0, -1);
      if (ary instanceof Array) {
        for (let item of ary) {
          if (item) {
            return item;
          }
        }

        return undefined;
      } else {
        return ary;
      }
    }
  );

  eleventyConfig.addHandlebarsHelper(
    "$lower",
    function (str, options) {
      if (typeof str === "string") {
        return str.toLocaleLowerCase();
      }
    }
  );

  eleventyConfig.addHandlebarsHelper(
    "$upper",
    function (str, options) {
      if (typeof str === "string") {
        return str.toLocaleUpperCase();
      }
    }
  );

  eleventyConfig.addHandlebarsHelper(
    "$strip",
    function (str, chars) {
      if (str && chars) {
        let charArray = Array.from(chars);
        let result = '';
        for (let i = 0; i < str.length; i++) {
          if (!charArray.includes(str[i])) {
            result += str[i];
          }
        }
        return result;
      } else {
        return str;
      }
    }
  );

  eleventyConfig.addHandlebarsHelper(
    "$formatDate",
    function (str, format) {
      if (str && format) {
        return moment(str).format(format);
      } else {
        return str;
      }
    }
  );

  eleventyConfig.addHandlebarsHelper(
    "$abbr",
    function (obj, className) {
      if (obj && obj.abbreviation) {
        let classAttr =
          typeof className === "string" ?
            ` class="${className}"` :
            '';
        return new handlebars.SafeString(
          `<abbr title="${obj.text}"${classAttr}>${obj.abbreviation}</abbr>`
        )
      } else {
        return obj;
      }
    }
  );

  eleventyConfig.addHandlebarsHelper(
    "$log",
    function (value) {
      console.log((typeof value) + (value && value.prototype ? ': ' + value.prototype.constructor.name : ''));
      console.log(value);
      return value;
    }
  );

  eleventyConfig.setFrontMatterParsingOptions({
    delimiters: ['/*---', '---*/']
  });

  eleventyConfig.setDynamicPermalinks(false);

  return {
    templateFormats: [
      "mustache",
      "hbs",
      "scss"
    ],
    passthroughFileCopy: true
  };
};
