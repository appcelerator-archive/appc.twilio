# openapi-doc

![npm](https://img.shields.io/npm/v/openapi-doc.svg) ![license](https://img.shields.io/npm/l/openapi-doc.svg) ![github-issues](https://img.shields.io/github/issues/appcelerator/openapi-doc.svg)  ![Circle CI build status](https://circleci.com/gh/appcelerator/openapi-doc.svg?style=svg)

OpenAPI (Swagger 2.0) document builder.

![nodei.co](https://nodei.co/npm/openapi-doc.png?downloads=true&downloadRank=true&stars=true)

![travis-status](https://img.shields.io/travis/appcelerator/openapi-doc.svg)
![stars](https://img.shields.io/github/stars/appcelerator/openapi-doc.svg)
![forks](https://img.shields.io/github/forks/appcelerator/openapi-doc.svg)

![forks](https://img.shields.io/github/forks/appcelerator/openapi-doc.svg)

![](https://david-dm.org/appcelerator/openapi-doc/status.svg)
![](https://david-dm.org/appcelerator/openapi-doc/dev-status.svg)

## Features


## Install

`npm install --save openapi-doc`


## Scripts

 - **npm run build** : `if-env NODE_ENV=production && npm run build:prod || npm run build:dev`
 - **npm run build:dev** : `npm run build:lint && npm run test && npm run build:readme && npm run build:doc && babel -d ./dist ./src`
 - **npm run build:doc** : `esdoc -c esdoc.json`
 - **npm run build:lint** : `eslint ./src`
 - **npm run build:prod** : `npm prune --production`
 - **npm run build:readme** : `node-readme`
 - **npm run clean** : `rimraf dist coverage doc README.md`
 - **npm run posttest** : `istanbul check-coverage coverage/coverage.json --line 80 --branch 80 --statement 80`
 - **npm run release:publish** : `git add -A && git push && git push --tags && npm publish`
 - **npm run release:major** : `npm version major && npm run release:publish && git push --follow-tags`
 - **npm run release:minor** : `npm version minor && npm run release:publish && git push --follow-tags`
 - **npm run release:patch** : `npm version patch && npm run release:publish && git push --follow-tags`
 - **npm run release:prerelease** : `npm version prerelease && npm run release:publish && git push --follow-tags`
 - **npm run test** : `rm -rf coverage && NODE_ENV=test istanbul cover _mocha -- -R spec`

## Dependencies

Package | Version | Dev
--- |:---:|:---:
[if-env](https://www.npmjs.com/package/if-env) | ^1.0.0 | ✖
[babel-cli](https://www.npmjs.com/package/babel-cli) | ^6.3.17 | ✔
[babel-eslint](https://www.npmjs.com/package/babel-eslint) | ^6.1.2 | ✔
[babel-preset-es2015](https://www.npmjs.com/package/babel-preset-es2015) | * | ✔
[chai](https://www.npmjs.com/package/chai) | ^3.5.0 | ✔
[esdoc](https://www.npmjs.com/package/esdoc) | ^0.4.8 | ✔
[eslint](https://www.npmjs.com/package/eslint) | ^3.5.0 | ✔
[eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb) | ^11.1.0 | ✔
[eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import) | ^1.15.0 | ✔
[eslint-plugin-jsx-a11y](https://www.npmjs.com/package/eslint-plugin-jsx-a11y) | ^2.2.2 | ✔
[eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react) | ^6.2.2 | ✔
[istanbul](https://www.npmjs.com/package/istanbul) | ^0.4.5 | ✔
[mocha](https://www.npmjs.com/package/mocha) | ^3.0.2 | ✔
[node-readme](https://www.npmjs.com/package/node-readme) | ^0.1.8 | ✔
[rimraf](https://www.npmjs.com/package/rimraf) | ^2.5.4 | ✔
[swagger-parser](https://www.npmjs.com/package/swagger-parser) | ^3.4.1 | ✔


## Contributing

Contributions welcome; Please submit all pull requests the against master branch. If your pull request contains JavaScript patches or features, you should include relevant unit tests. Please check the [Contributing Guidelines](contributng.md) for more details. Thanks!

## Author

Axway <support@axway.com> https://axway.com

## License

 - **SEE LICENCE IN LICENCE** : null
