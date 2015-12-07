System.config({
  defaultJSExtensions: true,
  transpiler: "none",
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  map: {
    "alp": "npm:alp@1.0.0",
    "alp-logger": "npm:alp-logger@1.0.1",
    "babel-regenerator-runtime": "npm:babel-regenerator-runtime@6.3.13",
    "babel-runtime": "npm:babel-runtime@5.8.34",
    "core-js": "npm:core-js@1.2.6",
    "css": "github:systemjs/plugin-css@0.1.20",
    "events": "github:jspm/nodelibs-events@0.1.1",
    "ibex": "npm:ibex@1.0.0",
    "ibex-config": "npm:ibex-config@1.0.0",
    "ibex-logger": "npm:ibex-logger@1.0.0",
    "ibex-turaco": "npm:ibex-turaco@1.0.0",
    "nightingale": "npm:nightingale@1.2.0",
    "parse-json-object-as-map": "npm:parse-json-object-as-map@1.0.1",
    "springbokjs-dom": "npm:springbokjs-dom@0.11.0",
    "text": "github:systemjs/plugin-text@0.0.4",
    "traceur": "github:jmcriffey/bower-traceur@0.0.92",
    "traceur-runtime": "github:jmcriffey/bower-traceur-runtime@0.0.92",
    "turaco": "npm:turaco@1.1.3",
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.3.0"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.5.2"
    },
    "github:jspm/nodelibs-events@0.1.1": {
      "events": "npm:events@1.0.2"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.2"
    },
    "github:jspm/nodelibs-stream@0.1.0": {
      "stream-browserify": "npm:stream-browserify@1.0.0"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:alouette@3.3.0": {
      "babel-runtime": "npm:babel-runtime@5.8.34",
      "escape-html": "npm:escape-html@1.0.3",
      "eshighlight-fb": "npm:eshighlight-fb@1.0.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "source-map": "npm:source-map@0.5.3",
      "stack-trace": "npm:stack-trace@0.0.9"
    },
    "npm:alp-logger@1.0.1": {
      "nightingale": "npm:nightingale@1.2.0"
    },
    "npm:alp@1.0.0": {
      "alouette": "npm:alouette@3.3.0",
      "limosa": "npm:limosa@1.0.1",
      "nightingale": "npm:nightingale@1.2.0",
      "object-properties": "npm:object-properties@1.2.0"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:babel-regenerator-runtime@6.3.13": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:babel-runtime@5.8.34": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:buffer@3.5.2": {
      "base64-js": "npm:base64-js@0.0.8",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "ieee754": "npm:ieee754@1.1.6",
      "is-array": "npm:is-array@1.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:core-js@1.2.6": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:core-util-is@1.0.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:dom-serializer@0.1.0": {
      "domelementtype": "npm:domelementtype@1.1.3",
      "entities": "npm:entities@1.1.1"
    },
    "npm:domhandler@2.3.0": {
      "domelementtype": "npm:domelementtype@1.1.3"
    },
    "npm:domutils@1.5.1": {
      "dom-serializer": "npm:dom-serializer@0.1.0",
      "domelementtype": "npm:domelementtype@1.1.3"
    },
    "npm:entities@1.0.0": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:entities@1.1.1": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:eshighlight-fb@1.0.0": {
      "esprima-fb": "npm:esprima-fb@15001.1001.0-dev-harmony-fb"
    },
    "npm:esnext-class@1.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:esprima-fb@15001.1001.0-dev-harmony-fb": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:html-document@0.8.1": {
      "htmlparser2": "npm:htmlparser2@3.8.3",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:htmlparser2@3.8.3": {
      "domelementtype": "npm:domelementtype@1.1.3",
      "domhandler": "npm:domhandler@2.3.0",
      "domutils": "npm:domutils@1.5.1",
      "entities": "npm:entities@1.0.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:ibex-config@1.0.0": {
      "parse-json-object-as-map": "npm:parse-json-object-as-map@1.0.1"
    },
    "npm:ibex-logger@1.0.0": {
      "alp-logger": "npm:alp-logger@1.0.1",
      "ibex-config": "npm:ibex-config@1.0.0"
    },
    "npm:ibex-turaco@1.0.0": {
      "babel-runtime": "npm:babel-runtime@5.8.34",
      "html-document": "npm:html-document@0.8.1",
      "springbokjs-dom": "npm:springbokjs-dom@0.11.0",
      "turaco": "npm:turaco@1.1.3"
    },
    "npm:ibex@1.0.0": {
      "events": "github:jspm/nodelibs-events@0.1.1"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:limosa@1.0.1": {
      "object2map": "npm:object2map@1.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:nightingale@1.2.0": {
      "ansi-styles": "npm:ansi-styles@2.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:parse-json-object-as-map@1.0.1": {
      "object2map": "npm:object2map@1.0.1"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.2": {
      "assert": "github:jspm/nodelibs-assert@0.1.0"
    },
    "npm:readable-stream@1.1.13": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "core-util-is": "npm:core-util-is@1.0.2",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "isarray": "npm:isarray@0.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream-browserify": "npm:stream-browserify@1.0.0",
      "string_decoder": "npm:string_decoder@0.10.31"
    },
    "npm:source-map@0.5.3": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:springbokjs-dom@0.11.0": {
      "babel-runtime": "npm:babel-runtime@5.8.34",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:stream-browserify@1.0.0": {
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "readable-stream": "npm:readable-stream@1.1.13"
    },
    "npm:string_decoder@0.10.31": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:turaco@1.1.3": {
      "esnext-class": "npm:esnext-class@1.0.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "html-document": "npm:html-document@0.8.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "springbokjs-dom": "npm:springbokjs-dom@0.11.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    }
  }
});
