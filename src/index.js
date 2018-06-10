let component = null;
const each = require('lodash/each');
const get = require('lodash/get');

const buildValue = (value, params) => {
  let result = value;
  if (Object.keys(params).length) {
    each(params, (value, param) => {
      result = result.replace(':' + param, value)
    });
  }
  
  return result;
};

const Translator = {
  install(Vue) {
    if (!component) {
      component = new Vue({
        data() {
          return {
            language: 'en', // default language
            translations: {},
          }
        },
        methods: {
          setLang(lang) {
            this.language = lang;
          },

          load(object) {
            this.translations = object;
          },
          
          setup(language, object) {
            this.setLang(language);
            this.load(object);
          },
          
          translate(path, params = {}) {
            let arrayedPath = path.split('.'); // 0 - language, 1 - key;
            let group = null;
      
            if (!get(this.translations, arrayedPath[0])) {
              group = arrayedPath[0];
              delete arrayedPath[0];
            } else {
              delete arrayedPath[0]; delete arrayedPath[1];
            }
            
            if (!get(this.translations, `${this.language}.${group}`)) {
              console.error('translator - (' + path + ') group not found.');
              return path;
            }
  
            arrayedPath = arrayedPath.filter((o) => o);
            let item = arrayedPath.join('.');
            
            if (!get(this.translations, `${this.language}.${group}.${item}`)) {
              let findedKeys = {};
              each(this.translations[this.language][group], (value, key) => {
                if (key.indexOf(item + '.') !== -1) {
                  let newKey = key.replace(item + '.', '');
                  findedKeys[newKey] = buildValue(value, params);
                }
              });
  
              if (Object.keys(findedKeys).length) {
                let initData = null;
                each(findedKeys, (value, key) => {
                  if (key.indexOf('.') !== -1) {
                    let keys = key.split('.');
        
                    initData = findedKeys;
                    each(keys, (k, i) => {
                      if (initData[k] === undefined)
                        initData[k] = {};
          
                      if (i === keys.length - 1) initData[k] = value;
                      else initData = initData[k];
                    });
        
                    delete findedKeys[key];
                  }
                });
    
                return findedKeys;
              }
  
              console.error('translator - (' + path + ') item not found.');
              return path;
            }
            
            return buildValue(this.translations[this.language][group][item], params);
          }
        }
      });
      
      Vue.prototype.$translate = component;
      // simple use
      Vue.prototype.__t = component.translate;
    }
  },
};

if (typeof exports === 'object') {
  module.exports = Translator; // CommonJS
} else if (typeof define === 'function' && define.amd) {
  define([], function () { return Translator; }); // AMD
} else if (window.Vue) {
  window.Translator = Translator; // Browser (not required options)
  Vue.use(Translator);
}