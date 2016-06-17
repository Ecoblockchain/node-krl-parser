// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }


var last = function(arr){
  return arr[arr.length - 1];
};

var lastEndLoc = function(data){
  var nodes = flatten([data]);
  var i, node;
  for(i = nodes.length - 1; i >= 0; i--){
    node = nodes[i];
    if(node && node.loc){
      return node.loc.end;
    }else if(typeof node === "number"){
      return node;
    }
  }
  return -1;
};

var flatten = function(toFlatten){
  var isArray = Object.prototype.toString.call(toFlatten) === '[object Array]';

  if (isArray && toFlatten.length > 0) {
    var head = toFlatten[0];
    var tail = toFlatten.slice(1);

    return flatten(head).concat(flatten(tail));
  } else {
    return [].concat(toFlatten);
  }
};

var get = function(o, path, dflt){
  if(!path || !path.length){
    return dflt;
  }
  var cur = o;
  var i;
  for(i = 0; i < path.length; i++){
    if(!cur){
      return dflt;
    }
    if(cur.hasOwnProperty(path[i])){
      cur = cur[path[i]];
    }else{
      return dflt;
    }
  }
  return cur;
};

var reserved_identifiers = {
  "function": true,
  "true": true,
  "false": true
};

////////////////////////////////////////////////////////////////////////////////
// ast functions
var noop = function(){};
var noopStr = function(){return ""};
var noopArr = function(){return []};
var idAll = function(d){return flatten(d).join('')};
var idArr = function(d){return [d[0]]};
var idEndLoc = function(data, start){return start + flatten(data).join('').length};

var getN = function(n){
  return function(data){
    return data[n];
  };
};

var infixEventOp = function(data, start){
  return {
    loc: {start: start, end: data[4].loc.end},
    type: 'EventOperator',
    op: data[2],
    args: [data[0], data[4]]//not all event ops have left/right
  };
};

var complexEventOp = function(op){
  var arg_indices = Array.prototype.slice.call(arguments, 1);
  return function(data, start){
    return {
      loc: {start: start, end: lastEndLoc(data)},
      type: 'EventOperator',
      op: op,
      args: flatten(arg_indices.map(function(i){
        return data[i];
      }))
    };
  };
};

var booleanAST = function(value){
  return function(data, loc){
    var src = data[0];
    return {
      loc: {start: loc, end: loc + src.length},
      type: 'Boolean',
      value: value
    };
  };
};

var infixOp = function(data, start){
  return {
    loc: {start: start, end: data[4].loc.end},
    type: 'InfixOperator',
    op: data[2],
    left: data[0],
    right: data[4]
  };
};

var RulePostlude_by_paths = function(fired_i, notfired_i, always_i){
  return function(data, start){
    return {
      loc: {start: start, end: lastEndLoc(data)},
      type: 'RulePostlude',
      fired: get(data, fired_i, null),
      notfired: get(data, notfired_i, null),
      always: get(data, always_i, null),
    };
  };
};

var MemberExpression_method = function(method){
  return function(data, start){
    return {
      loc: {start: start, end: lastEndLoc(data)},
      type: 'MemberExpression',
      object: data[0],
      property: data[4],
      method: method
    };
  };
};

