import Translator from './packages/translations'

export const install = (Vue, transObj = {}) => {
    if (install.installed) return;
    install.installed = true;

    Vue.prototype.$trans = Translator.trans;
    Vue.prototype.$transObject = transObj;

    if (typeof window !== 'undefined' && window.Vue) {
        install(window.Vue);
    }
};