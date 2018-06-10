let component = null;

const Translator = {
  install(Vue) {
    if (!component) {
      component = new Vue({
        data() {
          return {
            language: '',
            translations: {},
          }
        },
        methods: {
          setLang(lang) {
            this.language = lang;
          },

          load(object) {
            this.translations = object;
          }
        }
      });
      
      Vue.prototype.$translate = component;
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