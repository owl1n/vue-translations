/**
 * Markin Maxim @ 2017
 * JSTranslations/
 */

const DEFAULT_LANGUAGE = 'ru';

export default {
    trans (path, params = {}) {
        let arrayedPath = path.split('.'); // 0 - lang, 1 - group
        let language = arrayedPath[0];
        let group = arrayedPath[1];

        let trans = window.Vue.prototype.$transObject;

        let buildValue = (value, params) => {
            let result = value;
            if (Object.keys(params).length) {
                _.each(params, (value, param) => {
                    result = result.replace(':' + param, value)
                });
            }

            return result;
        };

        //будем считать, что 0 элемент всегда язык. Если нет, то дефолт - РУ
        if (trans.translations[language] === undefined) {
            language = store.state.user.language || DEFAULT_LANGUAGE; group = arrayedPath[0];
            delete arrayedPath[0];
        } else {
            delete arrayedPath[0]; delete arrayedPath[1]; //Удаляем лишние ключи
        }

        if (trans.translations[language][group] === undefined) {
            console.error('translator - (' + path + ') group not found.');
            return path;
        }

        arrayedPath = arrayedPath.filter((o) => o); //Удаляем пустые ключи, если будут (а они будут)
        let item = arrayedPath.join('.');

        if (trans.translations[language][group][item] === undefined) {
            let findedKeys = {};
            _.each(trans.translations[language][group], (value, key) => {
                if (key.indexOf(item + '.') !== -1) {
                let newKey = key.replace(item + '.', '');
                findedKeys[newKey] = buildValue(value, params);
            }
        });

            if (Object.keys(findedKeys).length) {
                let initData = null;
                _.each(findedKeys, (value, key) => {
                    if (key.indexOf('.') !== -1) {
                    let keys = key.split('.');

                    initData = findedKeys;
                    _.each(keys, (k, i) => {
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

        let result = buildValue(trans.translations[language][group][item], params);

        return result;
    }
}