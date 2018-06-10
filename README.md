## VueJs Translations :shipit:

Hello everybody! I'm glad to present you a library to support the translations in your Vue project.
This translations component is very similar to Laravel Translations. You can setup inline params in your locale if needed.
Installation is very simple, in a few steps:

```shell
npm i vue-translations
```

You need to setup locale file for yourself.
```javascript
// locales.js
export default {
    en: {
        home: {
            header: 'My best project ever',
        },
    },
    ru: {
        home: {
            header: 'Мой лучший проект в жизни',
        },
    },
};
```

```javascript
import VueTranslation from 'vue-translations'
import locales from './locales.js';

Vue.use(VueTranslations);

new Vue({
    mounted() {
        // setup from one method
        this.$translations.setup('en', locales);
        // another methods:
        // change current language
        this.$translations.setLang('en');
        // load locales
        this.$translations.load(locales);
    },
    render: (h) => h,
});
```

Use it in your projects is easy!
```javascript
<template>
    <div v-text="__t('home.header')" />
</template>
```

### Inline params

Into your locale file
```javascript
en: {
        home: {
            header: 'My best project - :name',
        },
    },
},
```

Into your application
```javascript
<div v-text="__t('home.header', { name: 'Project' })" />
// output: My best project - Project
```