var grammar = {
    ParserRules: [
    {"name": "main", "symbols": ["_", "ruleset", "_"], "postprocess": getN(1)},
    {"name": "main", "symbols": ["_", "list_Statement", "_"], "postprocess": getN(1)},
    {"name": "ruleset$string$1", "symbols": [{"literal":"r"}, {"literal":"u"}, {"literal":"l"}, {"literal":"e"}, {"literal":"s"}, {"literal":"e"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ruleset$ebnf$1$subexpression$1$string$1", "symbols": [{"literal":"m"}, {"literal":"e"}, {"literal":"t"}, {"literal":"a"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ruleset$ebnf$1$subexpression$1", "symbols": ["ruleset$ebnf$1$subexpression$1$string$1", "_", "ruleset_meta_block", "_"]},
    {"name": "ruleset$ebnf$1", "symbols": ["ruleset$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "ruleset$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ruleset$ebnf$2$subexpression$1$string$1", "symbols": [{"literal":"g"}, {"literal":"l"}, {"literal":"o"}, {"literal":"b"}, {"literal":"a"}, {"literal":"l"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ruleset$ebnf$2$subexpression$1", "symbols": ["ruleset$ebnf$2$subexpression$1$string$1", "_", "declaration_block", "_"]},
    {"name": "ruleset$ebnf$2", "symbols": ["ruleset$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "ruleset$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ruleset$ebnf$3", "symbols": []},
    {"name": "ruleset$ebnf$3$subexpression$1", "symbols": ["rule", "_"]},
    {"name": "ruleset$ebnf$3", "symbols": ["ruleset$ebnf$3$subexpression$1", "ruleset$ebnf$3"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "ruleset", "symbols": ["ruleset$string$1", "__", "Identifier", "_", {"literal":"{"}, "_", "ruleset$ebnf$1", "ruleset$ebnf$2", "ruleset$ebnf$3", "loc_close_curly"], "postprocess": 
        function(data, loc){
          return {
            loc: {start: loc, end: last(data)},
            type: 'Ruleset',
            name: data[2],
            meta: data[6] ? data[6][2] : [],
            global: data[7] ? data[7][2] : [],
            rules: data[8].map(function(pair){
              return pair[0];
            })
          };
        }
        },
    {"name": "ruleset_meta_block", "symbols": [{"literal":"{"}, "_", {"literal":"}"}], "postprocess": noopArr},
    {"name": "ruleset_meta_block", "symbols": [{"literal":"{"}, "_", "ruleset_meta_prop_list", "_", {"literal":"}"}], "postprocess": getN(2)},
    {"name": "ruleset_meta_prop_list", "symbols": ["ruleset_meta_prop"], "postprocess": idArr},
    {"name": "ruleset_meta_prop_list", "symbols": ["ruleset_meta_prop_list", "__", "ruleset_meta_prop"], "postprocess": function(d){return d[0].concat([d[2]])}},
    {"name": "ruleset_meta_prop", "symbols": ["Keyword", "__", "Expression"], "postprocess": 
        function(data, start){
          return {
            loc: {start: start, end: data[2].loc.end},
            type: 'RulesetMetaProperty',
            key: data[0],
            value: data[2]
          };
        }
        },
    {"name": "Keyword$ebnf$1", "symbols": []},
    {"name": "Keyword$ebnf$1", "symbols": [/[a-zA-Z0-9_$]/, "Keyword$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "Keyword", "symbols": [/[a-zA-Z_$]/, "Keyword$ebnf$1"], "postprocess": 
        function(data, loc, reject){
          var src = flatten(data).join('');
          return {
            loc: {start: loc, end: loc + src.length},
            type: 'Keyword',
            value: src
          };
        }
        },
    {"name": "rule$string$1", "symbols": [{"literal":"r"}, {"literal":"u"}, {"literal":"l"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "rule$ebnf$1$subexpression$1$string$1", "symbols": [{"literal":"i"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "rule$ebnf$1$subexpression$1", "symbols": ["__", "rule$ebnf$1$subexpression$1$string$1", "__", "rule_state"]},
    {"name": "rule$ebnf$1", "symbols": ["rule$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "rule$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "rule$ebnf$2$subexpression$1$string$1", "symbols": [{"literal":"s"}, {"literal":"e"}, {"literal":"l"}, {"literal":"e"}, {"literal":"c"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "rule$ebnf$2$subexpression$1$string$2", "symbols": [{"literal":"w"}, {"literal":"h"}, {"literal":"e"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "rule$ebnf$2$subexpression$1$ebnf$1$subexpression$1", "symbols": [{"literal":";"}, "_"]},
    {"name": "rule$ebnf$2$subexpression$1$ebnf$1", "symbols": ["rule$ebnf$2$subexpression$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "rule$ebnf$2$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "rule$ebnf$2$subexpression$1", "symbols": ["rule$ebnf$2$subexpression$1$string$1", "__", "rule$ebnf$2$subexpression$1$string$2", "__", "EventExpression", "_", "rule$ebnf$2$subexpression$1$ebnf$1"]},
    {"name": "rule$ebnf$2", "symbols": ["rule$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "rule$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "rule$ebnf$3$subexpression$1$string$1", "symbols": [{"literal":"p"}, {"literal":"r"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "rule$ebnf$3$subexpression$1", "symbols": ["rule$ebnf$3$subexpression$1$string$1", "_", "declaration_block", "_"]},
    {"name": "rule$ebnf$3", "symbols": ["rule$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "rule$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "rule$ebnf$4$subexpression$1", "symbols": ["RuleActionBlock", "_"]},
    {"name": "rule$ebnf$4", "symbols": ["rule$ebnf$4$subexpression$1"], "postprocess": id},
    {"name": "rule$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "rule$ebnf$5$subexpression$1", "symbols": ["RulePostlude", "_"]},
    {"name": "rule$ebnf$5", "symbols": ["rule$ebnf$5$subexpression$1"], "postprocess": id},
    {"name": "rule$ebnf$5", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "rule", "symbols": ["rule$string$1", "__", "Identifier", "rule$ebnf$1", "_", {"literal":"{"}, "_", "rule$ebnf$2", "rule$ebnf$3", "rule$ebnf$4", "rule$ebnf$5", "loc_close_curly"], "postprocess": 
        function(data, loc){
          return {
            loc: {start: loc, end: last(data)},
            type: 'Rule',
            name: data[2],
            rule_state: data[3] ? data[3][3] : "active",
            select_when: data[7] && data[7][4],
            prelude: data[8] ? data[8][2] : [],
            action_block: data[9] && data[9][0],
            postlude: data[10] && data[10][0]
          };
        }
        },
    {"name": "rule_state$string$1", "symbols": [{"literal":"a"}, {"literal":"c"}, {"literal":"t"}, {"literal":"i"}, {"literal":"v"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "rule_state", "symbols": ["rule_state$string$1"], "postprocess": id},
    {"name": "rule_state$string$2", "symbols": [{"literal":"i"}, {"literal":"n"}, {"literal":"a"}, {"literal":"c"}, {"literal":"t"}, {"literal":"i"}, {"literal":"v"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "rule_state", "symbols": ["rule_state$string$2"], "postprocess": id},
    {"name": "EventExpression", "symbols": ["event_exp_within"], "postprocess": id},
    {"name": "event_exp_within", "symbols": ["event_exp_or"], "postprocess": id},
    {"name": "event_exp_within$string$1", "symbols": [{"literal":"w"}, {"literal":"i"}, {"literal":"t"}, {"literal":"h"}, {"literal":"i"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "event_exp_within", "symbols": ["event_exp_within", "__", "event_exp_within$string$1", "__", "PositiveInteger", "__", "time_period"], "postprocess": complexEventOp("within", 0, 4, 6)},
    {"name": "event_exp_or", "symbols": ["event_exp_and"], "postprocess": id},
    {"name": "event_exp_or$string$1", "symbols": [{"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "event_exp_or", "symbols": ["event_exp_or", "__", "event_exp_or$string$1", "__", "event_exp_and"], "postprocess": infixEventOp},
    {"name": "event_exp_and", "symbols": ["event_exp_infix_op"], "postprocess": id},
    {"name": "event_exp_and$string$1", "symbols": [{"literal":"a"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "event_exp_and", "symbols": ["event_exp_and", "__", "event_exp_and$string$1", "__", "event_exp_infix_op"], "postprocess": infixEventOp},
    {"name": "event_exp_infix_op", "symbols": ["event_exp_fns"], "postprocess": id},
    {"name": "event_exp_infix_op$string$1", "symbols": [{"literal":"b"}, {"literal":"e"}, {"literal":"f"}, {"literal":"o"}, {"literal":"r"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "event_exp_infix_op", "symbols": ["event_exp_infix_op", "__", "event_exp_infix_op$string$1", "__", "event_exp_fns"], "postprocess": infixEventOp},
    {"name": "event_exp_infix_op$string$2", "symbols": [{"literal":"t"}, {"literal":"h"}, {"literal":"e"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "event_exp_infix_op", "symbols": ["event_exp_infix_op", "__", "event_exp_infix_op$string$2", "__", "event_exp_fns"], "postprocess": infixEventOp},
    {"name": "event_exp_infix_op$string$3", "symbols": [{"literal":"a"}, {"literal":"f"}, {"literal":"t"}, {"literal":"e"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "event_exp_infix_op", "symbols": ["event_exp_infix_op", "__", "event_exp_infix_op$string$3", "__", "event_exp_fns"], "postprocess": infixEventOp},
    {"name": "event_exp_fns", "symbols": ["event_exp_base"], "postprocess": id},
    {"name": "event_exp_fns$string$1", "symbols": [{"literal":"b"}, {"literal":"e"}, {"literal":"t"}, {"literal":"w"}, {"literal":"e"}, {"literal":"e"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "event_exp_fns", "symbols": ["event_exp_fns", "__", "event_exp_fns$string$1", "_", {"literal":"("}, "_", "EventExpression", "_", {"literal":","}, "_", "EventExpression", "_", "loc_close_paren"], "postprocess": complexEventOp("between", 0, 6, 10)},
    {"name": "event_exp_fns$string$2", "symbols": [{"literal":"n"}, {"literal":"o"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "event_exp_fns$string$3", "symbols": [{"literal":"b"}, {"literal":"e"}, {"literal":"t"}, {"literal":"w"}, {"literal":"e"}, {"literal":"e"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "event_exp_fns", "symbols": ["event_exp_fns", "__", "event_exp_fns$string$2", "__", "event_exp_fns$string$3", "_", {"literal":"("}, "_", "EventExpression", "_", {"literal":","}, "_", "EventExpression", "_", "loc_close_paren"], "postprocess": complexEventOp("not between", 0, 8, 12)},
    {"name": "event_exp_fns$string$4", "symbols": [{"literal":"a"}, {"literal":"n"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "event_exp_fns", "symbols": ["event_exp_fns$string$4", "__", "PositiveInteger", "_", {"literal":"("}, "_", "list_EventExpression", "_", "loc_close_paren"], "postprocess": complexEventOp("any", 2, 6)},
    {"name": "event_exp_fns$string$5", "symbols": [{"literal":"c"}, {"literal":"o"}, {"literal":"u"}, {"literal":"n"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "event_exp_fns", "symbols": ["event_exp_fns$string$5", "__", "PositiveInteger", "_", {"literal":"("}, "_", "EventExpression", "_", "loc_close_paren"], "postprocess": complexEventOp("count", 2, 6)},
    {"name": "event_exp_fns$string$6", "symbols": [{"literal":"r"}, {"literal":"e"}, {"literal":"p"}, {"literal":"e"}, {"literal":"a"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "event_exp_fns", "symbols": ["event_exp_fns$string$6", "__", "PositiveInteger", "_", {"literal":"("}, "_", "EventExpression", "_", "loc_close_paren"], "postprocess": complexEventOp("repeat", 2, 6)},
    {"name": "event_exp_fns$string$7", "symbols": [{"literal":"a"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "event_exp_fns", "symbols": ["event_exp_fns$string$7", "_", {"literal":"("}, "_", "list_EventExpression", "_", "loc_close_paren"], "postprocess": complexEventOp("and", 4)},
    {"name": "event_exp_fns$string$8", "symbols": [{"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "event_exp_fns", "symbols": ["event_exp_fns$string$8", "_", {"literal":"("}, "_", "list_EventExpression", "_", "loc_close_paren"], "postprocess": complexEventOp("or", 4)},
    {"name": "event_exp_fns$string$9", "symbols": [{"literal":"b"}, {"literal":"e"}, {"literal":"f"}, {"literal":"o"}, {"literal":"r"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "event_exp_fns", "symbols": ["event_exp_fns$string$9", "_", {"literal":"("}, "_", "list_EventExpression", "_", "loc_close_paren"], "postprocess": complexEventOp("before", 4)},
    {"name": "event_exp_fns$string$10", "symbols": [{"literal":"t"}, {"literal":"h"}, {"literal":"e"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "event_exp_fns", "symbols": ["event_exp_fns$string$10", "_", {"literal":"("}, "_", "list_EventExpression", "_", "loc_close_paren"], "postprocess": complexEventOp("then", 4)},
    {"name": "event_exp_fns$string$11", "symbols": [{"literal":"a"}, {"literal":"f"}, {"literal":"t"}, {"literal":"e"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "event_exp_fns", "symbols": ["event_exp_fns$string$11", "_", {"literal":"("}, "_", "list_EventExpression", "_", "loc_close_paren"], "postprocess": complexEventOp("after", 4)},
    {"name": "event_exp_fns$string$12", "symbols": [{"literal":"m"}, {"literal":"a"}, {"literal":"x"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "event_exp_fns", "symbols": ["event_exp_fns", "__", "event_exp_fns$string$12", "_", {"literal":"("}, "_", "function_params", "_", "loc_close_paren"], "postprocess": complexEventOp("max", 0, 6)},
    {"name": "event_exp_fns$string$13", "symbols": [{"literal":"m"}, {"literal":"i"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "event_exp_fns", "symbols": ["event_exp_fns", "__", "event_exp_fns$string$13", "_", {"literal":"("}, "_", "function_params", "_", "loc_close_paren"], "postprocess": complexEventOp("min", 0, 6)},
    {"name": "event_exp_fns$string$14", "symbols": [{"literal":"s"}, {"literal":"u"}, {"literal":"m"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "event_exp_fns", "symbols": ["event_exp_fns", "__", "event_exp_fns$string$14", "_", {"literal":"("}, "_", "function_params", "_", "loc_close_paren"], "postprocess": complexEventOp("sum", 0, 6)},
    {"name": "event_exp_fns$string$15", "symbols": [{"literal":"a"}, {"literal":"v"}, {"literal":"g"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "event_exp_fns", "symbols": ["event_exp_fns", "__", "event_exp_fns$string$15", "_", {"literal":"("}, "_", "function_params", "_", "loc_close_paren"], "postprocess": complexEventOp("avg", 0, 6)},
    {"name": "event_exp_fns$string$16", "symbols": [{"literal":"p"}, {"literal":"u"}, {"literal":"s"}, {"literal":"h"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "event_exp_fns", "symbols": ["event_exp_fns", "__", "event_exp_fns$string$16", "_", {"literal":"("}, "_", "function_params", "_", "loc_close_paren"], "postprocess": complexEventOp("push", 0, 6)},
    {"name": "event_exp_base", "symbols": [{"literal":"("}, "_", "EventExpression", "_", {"literal":")"}], "postprocess": getN(2)},
    {"name": "event_exp_base$ebnf$1$subexpression$1$string$1", "symbols": [{"literal":"w"}, {"literal":"h"}, {"literal":"e"}, {"literal":"r"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "event_exp_base$ebnf$1$subexpression$1", "symbols": ["__", "event_exp_base$ebnf$1$subexpression$1$string$1", "__", "Expression"]},
    {"name": "event_exp_base$ebnf$1", "symbols": ["event_exp_base$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "event_exp_base$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "event_exp_base$ebnf$2$subexpression$1$string$1", "symbols": [{"literal":"s"}, {"literal":"e"}, {"literal":"t"}, {"literal":"t"}, {"literal":"i"}, {"literal":"n"}, {"literal":"g"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "event_exp_base$ebnf$2$subexpression$1", "symbols": ["__", "event_exp_base$ebnf$2$subexpression$1$string$1", "_", {"literal":"("}, "_", "function_params", "_", "loc_close_paren"]},
    {"name": "event_exp_base$ebnf$2", "symbols": ["event_exp_base$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "event_exp_base$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "event_exp_base", "symbols": ["Identifier", "__", "Identifier", "event_exp_attribute_pairs", "event_exp_base$ebnf$1", "event_exp_base$ebnf$2"], "postprocess": 
        function(data, start){
          return {
            type: 'EventExpression',
            loc: {start: start, end: lastEndLoc(data)},
            event_domain: data[0],
            event_type: data[2],
            attributes: data[3],
            where: data[4] && data[4][3],
            setting: (data[5] && data[5][5]) || []
          };
        }
        },
    {"name": "event_exp_attribute_pairs", "symbols": [], "postprocess": noopArr},
    {"name": "event_exp_attribute_pairs", "symbols": ["event_exp_attribute_pair"], "postprocess": idArr},
    {"name": "event_exp_attribute_pairs", "symbols": ["event_exp_attribute_pairs", "__", "event_exp_attribute_pair"], "postprocess": function(d){return d[0].concat([d[2]])}},
    {"name": "event_exp_attribute_pair", "symbols": ["Identifier", "__", "RegExp"], "postprocess": 
        function(data, start){
          return {
            loc: {start: start, end: data[2].loc.end},
            type: 'AttributeMatch',
            key: data[0],
            value: data[2]
          };
        }
        },
    {"name": "list_EventExpression", "symbols": ["EventExpression"], "postprocess": idArr},
    {"name": "list_EventExpression", "symbols": ["list_EventExpression", "_", {"literal":","}, "_", "EventExpression"], "postprocess": function(d){return d[0].concat([d[4]])}},
    {"name": "time_period", "symbols": ["time_period_enum"], "postprocess": 
        function(data, start){
          var src = data[0][0];
          return {
            loc: {start: start, end: start + src.length},
            type: 'String',
            value: src
          };
        }
        },
    {"name": "time_period_enum$string$1", "symbols": [{"literal":"y"}, {"literal":"e"}, {"literal":"a"}, {"literal":"r"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "time_period_enum", "symbols": ["time_period_enum$string$1"]},
    {"name": "time_period_enum$string$2", "symbols": [{"literal":"m"}, {"literal":"o"}, {"literal":"n"}, {"literal":"t"}, {"literal":"h"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "time_period_enum", "symbols": ["time_period_enum$string$2"]},
    {"name": "time_period_enum$string$3", "symbols": [{"literal":"w"}, {"literal":"e"}, {"literal":"e"}, {"literal":"k"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "time_period_enum", "symbols": ["time_period_enum$string$3"]},
    {"name": "time_period_enum$string$4", "symbols": [{"literal":"d"}, {"literal":"a"}, {"literal":"y"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "time_period_enum", "symbols": ["time_period_enum$string$4"]},
    {"name": "time_period_enum$string$5", "symbols": [{"literal":"h"}, {"literal":"o"}, {"literal":"u"}, {"literal":"r"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "time_period_enum", "symbols": ["time_period_enum$string$5"]},
    {"name": "time_period_enum$string$6", "symbols": [{"literal":"m"}, {"literal":"i"}, {"literal":"n"}, {"literal":"u"}, {"literal":"t"}, {"literal":"e"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "time_period_enum", "symbols": ["time_period_enum$string$6"]},
    {"name": "time_period_enum$string$7", "symbols": [{"literal":"s"}, {"literal":"e"}, {"literal":"c"}, {"literal":"o"}, {"literal":"n"}, {"literal":"d"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "time_period_enum", "symbols": ["time_period_enum$string$7"]},
    {"name": "time_period_enum$string$8", "symbols": [{"literal":"y"}, {"literal":"e"}, {"literal":"a"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "time_period_enum", "symbols": ["time_period_enum$string$8"]},
    {"name": "time_period_enum$string$9", "symbols": [{"literal":"m"}, {"literal":"o"}, {"literal":"n"}, {"literal":"t"}, {"literal":"h"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "time_period_enum", "symbols": ["time_period_enum$string$9"]},
    {"name": "time_period_enum$string$10", "symbols": [{"literal":"w"}, {"literal":"e"}, {"literal":"e"}, {"literal":"k"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "time_period_enum", "symbols": ["time_period_enum$string$10"]},
    {"name": "time_period_enum$string$11", "symbols": [{"literal":"d"}, {"literal":"a"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "time_period_enum", "symbols": ["time_period_enum$string$11"]},
    {"name": "time_period_enum$string$12", "symbols": [{"literal":"h"}, {"literal":"o"}, {"literal":"u"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "time_period_enum", "symbols": ["time_period_enum$string$12"]},
    {"name": "time_period_enum$string$13", "symbols": [{"literal":"m"}, {"literal":"i"}, {"literal":"n"}, {"literal":"u"}, {"literal":"t"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "time_period_enum", "symbols": ["time_period_enum$string$13"]},
    {"name": "time_period_enum$string$14", "symbols": [{"literal":"s"}, {"literal":"e"}, {"literal":"c"}, {"literal":"o"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "time_period_enum", "symbols": ["time_period_enum$string$14"]},
    {"name": "RuleActionBlock$ebnf$1$subexpression$1$string$1", "symbols": [{"literal":"i"}, {"literal":"f"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "RuleActionBlock$ebnf$1$subexpression$1$string$2", "symbols": [{"literal":"t"}, {"literal":"h"}, {"literal":"e"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "RuleActionBlock$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["action_block_type", "__"]},
    {"name": "RuleActionBlock$ebnf$1$subexpression$1$ebnf$1", "symbols": ["RuleActionBlock$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "RuleActionBlock$ebnf$1$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "RuleActionBlock$ebnf$1$subexpression$1", "symbols": ["RuleActionBlock$ebnf$1$subexpression$1$string$1", "__", "Expression", "__", "RuleActionBlock$ebnf$1$subexpression$1$string$2", "__", "RuleActionBlock$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "RuleActionBlock$ebnf$1", "symbols": ["RuleActionBlock$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "RuleActionBlock$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "RuleActionBlock", "symbols": ["RuleActionBlock$ebnf$1", "RuleActions"], "postprocess": 
        function(data, start){
          return {
            loc: {start: start, end: lastEndLoc(data)},
            type: 'RuleActionBlock',
            condition: data[0] && data[0][2],
            block_type: get(data, [0, 6, 0], "every"),
            actions: data[1]
          };
        }
        },
    {"name": "action_block_type$string$1", "symbols": [{"literal":"c"}, {"literal":"h"}, {"literal":"o"}, {"literal":"o"}, {"literal":"s"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "action_block_type", "symbols": ["action_block_type$string$1"], "postprocess": id},
    {"name": "action_block_type$string$2", "symbols": [{"literal":"e"}, {"literal":"v"}, {"literal":"e"}, {"literal":"r"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "action_block_type", "symbols": ["action_block_type$string$2"], "postprocess": id},
    {"name": "RuleActions", "symbols": ["RuleAction"], "postprocess": idArr},
    {"name": "RuleActions", "symbols": ["RuleActions", "__", "RuleAction"], "postprocess": function(d){return d[0].concat(d[2])}},
    {"name": "RuleAction$ebnf$1$subexpression$1$string$1", "symbols": [{"literal":"="}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "RuleAction$ebnf$1$subexpression$1", "symbols": ["Identifier", "_", "RuleAction$ebnf$1$subexpression$1$string$1", "_"]},
    {"name": "RuleAction$ebnf$1", "symbols": ["RuleAction$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "RuleAction$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "RuleAction$ebnf$2$subexpression$1$string$1", "symbols": [{"literal":"w"}, {"literal":"i"}, {"literal":"t"}, {"literal":"h"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "RuleAction$ebnf$2$subexpression$1", "symbols": ["_", "RuleAction$ebnf$2$subexpression$1$string$1", "__", "declaration_list"]},
    {"name": "RuleAction$ebnf$2", "symbols": ["RuleAction$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "RuleAction$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "RuleAction", "symbols": ["RuleAction$ebnf$1", "Identifier", "_", {"literal":"("}, "_", "list_Expression", "_", "loc_close_paren", "RuleAction$ebnf$2"], "postprocess": 
        function(data, start){
          return {
            loc: {start: start, end: lastEndLoc(data)},
            type: 'RuleAction',
            label: data[0] && data[0][0],
            action: data[1],
            args: data[5],
            "with": data[8] ? data[8][3] : []
          };
        }
        },
    {"name": "RulePostlude$string$1", "symbols": [{"literal":"a"}, {"literal":"l"}, {"literal":"w"}, {"literal":"a"}, {"literal":"y"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "RulePostlude", "symbols": ["RulePostlude$string$1", "_", "postlude_clause"], "postprocess": RulePostlude_by_paths(null, null, [2, 0])},
    {"name": "RulePostlude$string$2", "symbols": [{"literal":"f"}, {"literal":"i"}, {"literal":"r"}, {"literal":"e"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "RulePostlude$ebnf$1$subexpression$1$string$1", "symbols": [{"literal":"e"}, {"literal":"l"}, {"literal":"s"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "RulePostlude$ebnf$1$subexpression$1", "symbols": ["_", "RulePostlude$ebnf$1$subexpression$1$string$1", "_", "postlude_clause"]},
    {"name": "RulePostlude$ebnf$1", "symbols": ["RulePostlude$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "RulePostlude$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "RulePostlude$ebnf$2$subexpression$1$string$1", "symbols": [{"literal":"f"}, {"literal":"i"}, {"literal":"n"}, {"literal":"a"}, {"literal":"l"}, {"literal":"l"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "RulePostlude$ebnf$2$subexpression$1", "symbols": ["_", "RulePostlude$ebnf$2$subexpression$1$string$1", "_", "postlude_clause"]},
    {"name": "RulePostlude$ebnf$2", "symbols": ["RulePostlude$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "RulePostlude$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "RulePostlude", "symbols": ["RulePostlude$string$2", "_", "postlude_clause", "RulePostlude$ebnf$1", "RulePostlude$ebnf$2"], "postprocess": RulePostlude_by_paths([2, 0], [3, 3, 0], [4, 3, 0])},
    {"name": "postlude_clause", "symbols": [{"literal":"{"}, "_", "list_Statement", "_", "loc_close_curly"], "postprocess": 
        function(d){
          //we need to keep the location of the close curly
          return [d[2],d[4]];
        }
        },
    {"name": "Statement", "symbols": ["Expression"], "postprocess": id},
    {"name": "Statement", "symbols": ["Declaration"], "postprocess": id},
    {"name": "Declaration", "symbols": ["left_side_of_declaration", "_", {"literal":"="}, "_", "Expression"], "postprocess": 
        function(data, start){
          return {
            loc: {start: data[0].loc.start, end: data[4].loc.end},
            type: 'Declaration',
            op: data[2],
            left: data[0],
            right: data[4]
          };
        }
        },
    {"name": "left_side_of_declaration", "symbols": ["Identifier"], "postprocess": id},
    {"name": "list_Statement", "symbols": [], "postprocess": noopArr},
    {"name": "list_Statement", "symbols": ["Statement"], "postprocess": idArr},
    {"name": "list_Statement", "symbols": ["list_Statement", "_", {"literal":";"}, "_", "Statement"], "postprocess": function(d){return d[0].concat(d[4])}},
    {"name": "declaration_block", "symbols": [{"literal":"{"}, "_", {"literal":"}"}], "postprocess": noopArr},
    {"name": "declaration_block", "symbols": [{"literal":"{"}, "_", "declaration_list", "_", {"literal":"}"}], "postprocess": getN(2)},
    {"name": "declaration_list", "symbols": ["Declaration"], "postprocess": idArr},
    {"name": "declaration_list", "symbols": ["declaration_list", "__", "Declaration"], "postprocess": function(d){return d[0].concat(d[2])}},
    {"name": "Expression", "symbols": ["exp_conditional"], "postprocess": id},
    {"name": "exp_conditional", "symbols": ["exp_or"], "postprocess": id},
    {"name": "exp_conditional$string$1", "symbols": [{"literal":"="}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "exp_conditional", "symbols": ["exp_or", "_", "exp_conditional$string$1", "_", "exp_or", "_", {"literal":"|"}, "_", "exp_conditional"], "postprocess": 
        function(data, start){
          return {
            loc: {start: data[0].loc.start, end: data[8].loc.end},
            type: 'ConditionalExpression',
            test: data[0],
            consequent: data[4],
            alternate: data[8]
          };
        }
        },
    {"name": "exp_or", "symbols": ["exp_and"], "postprocess": id},
    {"name": "exp_or$string$1", "symbols": [{"literal":"|"}, {"literal":"|"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "exp_or", "symbols": ["exp_or", "_", "exp_or$string$1", "_", "exp_and"], "postprocess": infixOp},
    {"name": "exp_and", "symbols": ["exp_comp"], "postprocess": id},
    {"name": "exp_and$string$1", "symbols": [{"literal":"&"}, {"literal":"&"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "exp_and", "symbols": ["exp_and", "_", "exp_and$string$1", "_", "exp_comp"], "postprocess": infixOp},
    {"name": "exp_comp", "symbols": ["exp_sum"], "postprocess": id},
    {"name": "exp_comp", "symbols": ["exp_comp", "_", {"literal":"<"}, "_", "exp_sum"], "postprocess": infixOp},
    {"name": "exp_comp", "symbols": ["exp_comp", "_", {"literal":">"}, "_", "exp_sum"], "postprocess": infixOp},
    {"name": "exp_comp$string$1", "symbols": [{"literal":"<"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "exp_comp", "symbols": ["exp_comp", "_", "exp_comp$string$1", "_", "exp_sum"], "postprocess": infixOp},
    {"name": "exp_comp$string$2", "symbols": [{"literal":">"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "exp_comp", "symbols": ["exp_comp", "_", "exp_comp$string$2", "_", "exp_sum"], "postprocess": infixOp},
    {"name": "exp_comp$string$3", "symbols": [{"literal":"="}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "exp_comp", "symbols": ["exp_comp", "_", "exp_comp$string$3", "_", "exp_sum"], "postprocess": infixOp},
    {"name": "exp_comp$string$4", "symbols": [{"literal":"!"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "exp_comp", "symbols": ["exp_comp", "_", "exp_comp$string$4", "_", "exp_sum"], "postprocess": infixOp},
    {"name": "exp_comp$string$5", "symbols": [{"literal":"e"}, {"literal":"q"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "exp_comp", "symbols": ["exp_comp", "_", "exp_comp$string$5", "_", "exp_sum"], "postprocess": infixOp},
    {"name": "exp_comp$string$6", "symbols": [{"literal":"n"}, {"literal":"e"}, {"literal":"q"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "exp_comp", "symbols": ["exp_comp", "_", "exp_comp$string$6", "_", "exp_sum"], "postprocess": infixOp},
    {"name": "exp_comp$string$7", "symbols": [{"literal":"l"}, {"literal":"i"}, {"literal":"k"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "exp_comp", "symbols": ["exp_comp", "_", "exp_comp$string$7", "_", "exp_sum"], "postprocess": infixOp},
    {"name": "exp_comp$string$8", "symbols": [{"literal":">"}, {"literal":"<"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "exp_comp", "symbols": ["exp_comp", "_", "exp_comp$string$8", "_", "exp_sum"], "postprocess": infixOp},
    {"name": "exp_comp$string$9", "symbols": [{"literal":"<"}, {"literal":"="}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "exp_comp", "symbols": ["exp_comp", "_", "exp_comp$string$9", "_", "exp_sum"], "postprocess": infixOp},
    {"name": "exp_comp$string$10", "symbols": [{"literal":"c"}, {"literal":"m"}, {"literal":"p"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "exp_comp", "symbols": ["exp_comp", "_", "exp_comp$string$10", "_", "exp_sum"], "postprocess": infixOp},
    {"name": "exp_sum", "symbols": ["exp_product"], "postprocess": id},
    {"name": "exp_sum", "symbols": ["exp_sum", "_", {"literal":"+"}, "_", "exp_product"], "postprocess": infixOp},
    {"name": "exp_sum", "symbols": ["exp_sum", "_", {"literal":"-"}, "_", "exp_product"], "postprocess": infixOp},
    {"name": "exp_product", "symbols": ["MemberExpression"], "postprocess": id},
    {"name": "exp_product", "symbols": ["exp_product", "_", {"literal":"*"}, "_", "MemberExpression"], "postprocess": infixOp},
    {"name": "exp_product", "symbols": ["exp_product", "_", {"literal":"/"}, "_", "MemberExpression"], "postprocess": infixOp},
    {"name": "exp_product", "symbols": ["exp_product", "_", {"literal":"%"}, "_", "MemberExpression"], "postprocess": infixOp},
    {"name": "MemberExpression", "symbols": ["PrimaryExpression"], "postprocess": id},
    {"name": "MemberExpression", "symbols": ["Function"], "postprocess": id},
    {"name": "MemberExpression", "symbols": ["Application"], "postprocess": id},
    {"name": "MemberExpression", "symbols": ["MemberExpression", "_", {"literal":"["}, "_", "Expression", "_", "loc_close_square"], "postprocess": MemberExpression_method('index')},
    {"name": "MemberExpression", "symbols": ["MemberExpression", "_", {"literal":"{"}, "_", "Expression", "_", "loc_close_curly"], "postprocess": MemberExpression_method('path')},
    {"name": "MemberExpression", "symbols": ["MemberExpression", "_", {"literal":"."}, "_", "Identifier"], "postprocess": MemberExpression_method('dot')},
    {"name": "PrimaryExpression", "symbols": ["Identifier"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": ["Literal"], "postprocess": id},
    {"name": "PrimaryExpression", "symbols": [{"literal":"("}, "_", "Expression", "_", {"literal":")"}], "postprocess": getN(2)},
    {"name": "Literal", "symbols": ["String"], "postprocess": id},
    {"name": "Literal", "symbols": ["Number"], "postprocess": id},
    {"name": "Literal", "symbols": ["Boolean"], "postprocess": id},
    {"name": "Literal", "symbols": ["RegExp"], "postprocess": id},
    {"name": "Literal", "symbols": ["Chevron"], "postprocess": id},
    {"name": "Literal", "symbols": ["Array"], "postprocess": id},
    {"name": "Literal", "symbols": ["Map"], "postprocess": id},
    {"name": "list_Expression", "symbols": [], "postprocess": noopArr},
    {"name": "list_Expression", "symbols": ["Expression"], "postprocess": idArr},
    {"name": "list_Expression", "symbols": ["list_Expression", "_", {"literal":","}, "_", "Expression"], "postprocess": function(d){return d[0].concat([d[4]])}},
    {"name": "Function$string$1", "symbols": [{"literal":"f"}, {"literal":"u"}, {"literal":"n"}, {"literal":"c"}, {"literal":"t"}, {"literal":"i"}, {"literal":"o"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Function", "symbols": ["Function$string$1", "_", {"literal":"("}, "_", "function_params", "_", {"literal":")"}, "_", {"literal":"{"}, "_", "list_Statement", "_", "loc_close_curly"], "postprocess": 
        function(data, start){
          return {
            loc: {start: start, end: last(data)},
            type: 'Function',
            params: data[4],
            body: data[10]
          };
        }
        },
    {"name": "function_params", "symbols": [], "postprocess": noopArr},
    {"name": "function_params", "symbols": ["Identifier"], "postprocess": idArr},
    {"name": "function_params", "symbols": ["function_params", "_", {"literal":","}, "_", "Identifier"], "postprocess": function(d){return d[0].concat([d[4]])}},
    {"name": "Application", "symbols": ["MemberExpression", "_", {"literal":"("}, "_", "list_Expression", "_", "loc_close_paren"], "postprocess": 
        function(data, start){
          return {
            loc: {start: start, end: last(data)},
            type: 'Application',
            callee: data[0],
            args: data[4]
          };
        }
        },
    {"name": "Array", "symbols": [{"literal":"["}, "_", "list_Expression", "_", "loc_close_square"], "postprocess": 
        function(data, loc){
          return {
            type: 'Array',
            loc: {start: loc, end: last(data)},
            value: data[2]
          };
        }
        },
    {"name": "Map", "symbols": [{"literal":"{"}, "_", "map_kv_pairs", "_", "loc_close_curly"], "postprocess": 
        function(data, loc){
          return {
            loc: {start: loc, end: last(data)},
            type: 'Map',
            value: data[2]
          };
        }
        },
    {"name": "map_kv_pairs", "symbols": [], "postprocess": noopArr},
    {"name": "map_kv_pairs", "symbols": ["map_kv_pair"], "postprocess": idArr},
    {"name": "map_kv_pairs", "symbols": ["map_kv_pairs", "_", {"literal":","}, "_", "map_kv_pair"], "postprocess": function(d){return d[0].concat(d[4])}},
    {"name": "map_kv_pair", "symbols": ["String", "_", {"literal":":"}, "_", "Expression"], "postprocess": 
        function(data, start){
          return {
            loc: {start: start, end: data[4].loc.end},
            type: 'MapKeyValuePair',
            key: data[0],
            value: data[4]
          };
        }
        },
    {"name": "Identifier$ebnf$1", "symbols": []},
    {"name": "Identifier$ebnf$1", "symbols": [/[a-zA-Z0-9_$]/, "Identifier$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "Identifier", "symbols": [/[a-zA-Z_$]/, "Identifier$ebnf$1"], "postprocess": 
        function(data, loc, reject){
          var src = flatten(data).join('');
          if(reserved_identifiers.hasOwnProperty(src)){
            return reject;
          }
          return {
            type: 'Identifier',
            loc: {start: loc, end: loc + src.length},
            value: src
          };
        }
        },
    {"name": "Boolean$string$1", "symbols": [{"literal":"t"}, {"literal":"r"}, {"literal":"u"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Boolean", "symbols": ["Boolean$string$1"], "postprocess": booleanAST(true )},
    {"name": "Boolean$string$2", "symbols": [{"literal":"f"}, {"literal":"a"}, {"literal":"l"}, {"literal":"s"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Boolean", "symbols": ["Boolean$string$2"], "postprocess": booleanAST(false)},
    {"name": "PositiveInteger$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "PositiveInteger$ebnf$1", "symbols": [/[0-9]/, "PositiveInteger$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "PositiveInteger", "symbols": ["PositiveInteger$ebnf$1"], "postprocess": 
        function(data, loc){
          var src = flatten(data).join('');
          return {
            loc: {start: loc, end: loc + src.length},
            type: 'Number',
            value: parseInt(src, 10) || 0// or 0 to avoid NaN
          };
        }
        },
    {"name": "Number", "symbols": ["_number"], "postprocess": 
        function(data, loc){
          var src = flatten(data).join('');
          return {
            loc: {start: loc, end: loc + src.length},
            type: 'Number',
            value: parseFloat(src) || 0// or 0 to avoid NaN
          };
        }
        },
    {"name": "_number", "symbols": ["_float"]},
    {"name": "_number", "symbols": [{"literal":"+"}, "_float"]},
    {"name": "_number", "symbols": [{"literal":"-"}, "_float"]},
    {"name": "_float", "symbols": ["_int"]},
    {"name": "_float", "symbols": [{"literal":"."}, "_int"]},
    {"name": "_float", "symbols": ["_int", {"literal":"."}, "_int"]},
    {"name": "_int$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "_int$ebnf$1", "symbols": [/[0-9]/, "_int$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "_int", "symbols": ["_int$ebnf$1"], "postprocess": idAll},
    {"name": "RegExp$string$1", "symbols": [{"literal":"r"}, {"literal":"e"}, {"literal":"#"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "RegExp", "symbols": ["RegExp$string$1", "regexp_pattern", {"literal":"#"}, "regexp_modifiers"], "postprocess": 
        function(data, loc){
          var pattern = data[1];
          var modifiers = data[3][0];
          return {
            loc: {start: loc, end: data[3][1]},
            type: 'RegExp',
            value: new RegExp(pattern, modifiers)
          };
        }
        },
    {"name": "regexp_pattern", "symbols": [], "postprocess": noopStr},
    {"name": "regexp_pattern", "symbols": ["regexp_pattern", "regexp_pattern_char"], "postprocess": function(d){return d[0] + d[1]}},
    {"name": "regexp_pattern_char", "symbols": [/[^\\#]/], "postprocess": id},
    {"name": "regexp_pattern_char", "symbols": [{"literal":"\\"}, /[^]/], "postprocess": function(d){return d[1] === '#' ? '#' : '\\\\'}},
    {"name": "regexp_modifiers", "symbols": ["regexp_modifiers_chars"], "postprocess": 
        function(data, loc){
          var src = flatten(data).join('');
          return [src, loc + src.length];
        }
        },
    {"name": "regexp_modifiers_chars", "symbols": [], "postprocess": noopStr},
    {"name": "regexp_modifiers_chars", "symbols": [{"literal":"i"}]},
    {"name": "regexp_modifiers_chars", "symbols": [{"literal":"g"}]},
    {"name": "regexp_modifiers_chars$string$1", "symbols": [{"literal":"i"}, {"literal":"g"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "regexp_modifiers_chars", "symbols": ["regexp_modifiers_chars$string$1"]},
    {"name": "regexp_modifiers_chars$string$2", "symbols": [{"literal":"g"}, {"literal":"i"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "regexp_modifiers_chars", "symbols": ["regexp_modifiers_chars$string$2"]},
    {"name": "Chevron$string$1", "symbols": [{"literal":"<"}, {"literal":"<"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Chevron", "symbols": ["Chevron$string$1", "chevron_body", "loc_close_chevron"], "postprocess": 
        function(data, loc){
          return {
            loc: {start: loc - 2, end: last(data)},
            type: 'Chevron',
            value: data[1]
          };
        }
        },
    {"name": "chevron_body", "symbols": ["chevron_string_node"], "postprocess": idArr},
    {"name": "chevron_body", "symbols": ["chevron_body", "beesting", "chevron_string_node"], "postprocess": function(d){return d[0].concat([d[1], d[2]])}},
    {"name": "beesting$string$1", "symbols": [{"literal":"#"}, {"literal":"{"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "beesting", "symbols": ["beesting$string$1", "_", "Expression", "_", {"literal":"}"}], "postprocess": getN(2)},
    {"name": "chevron_string_node", "symbols": ["chevron_string"], "postprocess": 
        function(data, loc){
          var src = data[0];
          return {
            loc: {start: loc, end: loc + src.length},
            type: 'String',
            value: src.replace(/>\\>/g, '>>')
          };
        }
        },
    {"name": "chevron_string", "symbols": [], "postprocess": noopStr},
    {"name": "chevron_string", "symbols": ["chevron_string", "chevron_char"], "postprocess": function(d){return d[0] + d[1]}},
    {"name": "chevron_char", "symbols": [/[^>#]/], "postprocess": id},
    {"name": "chevron_char", "symbols": [{"literal":"#"}, /[^{]/], "postprocess": idAll},
    {"name": "chevron_char", "symbols": [{"literal":">"}, /[^>]/], "postprocess": idAll},
    {"name": "String", "symbols": [{"literal":"\""}, "string", {"literal":"\""}], "postprocess": 
        function(data, loc){
          var src = data[1];
          return {
            loc: {start: loc, end: loc + src.length + 2},
            type: 'String',
            value: src
          };
        }
        },
    {"name": "string", "symbols": [], "postprocess": noopStr},
    {"name": "string", "symbols": ["string", "stringchar"], "postprocess": function(d){return d[0] + d[1]}},
    {"name": "stringchar", "symbols": [/[^\\"]/], "postprocess": id},
    {"name": "stringchar", "symbols": [{"literal":"\\"}, /[^]/], "postprocess": function(d){return JSON.parse('"' + d[0] + d[1] + '"')}},
    {"name": "loc_close_curly", "symbols": [{"literal":"}"}], "postprocess": idEndLoc},
    {"name": "loc_close_square", "symbols": [{"literal":"]"}], "postprocess": idEndLoc},
    {"name": "loc_close_paren", "symbols": [{"literal":")"}], "postprocess": idEndLoc},
    {"name": "loc_close_chevron$string$1", "symbols": [{"literal":">"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "loc_close_chevron", "symbols": ["loc_close_chevron$string$1"], "postprocess": idEndLoc},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": [/[\s]/, "_$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": noop},
    {"name": "__$ebnf$1", "symbols": [/[\s]/]},
    {"name": "__$ebnf$1", "symbols": [/[\s]/, "__$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": noop}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
