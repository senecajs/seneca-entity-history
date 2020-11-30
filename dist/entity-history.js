/* Copyright (c) 2020 voxgig and other contributors, MIT License */
/* $lab:coverage:off$ */
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* $lab:coverage:on$ */
const entity_history_doc_1 = __importDefault(require("./entity-history-doc"));
module.exports = entity_history;
module.exports.defaults = {
    ents: []
};
module.exports.errors = {};
module.exports.doc = entity_history_doc_1.default;
function entity_history(options) {
    const seneca = this;
    for (let canon of options.ents) {
        let ent_save_pat = Object.assign(Object.assign({}, seneca.util.Jsonic(canon)), { role: 'entity', cmd: 'save' });
        seneca.message(ent_save_pat, cmd_save_history);
    }
    seneca
        .fix('sys:enthist')
        .message('enthist:list', history_list)
        .message('entity:restore', entity_restore)
        .message('entity:load', entity_load);
    function cmd_save_history(msg, meta) {
        return __awaiter(this, void 0, void 0, function* () {
            let seneca = this;
            let entity$ = msg.ent.entity$;
            // console.log('+++EH', entity$, msg.ent.id)
            // Avoid infinite loops
            if (entity$.endsWith('sys/enthist') || entity$.endsWith('sys/entver')) {
                return this.prior(msg, meta);
            }
            // FIX: remove
            //if (!entity$.endsWith('core/fixture')) {
            //  return this.prior(msg, meta)
            //}
            let ent = seneca.entity(msg.ent);
            // console.log('ENT', entity$, ent)
            // TODO seneca-entity should return null, thus removing need for ?:
            let prev = null == ent.id ? null : yield ent.load$(ent.id);
            // console.log('PREV', ent.id, prev)
            let out = yield this.prior(msg, meta);
            let canon = out.canon$({ object: true });
            let fields = []; // changed fields
            if (prev) {
                let od = out.data$(false);
                let pd = prev.data$(false);
                let allkeysuniq = [...new Set([...Object.keys(od), ...Object.keys(pd)])];
                // console.log('ALLK', allkeysuniq)
                allkeysuniq.forEach((fn) => {
                    let ov = od[fn];
                    let pv = pd[fn];
                    let ot = typeof ov;
                    let pt = typeof pv;
                    // console.log('F', fn, ov, pv, ot, pt)
                    if (null != ov || null != pv) {
                        if ('object' === ot && 'object' === pt) {
                            fields.push(fn); // TODO: proper object data equiv test
                        }
                        else if (ov !== pv) {
                            fields.push(fn);
                        }
                    }
                });
            }
            // console.log('SAVE HIST PREV', prev, prev && prev.rtag)
            var who = {};
            // TODO: options
            if (meta.custom.principal) {
                who.avatar = meta.custom.principal.avatar;
                who.handle = meta.custom.principal.handle;
                who.name = meta.custom.principal.user.name;
                who.id = meta.custom.principal.user.id;
            }
            // don't wait for version handling to complete
            let entver = {
                ent_id: out.id,
                ent_rtag: out.rtag,
                prev_rtag: prev ? prev.rtag : '',
                fields: fields,
                base: canon.base,
                name: canon.name,
                when: Date.now(),
                who,
                d: out.data$(false),
            };
            console.log('EH entvar', entver);
            seneca
                .entity('sys/entver')
                .data$(entver)
                .save$(function (err, entver) {
                if (err)
                    return err;
                if (entver) {
                    this.entity('sys/enthist')
                        .data$({
                        ver_id: entver.id,
                        ent_id: out.id,
                        ent_rtag: out.rtag,
                        prev_rtag: entver.prev_rtag,
                        fields: fields,
                        base: canon.base,
                        name: canon.name,
                        when: entver.when,
                        // TODO: options
                        what: {
                            title: out.title
                        },
                        who,
                    })
                        .save$();
                }
            });
            return out;
            /*
              
          # sys:entity,cmd:save
          
          // msg$ is a special name - will attempt to unify with seneca inbound message
          msg$:
          ent:
            id: null | string
          
          out$: Entity // Entity is a type declatation, external provided
          
          prev: load$ msg$.ent.entity$ msg$.ent.id
          
          // null result will fail as cannot unify with Entity
          out$: prior$
          
          
          // conditionals
          result: if$ expr0 expr1
          
          // throwaway
          : if$ expr0 expr1
          
          // implicit throwaway
          if$ expr0 expr1
          
          // expr0 is truthy: true is non-nil
          
          // expr1 can't have side effects!!!
          // but does get it's own local context with access to top
          // you can only change top level at the top level
          if$ expr0 expr1
          
          
          if$ prev
          // indent is an implicit ()
          
          // equivs, generates: {base:string|null,name:string,}
          canon: /((?<base>\w+)/)?(?<name>\w+)$/ out$.entity$  // apply a regexp
          canon: out$.canon$  // recognize function, call it!
          
          fields: string[]  // types are values! unify!
          
          // get out of jail
          // lazy eval, unify passes if return val unifies
          fields => {
            if (prev) {
              ...js as above, $ is implicit context
            }
          }
          // NOTE: => is lazy, : is not - as you need well-defined order of persistence ops and msg calls
          
          
          field-keys: \ // multi line value, - in names as just valid JSON "field-keys"
            keys$ data$ out$ data$ prev  // keys$ list uniq keys of objects
            // data$ is entity.data$, handles null gracefully
            // (keys$ (data$ out$) (data$ prev)) // eager function calls
            // RHS is LISPish :)
          
          // push$ does not push nils, eq$/3 return /3 or nil (eq$ lhs rhs yesval?true$ noval?nil)
          // eq$ is intelligent and deep - unifies?!
          // prev[field] is nil if prev is nil
          fields: $reduce field-keys [] (changed,field)=>push$ changed eq$ out$[field] prev[field] field
          
          // save$ implicitly async
          entver: save$ sys/entver {
            ent_id: out$.id // RHS also an s-exp
            fields: fields
            base: canon.base
            name: canon.name
            when: now$
            d: data$ out$
          }
          
          // throw away result
          : save$ sys/enthist {
            ver_id: entver.id
            ent_id: out$.id
            fields: fields
            base: canon.base
            name: canon.name
            when: entver.when
          }
          
          // even top level is LISP really
          
          foo: bar
          (set$ 'foo' 'bar')  // where set operates on current context
          (set$ path expr)  // where set operates on current context
          
          // NOTE: set$ performs a unify at path point
          
          // possible engines:
          // https://github.com/maryrosecook/littlelisp/blob/master/littlelisp.js
          // https://jcubic.github.io/lips/
          // https://github.com/mishoo/SLip
          // http://synapticfailure.com/ai/lisp_js/
          // http://www.joeganley.com/code/jslisp.html
          // https://calormen.com/jisp/
          */
        });
    }
    function history_list(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            let seneca = this;
            // shortcut for repl use
            let entq = {
                id: msg.ent.id,
                base: msg.ent.base,
                name: msg.ent.name,
            };
            if (msg.ent.canon$) {
                let canon = msg.ent.canon$({ object: true });
                entq.base = canon.base;
                entq.name = canon.name;
            }
            let work = {
                histq: {
                    ent_id: entq.id,
                    base: entq.base,
                    name: entq.name,
                    sort$: { when: -1 },
                    limit$: msg.size,
                },
                out: {
                    ok: false,
                    items: [],
                },
            };
            work.out.items = yield seneca.entity('sys/enthist').list$(work.histq);
            work.out.ok = null != work.out.items;
            return work.out;
            /*
          
          # sys:enthist
          
          ## enthist:list
          msg$:
          ent:
            id: string
            base: string
            name: string
          size: 111
          histq:
          ent_id: msg$.ent.id
          base: msg$.ent.base
          name: msg$.ent.name
          sort$: when: -1
          limit$: msg$.size
          out$:
          ok => null != items  // lazy
          items: []
          
          // above are just insert operations on tree
          
          // operations on the tree are TFS unifications! (on subtrees)
          
          // all equiv
          out$.items: load$ sys/enthist histq
          out$:
          items: load$ sys/enthist histq
          out$: items: load$ sys/enthist histq
          
          
          // shortcut for
          out$.items: sys:entity,cmd:list,base:sys,name:enthist,q:.histq
          
              */
        });
    }
    function entity_restore(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            let seneca = this;
            // shortcut for repl use
            let work = {
                entverq: {
                    ent_id: msg.ent.ent_id,
                    id: msg.ent.ver_id,
                    base: msg.ent.base,
                    name: msg.ent.name,
                },
                ent_ver: {
                    d: null,
                },
                res_ent: {
                    resver_id: '',
                    data$: (d) => { },
                    save$: () => __awaiter(this, void 0, void 0, function* () { return ({}); }),
                },
                out$: {
                    ok: false,
                    item: {},
                },
            };
            // console.log(work.entverq)
            work.ent_ver = yield seneca.entity('sys/entver').load$(work.entverq);
            // console.log('ent_ver', work.ent_ver)
            if (work.ent_ver) {
                work.res_ent = yield seneca
                    // TODO: seneca-entity should support canon object here
                    .entity(msg.ent.base + '/' + msg.ent.name)
                    .load$(msg.ent.ent_id);
                // console.log('res_ent', work.res_ent)
                if (work.res_ent) {
                    work.res_ent.data$(work.ent_ver.d);
                    work.res_ent.resver_id = msg.ent.ver_id;
                    work.out$.item = yield work.res_ent.save$();
                    // console.log('res_ent saved', work.out$.item)
                }
            }
            work.out$.ok = null != work.out$.item;
            return work.out$;
            /*
        
        # entity:restore
        
        // maybe just use msg, out, and reserve suffix $ for built in functions?
        msg$:
          ent:
            ent_id: string
            ver_id: string
            base: string
            name: string,
        
        entverq:
          ent_id: msg$.ent.ent_id
          id: msg$.ent.ver_id
          base: msg$.ent.base
          name: msg$.ent.name
        
        ent_ver: load$ sys/entvar entverq
        
        if$ ent_ver
          res_ent: load$ (+ msg.ent.base '/' msg.ent.name) msg.ent.ent_id
        
          if$ res_ent
            data$ res_ent work.ent_ver.d  // implicit throwaway
            res_ent.resver_id: msg.ent.ver_id
            out$.item: save$ res_ent
        
        // OR
        out$.item:
          save$
            data$
              load$ (+ msg.ent.base '/' msg.ent.name) msg.ent.ent_id
              & {resver_id:msg.ent.ver_id} (.d load$ sys/entvar entverq) // & is unify
              // FIX load$ sys/entvar entverq may be null, then nothing should happen
              // nil should propogate upwards stopping everything
              // BUT how to handle ignorable empty vals?
              // nil === data$ foo nil
              // MAYBE: {} | .d load$ sys/entvar entverq
              //  as X | nil === X ???
              // is nil bottom? don't think so as not an error
        
        out$.ok = null != out$.item
        
            */
        });
    }
    function entity_load(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            let seneca = this;
            // shortcut for repl use
            let work = {
                entverq: {
                    ent_id: msg.ent.ent_id,
                    id: msg.ent.ver_id,
                    base: msg.ent.base,
                    name: msg.ent.name,
                },
                ent_ver: {
                    d: null,
                },
                out$: {
                    ok: false,
                    item: {},
                },
            };
            console.log('EH LOAD work init', work);
            // console.log(work.entverq)
            work.ent_ver = yield seneca.entity('sys/entver').load$(work.entverq);
            // console.log('ent_ver', work.ent_ver)
            if (work.ent_ver) {
                work.out$.item =
                    seneca
                        .entity(work.entverq.base + '/' + work.entverq.name)
                        .data$(work.ent_ver.d);
            }
            work.out$.ok = null != work.out$.item;
            return work.out$;
        });
    }
    return {
        name: 'entity-history',
    };
}
const intern = (module.exports.intern = {});
//# sourceMappingURL=entity-history.js.map