/**
 * VueTranslate plugin v0.1.4
Maxim Markin <owl1n@mail.ru>**/
"use strict";

var component = null;
var each = require("lodash/each");
var get = require("lodash/get");
var VueRouter = require("vue-router");

var buildValue = function(value, params) {
  var result = value;
  if (Object.keys(params).length) {
    each(params, function(value, param) {
      result = result.replace(":" + param, value);
    });
  }

  return result;
};

var Translator = {
  install: function(Vue, options) {
    if (!component) {
      component = new Vue({
        data: function() {
          return {
            language: "en", // default language
            translations: {}
          };
        },

        methods: {
          setLang: function(lang) {
            this.language = lang;
          },
          load: function(object) {
            this.translations = object;
          },
          setup: function(language, object) {
            this.setLang(language);
            this.load(object);
          },
          translate: function(path) {
            // console.log(options.$router.currentRoute);
            //console.info("App this router:", window.location.pathname);
            var params =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : {};

            var arrayedPath = path.split("."); // 0 - language, 1 - key;
            var group = null;

            if (!get(this.translations, arrayedPath[0])) {
              group = arrayedPath[0];
              delete arrayedPath[0];
            } else {
              delete arrayedPath[0];
              delete arrayedPath[1];
            }

            if (!get(this.translations, this.language + "." + group)) {
              // console.error("translator - (" + path + ") group not found.");
              return path.split(".")[1];
            }

            arrayedPath = arrayedPath.filter(function(o) {
              return o;
            });
            var item = arrayedPath.join(".");

            if (
              !get(this.translations, this.language + "." + group + "." + item)
            ) {
              var findedKeys = {};
              each(this.translations[this.language][group], function(
                value,
                key
              ) {
                if (key.indexOf(item + ".") !== -1) {
                  var newKey = key.replace(item + ".", "");
                  findedKeys[newKey] = buildValue(value, params);
                }
              });

              if (Object.keys(findedKeys).length) {
                var initData = null;
                each(findedKeys, function(value, key) {
                  if (key.indexOf(".") !== -1) {
                    var keys = key.split(".");

                    initData = findedKeys;
                    each(keys, function(k, i) {
                      if (initData[k] === undefined) initData[k] = {};

                      if (i === keys.length - 1) initData[k] = value;
                      else initData = initData[k];
                    });

                    delete findedKeys[key];
                  }
                });

                return findedKeys;
              }

              console.error("translator - (" + path + ") item not found.");
              return path;
            }

            return buildValue(
              this.translations[this.language][group][item],
              params
            );
          }
        }
      });
      console.log(component);
      Vue.prototype.$translate = component;
      // simple use
      Vue.prototype.__t = component.translate;
    }
  }
};

if (typeof exports === "object") {
  module.exports = Translator; // CommonJS
} else if (typeof define === "function" && define.amd) {
  define([], function() {
    return Translator;
  }); // AMD
} else if (window.Vue) {
  window.Translator = Translator; // Browser (not required options)
  Vue.use(Translator);
}
