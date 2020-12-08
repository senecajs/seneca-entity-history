/* Copyright © 2020 Richard Rodger, MIT License */
'use strict'

const MsgTest = require('seneca-msg-test')
const LN = MsgTest.LN

module.exports = {
  print: true,
  test: true,
  log: false,
  fix: 'sys:entity,rig:history',
  allow: {
    missing: true,
  },
  calls: [
    LN({
      // handle upcoming change role:entity->sys:entity
      pattern: 'sys:entity,role:entity,role:entity,base:zed,name:foo,cmd:save',
      params: {
        // TODO: seneca-entity should reify this!!!
        ent: {
          id$: 'f01',
          x: 1,
          y: 'y01',
          entity$: 'zed/foo',
        },
      },
      out: {
        id: 'f01',
        x: 1,
        y: 'y01',
      },
    }),

    { pattern: 'role:mem-store,cmd:dump' },

    LN({
      pattern: 'entity:history',
      params: {
        ent: {
          id: 'f01',
          base: 'zed',
          name: 'foo',
        },
      },
      out: {
        ok: true,
        items: [{ ent_id: 'f01', fields: [], base: 'zed', name: 'foo' }],
      },
    }),

    LN({
      // handle upcoming change role:entity->sys:entity
      pattern: 'sys:entity,role:entity,role:entity,base:zed,name:foo,cmd:save',
      params: {
        // TODO: seneca-entity should reify this!!!
        ent: {
          id: 'f01',
          x: 2,
          y: 'y01',
          entity$: 'zed/foo',
        },
      },
      out: {
        id: 'f01',
        x: 2,
        y: 'y01',
      },
    }),

    // { print: true, pattern: 'role:mem-store,cmd:dump' },

    
    LN({
      name: 'h0',
      pattern: 'entity:history',
      params: {
        ent: {
          id: 'f01',
          base: 'zed',
          name: 'foo',
        },
      },
      out: {
        ok: true,
        items: [
          { ent_id: 'f01', fields: ['x'], base: 'zed', name: 'foo' },
          { ent_id: 'f01', fields: [], base: 'zed', name: 'foo' },
        ],
      },
    }),


    LN({
      // print: true,
      pattern: 'entity:load',
      params: {
        ent: {
          ent_id: 'f01',
          ver_id: '`h0:out.items[0].ver_id`',
          base: 'zed',
          name: 'foo',
        },
      },
      out: {
        ok: true,
        item: { 'entity$': '-/zed/foo', x: 2, y: 'y01', id: 'f01' }
      },
    }),

    LN({
      // print: true,
      pattern: 'entity:load',
      params: {
        ent: {
          id: 'f01',
          ver_id: '`h0:out.items[1].ver_id`',
          base: 'zed',
          name: 'foo',
        },
      },
      out: {
        ok: true,
        item: { 'entity$': '-/zed/foo', x: 1, y: 'y01', id: 'f01' }
      },
    }),

    LN({
      // print: true,
      pattern: 'entity:restore',
      params: {
        ent: {
          id: 'f01',
          ver_id: '`h0:out.items[1].ver_id`',
          base: 'zed',
          name: 'foo',
        },
      },
      out: {
        ok: true,
        item: {
          'entity$': '-/zed/foo',
          x: 1,
          y: 'y01',
          id: 'f01',
          resver_id: '`h0:out.items[1].ver_id`',
        }
      },
    }),


    LN({
      name: 'h1',
      pattern: 'entity:history',
      params: {
        ent: {
          id: 'f01',
          base: 'zed',
          name: 'foo',
        },
      },
      out: {
        ok: true,
        items: [
          { ent_id: 'f01', fields: ['x'], base: 'zed', name: 'foo' },
          { ent_id: 'f01', fields: ['x'], base: 'zed', name: 'foo' },
          { ent_id: 'f01', fields: [], base: 'zed', name: 'foo' },
        ],
      },
    }),

    // { print: true, pattern: 'role:mem-store,cmd:dump' },

    // TODO: handle mongo style queries in mem-store
    LN({
      pattern: 'entity:history',
      params: {
        ent: {
          id: 'f01',
          base: 'zed',
          name: 'foo',
        },
        diff: {
          ver_id: '`h1:out.items[1].id`'
        }
      },
      out: {
        ok: true,
        items: [
          { ent_id: 'f01', fields: ['x'], base: 'zed', name: 'foo' },
          { ent_id: 'f01', fields: ['x'], base: 'zed', name: 'foo' },
        ],
        changed: ['x']
      },
    }),

    
  ],
}
