![Seneca](http://senecajs.org/files/assets/seneca-logo.png)
> A [Seneca.js](http://senecajs.org) plugin

# @seneca/entity-history

[![npm version](https://img.shields.io/npm/v/@seneca/entity-history.svg)](https://npmjs.com/package/@seneca/entity-history)
[![build](https://github.com/senecajs/seneca-entity-history/actions/workflows/build.yml/badge.svg)](https://github.com/senecajs/seneca-entity-history/actions/workflows/build.yml)
[![Known Vulnerabilities](https://snyk.io/test/github/senecajs/seneca-entity-history/badge.svg)](https://snyk.io/test/github/senecajs/seneca-entity-history)
[![Coverage Status](https://coveralls.io/repos/github/senecajs/seneca-entity-history/badge.svg?branch=main)](https://coveralls.io/github/senecajs/seneca-entity-history?branch=main)
[![Maintainability](https://api.codeclimate.com/v1/badges/0b1990c4264d66b01c50/maintainability)](https://codeclimate.com/github/senecajs/seneca-entity-history/maintainability)
[![DeepScan grade](https://deepscan.io/api/teams/5016/projects/14231/branches/259194/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=5016&pid=14231&bid=259194)

| ![Voxgig](https://www.voxgig.com/res/img/vgt01r.png) | This open source module is sponsored and supported by [Voxgig](https://www.voxgig.com). |
|---|---|

## Install

```sh
npm install @seneca/entity-history
```

## Quick Example

```js
require('seneca')()
  .use('@seneca/entity-history')
```

## More Examples

See [test/](test/) for more usage examples.

## Motivation

Tracks history of changes to Seneca entities.

## Support

If you're using this module and need help, you can:

- Post a [github issue](https://github.com/senecajs/seneca-entity-history/issues)
- Tweet to [@senecajs](http://twitter.com/senecajs)
- Ask on the [Gitter](https://gitter.im/senecajs/seneca)

## API

### Options

* `` : object <i><small>"&nbsp;"</small></i>

Set plugin options when loading with:
```js
seneca.use('entity-history', { name: value, ... })

```

<small>Note: <code>foo.bar</code> in the list above means 
<code>{ foo: { bar: ... } }</code></small> 

<!--END:options-->

<!--START:action-list-->

### Action Patterns

* [role:entity,cmd:save](#-roleentitycmdsave-)
* [sys:enthist,enthist:list](#-sysenthistenthistlist-)
* [sys:enthist,entity:restore](#-sysenthistentityrestore-)

<!--END:action-list-->

<!--START:action-desc-->

### Action Descriptions

### &laquo; `role:entity,cmd:save` &raquo;

No description provided.

----------
### &laquo; `sys:enthist,enthist:list` &raquo;

No description provided.

----------
### &laquo; `sys:enthist,entity:restore` &raquo;

No description provided.

----------

<!--END:action-desc-->

## Contributing

The [Senecajs org](https://github.com/senecajs/) encourages open participation. If you feel you can help in any way, be it with documentation, examples, extra testing, or new features please get in touch.

### Running tests

```sh
npm run test
```

## Background

Works with [seneca-entity](https://github.com/senecajs/seneca-entity) to track entity changes.
