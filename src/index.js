import Translator from './packages/translations'

const install = (Vue, transObj = {}) => {
    if (install.installed) return;
    install.installed = true;

    Vue.prototype.$trans = Translator.trans;
    Vue.prototype.$transObject = transObj;

    if (typeof window !== 'undefined' && window.Vue) {
        install(window.Vue);
    }
};

module.exports = {
    version: '0.1.0',
    install
};