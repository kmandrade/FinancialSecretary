var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_modules_watch_stub();
  }
});

// node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// node_modules/fast-xml-parser/src/util.js
var require_util = __commonJS({
  "node_modules/fast-xml-parser/src/util.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    var nameStartChar = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
    var nameChar = nameStartChar + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
    var nameRegexp = "[" + nameStartChar + "][" + nameChar + "]*";
    var regexName = new RegExp("^" + nameRegexp + "$");
    var getAllMatches = /* @__PURE__ */ __name(function(string, regex) {
      const matches = [];
      let match = regex.exec(string);
      while (match) {
        const allmatches = [];
        allmatches.startIndex = regex.lastIndex - match[0].length;
        const len = match.length;
        for (let index = 0; index < len; index++) {
          allmatches.push(match[index]);
        }
        matches.push(allmatches);
        match = regex.exec(string);
      }
      return matches;
    }, "getAllMatches");
    var isName = /* @__PURE__ */ __name(function(string) {
      const match = regexName.exec(string);
      return !(match === null || typeof match === "undefined");
    }, "isName");
    exports.isExist = function(v) {
      return typeof v !== "undefined";
    };
    exports.isEmptyObject = function(obj) {
      return Object.keys(obj).length === 0;
    };
    exports.merge = function(target, a, arrayMode) {
      if (a) {
        const keys = Object.keys(a);
        const len = keys.length;
        for (let i = 0; i < len; i++) {
          if (arrayMode === "strict") {
            target[keys[i]] = [a[keys[i]]];
          } else {
            target[keys[i]] = a[keys[i]];
          }
        }
      }
    };
    exports.getValue = function(v) {
      if (exports.isExist(v)) {
        return v;
      } else {
        return "";
      }
    };
    exports.isName = isName;
    exports.getAllMatches = getAllMatches;
    exports.nameRegexp = nameRegexp;
  }
});

// node_modules/fast-xml-parser/src/validator.js
var require_validator = __commonJS({
  "node_modules/fast-xml-parser/src/validator.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    var util2 = require_util();
    var defaultOptions = {
      allowBooleanAttributes: false,
      //A tag can have attributes without any value
      unpairedTags: []
    };
    exports.validate = function(xmlData, options) {
      options = Object.assign({}, defaultOptions, options);
      const tags = [];
      let tagFound = false;
      let reachedRoot = false;
      if (xmlData[0] === "\uFEFF") {
        xmlData = xmlData.substr(1);
      }
      for (let i = 0; i < xmlData.length; i++) {
        if (xmlData[i] === "<" && xmlData[i + 1] === "?") {
          i += 2;
          i = readPI(xmlData, i);
          if (i.err) return i;
        } else if (xmlData[i] === "<") {
          let tagStartPos = i;
          i++;
          if (xmlData[i] === "!") {
            i = readCommentAndCDATA(xmlData, i);
            continue;
          } else {
            let closingTag = false;
            if (xmlData[i] === "/") {
              closingTag = true;
              i++;
            }
            let tagName = "";
            for (; i < xmlData.length && xmlData[i] !== ">" && xmlData[i] !== " " && xmlData[i] !== "	" && xmlData[i] !== "\n" && xmlData[i] !== "\r"; i++) {
              tagName += xmlData[i];
            }
            tagName = tagName.trim();
            if (tagName[tagName.length - 1] === "/") {
              tagName = tagName.substring(0, tagName.length - 1);
              i--;
            }
            if (!validateTagName(tagName)) {
              let msg;
              if (tagName.trim().length === 0) {
                msg = "Invalid space after '<'.";
              } else {
                msg = "Tag '" + tagName + "' is an invalid name.";
              }
              return getErrorObject("InvalidTag", msg, getLineNumberForPosition(xmlData, i));
            }
            const result = readAttributeStr(xmlData, i);
            if (result === false) {
              return getErrorObject("InvalidAttr", "Attributes for '" + tagName + "' have open quote.", getLineNumberForPosition(xmlData, i));
            }
            let attrStr = result.value;
            i = result.index;
            if (attrStr[attrStr.length - 1] === "/") {
              const attrStrStart = i - attrStr.length;
              attrStr = attrStr.substring(0, attrStr.length - 1);
              const isValid2 = validateAttributeString(attrStr, options);
              if (isValid2 === true) {
                tagFound = true;
              } else {
                return getErrorObject(isValid2.err.code, isValid2.err.msg, getLineNumberForPosition(xmlData, attrStrStart + isValid2.err.line));
              }
            } else if (closingTag) {
              if (!result.tagClosed) {
                return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' doesn't have proper closing.", getLineNumberForPosition(xmlData, i));
              } else if (attrStr.trim().length > 0) {
                return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' can't have attributes or invalid starting.", getLineNumberForPosition(xmlData, tagStartPos));
              } else if (tags.length === 0) {
                return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' has not been opened.", getLineNumberForPosition(xmlData, tagStartPos));
              } else {
                const otg = tags.pop();
                if (tagName !== otg.tagName) {
                  let openPos = getLineNumberForPosition(xmlData, otg.tagStartPos);
                  return getErrorObject(
                    "InvalidTag",
                    "Expected closing tag '" + otg.tagName + "' (opened in line " + openPos.line + ", col " + openPos.col + ") instead of closing tag '" + tagName + "'.",
                    getLineNumberForPosition(xmlData, tagStartPos)
                  );
                }
                if (tags.length == 0) {
                  reachedRoot = true;
                }
              }
            } else {
              const isValid2 = validateAttributeString(attrStr, options);
              if (isValid2 !== true) {
                return getErrorObject(isValid2.err.code, isValid2.err.msg, getLineNumberForPosition(xmlData, i - attrStr.length + isValid2.err.line));
              }
              if (reachedRoot === true) {
                return getErrorObject("InvalidXml", "Multiple possible root nodes found.", getLineNumberForPosition(xmlData, i));
              } else if (options.unpairedTags.indexOf(tagName) !== -1) {
              } else {
                tags.push({ tagName, tagStartPos });
              }
              tagFound = true;
            }
            for (i++; i < xmlData.length; i++) {
              if (xmlData[i] === "<") {
                if (xmlData[i + 1] === "!") {
                  i++;
                  i = readCommentAndCDATA(xmlData, i);
                  continue;
                } else if (xmlData[i + 1] === "?") {
                  i = readPI(xmlData, ++i);
                  if (i.err) return i;
                } else {
                  break;
                }
              } else if (xmlData[i] === "&") {
                const afterAmp = validateAmpersand(xmlData, i);
                if (afterAmp == -1)
                  return getErrorObject("InvalidChar", "char '&' is not expected.", getLineNumberForPosition(xmlData, i));
                i = afterAmp;
              } else {
                if (reachedRoot === true && !isWhiteSpace(xmlData[i])) {
                  return getErrorObject("InvalidXml", "Extra text at the end", getLineNumberForPosition(xmlData, i));
                }
              }
            }
            if (xmlData[i] === "<") {
              i--;
            }
          }
        } else {
          if (isWhiteSpace(xmlData[i])) {
            continue;
          }
          return getErrorObject("InvalidChar", "char '" + xmlData[i] + "' is not expected.", getLineNumberForPosition(xmlData, i));
        }
      }
      if (!tagFound) {
        return getErrorObject("InvalidXml", "Start tag expected.", 1);
      } else if (tags.length == 1) {
        return getErrorObject("InvalidTag", "Unclosed tag '" + tags[0].tagName + "'.", getLineNumberForPosition(xmlData, tags[0].tagStartPos));
      } else if (tags.length > 0) {
        return getErrorObject("InvalidXml", "Invalid '" + JSON.stringify(tags.map((t) => t.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", { line: 1, col: 1 });
      }
      return true;
    };
    function isWhiteSpace(char) {
      return char === " " || char === "	" || char === "\n" || char === "\r";
    }
    __name(isWhiteSpace, "isWhiteSpace");
    function readPI(xmlData, i) {
      const start = i;
      for (; i < xmlData.length; i++) {
        if (xmlData[i] == "?" || xmlData[i] == " ") {
          const tagname = xmlData.substr(start, i - start);
          if (i > 5 && tagname === "xml") {
            return getErrorObject("InvalidXml", "XML declaration allowed only at the start of the document.", getLineNumberForPosition(xmlData, i));
          } else if (xmlData[i] == "?" && xmlData[i + 1] == ">") {
            i++;
            break;
          } else {
            continue;
          }
        }
      }
      return i;
    }
    __name(readPI, "readPI");
    function readCommentAndCDATA(xmlData, i) {
      if (xmlData.length > i + 5 && xmlData[i + 1] === "-" && xmlData[i + 2] === "-") {
        for (i += 3; i < xmlData.length; i++) {
          if (xmlData[i] === "-" && xmlData[i + 1] === "-" && xmlData[i + 2] === ">") {
            i += 2;
            break;
          }
        }
      } else if (xmlData.length > i + 8 && xmlData[i + 1] === "D" && xmlData[i + 2] === "O" && xmlData[i + 3] === "C" && xmlData[i + 4] === "T" && xmlData[i + 5] === "Y" && xmlData[i + 6] === "P" && xmlData[i + 7] === "E") {
        let angleBracketsCount = 1;
        for (i += 8; i < xmlData.length; i++) {
          if (xmlData[i] === "<") {
            angleBracketsCount++;
          } else if (xmlData[i] === ">") {
            angleBracketsCount--;
            if (angleBracketsCount === 0) {
              break;
            }
          }
        }
      } else if (xmlData.length > i + 9 && xmlData[i + 1] === "[" && xmlData[i + 2] === "C" && xmlData[i + 3] === "D" && xmlData[i + 4] === "A" && xmlData[i + 5] === "T" && xmlData[i + 6] === "A" && xmlData[i + 7] === "[") {
        for (i += 8; i < xmlData.length; i++) {
          if (xmlData[i] === "]" && xmlData[i + 1] === "]" && xmlData[i + 2] === ">") {
            i += 2;
            break;
          }
        }
      }
      return i;
    }
    __name(readCommentAndCDATA, "readCommentAndCDATA");
    var doubleQuote = '"';
    var singleQuote = "'";
    function readAttributeStr(xmlData, i) {
      let attrStr = "";
      let startChar = "";
      let tagClosed = false;
      for (; i < xmlData.length; i++) {
        if (xmlData[i] === doubleQuote || xmlData[i] === singleQuote) {
          if (startChar === "") {
            startChar = xmlData[i];
          } else if (startChar !== xmlData[i]) {
          } else {
            startChar = "";
          }
        } else if (xmlData[i] === ">") {
          if (startChar === "") {
            tagClosed = true;
            break;
          }
        }
        attrStr += xmlData[i];
      }
      if (startChar !== "") {
        return false;
      }
      return {
        value: attrStr,
        index: i,
        tagClosed
      };
    }
    __name(readAttributeStr, "readAttributeStr");
    var validAttrStrRegxp = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, "g");
    function validateAttributeString(attrStr, options) {
      const matches = util2.getAllMatches(attrStr, validAttrStrRegxp);
      const attrNames = {};
      for (let i = 0; i < matches.length; i++) {
        if (matches[i][1].length === 0) {
          return getErrorObject("InvalidAttr", "Attribute '" + matches[i][2] + "' has no space in starting.", getPositionFromMatch(matches[i]));
        } else if (matches[i][3] !== void 0 && matches[i][4] === void 0) {
          return getErrorObject("InvalidAttr", "Attribute '" + matches[i][2] + "' is without value.", getPositionFromMatch(matches[i]));
        } else if (matches[i][3] === void 0 && !options.allowBooleanAttributes) {
          return getErrorObject("InvalidAttr", "boolean attribute '" + matches[i][2] + "' is not allowed.", getPositionFromMatch(matches[i]));
        }
        const attrName = matches[i][2];
        if (!validateAttrName(attrName)) {
          return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is an invalid name.", getPositionFromMatch(matches[i]));
        }
        if (!attrNames.hasOwnProperty(attrName)) {
          attrNames[attrName] = 1;
        } else {
          return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is repeated.", getPositionFromMatch(matches[i]));
        }
      }
      return true;
    }
    __name(validateAttributeString, "validateAttributeString");
    function validateNumberAmpersand(xmlData, i) {
      let re = /\d/;
      if (xmlData[i] === "x") {
        i++;
        re = /[\da-fA-F]/;
      }
      for (; i < xmlData.length; i++) {
        if (xmlData[i] === ";")
          return i;
        if (!xmlData[i].match(re))
          break;
      }
      return -1;
    }
    __name(validateNumberAmpersand, "validateNumberAmpersand");
    function validateAmpersand(xmlData, i) {
      i++;
      if (xmlData[i] === ";")
        return -1;
      if (xmlData[i] === "#") {
        i++;
        return validateNumberAmpersand(xmlData, i);
      }
      let count = 0;
      for (; i < xmlData.length; i++, count++) {
        if (xmlData[i].match(/\w/) && count < 20)
          continue;
        if (xmlData[i] === ";")
          break;
        return -1;
      }
      return i;
    }
    __name(validateAmpersand, "validateAmpersand");
    function getErrorObject(code, message2, lineNumber) {
      return {
        err: {
          code,
          msg: message2,
          line: lineNumber.line || lineNumber,
          col: lineNumber.col
        }
      };
    }
    __name(getErrorObject, "getErrorObject");
    function validateAttrName(attrName) {
      return util2.isName(attrName);
    }
    __name(validateAttrName, "validateAttrName");
    function validateTagName(tagname) {
      return util2.isName(tagname);
    }
    __name(validateTagName, "validateTagName");
    function getLineNumberForPosition(xmlData, index) {
      const lines = xmlData.substring(0, index).split(/\r?\n/);
      return {
        line: lines.length,
        // column number is last line's length + 1, because column numbering starts at 1:
        col: lines[lines.length - 1].length + 1
      };
    }
    __name(getLineNumberForPosition, "getLineNumberForPosition");
    function getPositionFromMatch(match) {
      return match.startIndex + match[1].length;
    }
    __name(getPositionFromMatch, "getPositionFromMatch");
  }
});

// node_modules/fast-xml-parser/src/xmlparser/OptionsBuilder.js
var require_OptionsBuilder = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/OptionsBuilder.js"(exports) {
    init_modules_watch_stub();
    var defaultOptions = {
      preserveOrder: false,
      attributeNamePrefix: "@_",
      attributesGroupName: false,
      textNodeName: "#text",
      ignoreAttributes: true,
      removeNSPrefix: false,
      // remove NS from tag name or attribute name if true
      allowBooleanAttributes: false,
      //a tag can have attributes without any value
      //ignoreRootElement : false,
      parseTagValue: true,
      parseAttributeValue: false,
      trimValues: true,
      //Trim string values of tag and attributes
      cdataPropName: false,
      numberParseOptions: {
        hex: true,
        leadingZeros: true,
        eNotation: true
      },
      tagValueProcessor: /* @__PURE__ */ __name(function(tagName, val) {
        return val;
      }, "tagValueProcessor"),
      attributeValueProcessor: /* @__PURE__ */ __name(function(attrName, val) {
        return val;
      }, "attributeValueProcessor"),
      stopNodes: [],
      //nested tags will not be parsed even for errors
      alwaysCreateTextNode: false,
      isArray: /* @__PURE__ */ __name(() => false, "isArray"),
      commentPropName: false,
      unpairedTags: [],
      processEntities: true,
      htmlEntities: false,
      ignoreDeclaration: false,
      ignorePiTags: false,
      transformTagName: false,
      transformAttributeName: false,
      updateTag: /* @__PURE__ */ __name(function(tagName, jPath, attrs) {
        return tagName;
      }, "updateTag")
      // skipEmptyListItem: false
    };
    var buildOptions = /* @__PURE__ */ __name(function(options) {
      return Object.assign({}, defaultOptions, options);
    }, "buildOptions");
    exports.buildOptions = buildOptions;
    exports.defaultOptions = defaultOptions;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/xmlNode.js
var require_xmlNode = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/xmlNode.js"(exports, module) {
    "use strict";
    init_modules_watch_stub();
    var XmlNode = class {
      static {
        __name(this, "XmlNode");
      }
      constructor(tagname) {
        this.tagname = tagname;
        this.child = [];
        this[":@"] = {};
      }
      add(key, val) {
        if (key === "__proto__") key = "#__proto__";
        this.child.push({ [key]: val });
      }
      addChild(node) {
        if (node.tagname === "__proto__") node.tagname = "#__proto__";
        if (node[":@"] && Object.keys(node[":@"]).length > 0) {
          this.child.push({ [node.tagname]: node.child, [":@"]: node[":@"] });
        } else {
          this.child.push({ [node.tagname]: node.child });
        }
      }
    };
    module.exports = XmlNode;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/DocTypeReader.js
var require_DocTypeReader = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/DocTypeReader.js"(exports, module) {
    init_modules_watch_stub();
    var util2 = require_util();
    function readDocType(xmlData, i) {
      const entities = {};
      if (xmlData[i + 3] === "O" && xmlData[i + 4] === "C" && xmlData[i + 5] === "T" && xmlData[i + 6] === "Y" && xmlData[i + 7] === "P" && xmlData[i + 8] === "E") {
        i = i + 9;
        let angleBracketsCount = 1;
        let hasBody = false, comment = false;
        let exp = "";
        for (; i < xmlData.length; i++) {
          if (xmlData[i] === "<" && !comment) {
            if (hasBody && isEntity(xmlData, i)) {
              i += 7;
              let entityName, val;
              [entityName, val, i] = readEntityExp(xmlData, i + 1);
              if (val.indexOf("&") === -1)
                entities[validateEntityName(entityName)] = {
                  regx: RegExp(`&${entityName};`, "g"),
                  val
                };
            } else if (hasBody && isElement(xmlData, i)) i += 8;
            else if (hasBody && isAttlist(xmlData, i)) i += 8;
            else if (hasBody && isNotation(xmlData, i)) i += 9;
            else if (isComment) comment = true;
            else throw new Error("Invalid DOCTYPE");
            angleBracketsCount++;
            exp = "";
          } else if (xmlData[i] === ">") {
            if (comment) {
              if (xmlData[i - 1] === "-" && xmlData[i - 2] === "-") {
                comment = false;
                angleBracketsCount--;
              }
            } else {
              angleBracketsCount--;
            }
            if (angleBracketsCount === 0) {
              break;
            }
          } else if (xmlData[i] === "[") {
            hasBody = true;
          } else {
            exp += xmlData[i];
          }
        }
        if (angleBracketsCount !== 0) {
          throw new Error(`Unclosed DOCTYPE`);
        }
      } else {
        throw new Error(`Invalid Tag instead of DOCTYPE`);
      }
      return { entities, i };
    }
    __name(readDocType, "readDocType");
    function readEntityExp(xmlData, i) {
      let entityName = "";
      for (; i < xmlData.length && (xmlData[i] !== "'" && xmlData[i] !== '"'); i++) {
        entityName += xmlData[i];
      }
      entityName = entityName.trim();
      if (entityName.indexOf(" ") !== -1) throw new Error("External entites are not supported");
      const startChar = xmlData[i++];
      let val = "";
      for (; i < xmlData.length && xmlData[i] !== startChar; i++) {
        val += xmlData[i];
      }
      return [entityName, val, i];
    }
    __name(readEntityExp, "readEntityExp");
    function isComment(xmlData, i) {
      if (xmlData[i + 1] === "!" && xmlData[i + 2] === "-" && xmlData[i + 3] === "-") return true;
      return false;
    }
    __name(isComment, "isComment");
    function isEntity(xmlData, i) {
      if (xmlData[i + 1] === "!" && xmlData[i + 2] === "E" && xmlData[i + 3] === "N" && xmlData[i + 4] === "T" && xmlData[i + 5] === "I" && xmlData[i + 6] === "T" && xmlData[i + 7] === "Y") return true;
      return false;
    }
    __name(isEntity, "isEntity");
    function isElement(xmlData, i) {
      if (xmlData[i + 1] === "!" && xmlData[i + 2] === "E" && xmlData[i + 3] === "L" && xmlData[i + 4] === "E" && xmlData[i + 5] === "M" && xmlData[i + 6] === "E" && xmlData[i + 7] === "N" && xmlData[i + 8] === "T") return true;
      return false;
    }
    __name(isElement, "isElement");
    function isAttlist(xmlData, i) {
      if (xmlData[i + 1] === "!" && xmlData[i + 2] === "A" && xmlData[i + 3] === "T" && xmlData[i + 4] === "T" && xmlData[i + 5] === "L" && xmlData[i + 6] === "I" && xmlData[i + 7] === "S" && xmlData[i + 8] === "T") return true;
      return false;
    }
    __name(isAttlist, "isAttlist");
    function isNotation(xmlData, i) {
      if (xmlData[i + 1] === "!" && xmlData[i + 2] === "N" && xmlData[i + 3] === "O" && xmlData[i + 4] === "T" && xmlData[i + 5] === "A" && xmlData[i + 6] === "T" && xmlData[i + 7] === "I" && xmlData[i + 8] === "O" && xmlData[i + 9] === "N") return true;
      return false;
    }
    __name(isNotation, "isNotation");
    function validateEntityName(name) {
      if (util2.isName(name))
        return name;
      else
        throw new Error(`Invalid entity name ${name}`);
    }
    __name(validateEntityName, "validateEntityName");
    module.exports = readDocType;
  }
});

// node_modules/strnum/strnum.js
var require_strnum = __commonJS({
  "node_modules/strnum/strnum.js"(exports, module) {
    init_modules_watch_stub();
    var hexRegex = /^[-+]?0x[a-fA-F0-9]+$/;
    var numRegex = /^([\-\+])?(0*)([0-9]*(\.[0-9]*)?)$/;
    var consider = {
      hex: true,
      // oct: false,
      leadingZeros: true,
      decimalPoint: ".",
      eNotation: true
      //skipLike: /regex/
    };
    function toNumber(str, options = {}) {
      options = Object.assign({}, consider, options);
      if (!str || typeof str !== "string") return str;
      let trimmedStr = str.trim();
      if (options.skipLike !== void 0 && options.skipLike.test(trimmedStr)) return str;
      else if (str === "0") return 0;
      else if (options.hex && hexRegex.test(trimmedStr)) {
        return parse_int(trimmedStr, 16);
      } else if (trimmedStr.search(/[eE]/) !== -1) {
        const notation = trimmedStr.match(/^([-\+])?(0*)([0-9]*(\.[0-9]*)?[eE][-\+]?[0-9]+)$/);
        if (notation) {
          if (options.leadingZeros) {
            trimmedStr = (notation[1] || "") + notation[3];
          } else {
            if (notation[2] === "0" && notation[3][0] === ".") {
            } else {
              return str;
            }
          }
          return options.eNotation ? Number(trimmedStr) : str;
        } else {
          return str;
        }
      } else {
        const match = numRegex.exec(trimmedStr);
        if (match) {
          const sign2 = match[1];
          const leadingZeros = match[2];
          let numTrimmedByZeros = trimZeros(match[3]);
          if (!options.leadingZeros && leadingZeros.length > 0 && sign2 && trimmedStr[2] !== ".") return str;
          else if (!options.leadingZeros && leadingZeros.length > 0 && !sign2 && trimmedStr[1] !== ".") return str;
          else if (options.leadingZeros && leadingZeros === str) return 0;
          else {
            const num = Number(trimmedStr);
            const numStr = "" + num;
            if (numStr.search(/[eE]/) !== -1) {
              if (options.eNotation) return num;
              else return str;
            } else if (trimmedStr.indexOf(".") !== -1) {
              if (numStr === "0" && numTrimmedByZeros === "") return num;
              else if (numStr === numTrimmedByZeros) return num;
              else if (sign2 && numStr === "-" + numTrimmedByZeros) return num;
              else return str;
            }
            if (leadingZeros) {
              return numTrimmedByZeros === numStr || sign2 + numTrimmedByZeros === numStr ? num : str;
            } else {
              return trimmedStr === numStr || trimmedStr === sign2 + numStr ? num : str;
            }
          }
        } else {
          return str;
        }
      }
    }
    __name(toNumber, "toNumber");
    function trimZeros(numStr) {
      if (numStr && numStr.indexOf(".") !== -1) {
        numStr = numStr.replace(/0+$/, "");
        if (numStr === ".") numStr = "0";
        else if (numStr[0] === ".") numStr = "0" + numStr;
        else if (numStr[numStr.length - 1] === ".") numStr = numStr.substr(0, numStr.length - 1);
        return numStr;
      }
      return numStr;
    }
    __name(trimZeros, "trimZeros");
    function parse_int(numStr, base) {
      if (parseInt) return parseInt(numStr, base);
      else if (Number.parseInt) return Number.parseInt(numStr, base);
      else if (window && window.parseInt) return window.parseInt(numStr, base);
      else throw new Error("parseInt, Number.parseInt, window.parseInt are not supported");
    }
    __name(parse_int, "parse_int");
    module.exports = toNumber;
  }
});

// node_modules/fast-xml-parser/src/ignoreAttributes.js
var require_ignoreAttributes = __commonJS({
  "node_modules/fast-xml-parser/src/ignoreAttributes.js"(exports, module) {
    init_modules_watch_stub();
    function getIgnoreAttributesFn(ignoreAttributes) {
      if (typeof ignoreAttributes === "function") {
        return ignoreAttributes;
      }
      if (Array.isArray(ignoreAttributes)) {
        return (attrName) => {
          for (const pattern of ignoreAttributes) {
            if (typeof pattern === "string" && attrName === pattern) {
              return true;
            }
            if (pattern instanceof RegExp && pattern.test(attrName)) {
              return true;
            }
          }
        };
      }
      return () => false;
    }
    __name(getIgnoreAttributesFn, "getIgnoreAttributesFn");
    module.exports = getIgnoreAttributesFn;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/OrderedObjParser.js
var require_OrderedObjParser = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/OrderedObjParser.js"(exports, module) {
    "use strict";
    init_modules_watch_stub();
    var util2 = require_util();
    var xmlNode = require_xmlNode();
    var readDocType = require_DocTypeReader();
    var toNumber = require_strnum();
    var getIgnoreAttributesFn = require_ignoreAttributes();
    var OrderedObjParser = class {
      static {
        __name(this, "OrderedObjParser");
      }
      constructor(options) {
        this.options = options;
        this.currentNode = null;
        this.tagsNodeStack = [];
        this.docTypeEntities = {};
        this.lastEntities = {
          "apos": { regex: /&(apos|#39|#x27);/g, val: "'" },
          "gt": { regex: /&(gt|#62|#x3E);/g, val: ">" },
          "lt": { regex: /&(lt|#60|#x3C);/g, val: "<" },
          "quot": { regex: /&(quot|#34|#x22);/g, val: '"' }
        };
        this.ampEntity = { regex: /&(amp|#38|#x26);/g, val: "&" };
        this.htmlEntities = {
          "space": { regex: /&(nbsp|#160);/g, val: " " },
          // "lt" : { regex: /&(lt|#60);/g, val: "<" },
          // "gt" : { regex: /&(gt|#62);/g, val: ">" },
          // "amp" : { regex: /&(amp|#38);/g, val: "&" },
          // "quot" : { regex: /&(quot|#34);/g, val: "\"" },
          // "apos" : { regex: /&(apos|#39);/g, val: "'" },
          "cent": { regex: /&(cent|#162);/g, val: "\xA2" },
          "pound": { regex: /&(pound|#163);/g, val: "\xA3" },
          "yen": { regex: /&(yen|#165);/g, val: "\xA5" },
          "euro": { regex: /&(euro|#8364);/g, val: "\u20AC" },
          "copyright": { regex: /&(copy|#169);/g, val: "\xA9" },
          "reg": { regex: /&(reg|#174);/g, val: "\xAE" },
          "inr": { regex: /&(inr|#8377);/g, val: "\u20B9" },
          "num_dec": { regex: /&#([0-9]{1,7});/g, val: /* @__PURE__ */ __name((_, str) => String.fromCharCode(Number.parseInt(str, 10)), "val") },
          "num_hex": { regex: /&#x([0-9a-fA-F]{1,6});/g, val: /* @__PURE__ */ __name((_, str) => String.fromCharCode(Number.parseInt(str, 16)), "val") }
        };
        this.addExternalEntities = addExternalEntities;
        this.parseXml = parseXml;
        this.parseTextData = parseTextData;
        this.resolveNameSpace = resolveNameSpace;
        this.buildAttributesMap = buildAttributesMap;
        this.isItStopNode = isItStopNode;
        this.replaceEntitiesValue = replaceEntitiesValue;
        this.readStopNodeData = readStopNodeData;
        this.saveTextToParentTag = saveTextToParentTag;
        this.addChild = addChild;
        this.ignoreAttributesFn = getIgnoreAttributesFn(this.options.ignoreAttributes);
      }
    };
    function addExternalEntities(externalEntities) {
      const entKeys = Object.keys(externalEntities);
      for (let i = 0; i < entKeys.length; i++) {
        const ent = entKeys[i];
        this.lastEntities[ent] = {
          regex: new RegExp("&" + ent + ";", "g"),
          val: externalEntities[ent]
        };
      }
    }
    __name(addExternalEntities, "addExternalEntities");
    function parseTextData(val, tagName, jPath, dontTrim, hasAttributes, isLeafNode, escapeEntities) {
      if (val !== void 0) {
        if (this.options.trimValues && !dontTrim) {
          val = val.trim();
        }
        if (val.length > 0) {
          if (!escapeEntities) val = this.replaceEntitiesValue(val);
          const newval = this.options.tagValueProcessor(tagName, val, jPath, hasAttributes, isLeafNode);
          if (newval === null || newval === void 0) {
            return val;
          } else if (typeof newval !== typeof val || newval !== val) {
            return newval;
          } else if (this.options.trimValues) {
            return parseValue(val, this.options.parseTagValue, this.options.numberParseOptions);
          } else {
            const trimmedVal = val.trim();
            if (trimmedVal === val) {
              return parseValue(val, this.options.parseTagValue, this.options.numberParseOptions);
            } else {
              return val;
            }
          }
        }
      }
    }
    __name(parseTextData, "parseTextData");
    function resolveNameSpace(tagname) {
      if (this.options.removeNSPrefix) {
        const tags = tagname.split(":");
        const prefix = tagname.charAt(0) === "/" ? "/" : "";
        if (tags[0] === "xmlns") {
          return "";
        }
        if (tags.length === 2) {
          tagname = prefix + tags[1];
        }
      }
      return tagname;
    }
    __name(resolveNameSpace, "resolveNameSpace");
    var attrsRegx = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, "gm");
    function buildAttributesMap(attrStr, jPath, tagName) {
      if (this.options.ignoreAttributes !== true && typeof attrStr === "string") {
        const matches = util2.getAllMatches(attrStr, attrsRegx);
        const len = matches.length;
        const attrs = {};
        for (let i = 0; i < len; i++) {
          const attrName = this.resolveNameSpace(matches[i][1]);
          if (this.ignoreAttributesFn(attrName, jPath)) {
            continue;
          }
          let oldVal = matches[i][4];
          let aName = this.options.attributeNamePrefix + attrName;
          if (attrName.length) {
            if (this.options.transformAttributeName) {
              aName = this.options.transformAttributeName(aName);
            }
            if (aName === "__proto__") aName = "#__proto__";
            if (oldVal !== void 0) {
              if (this.options.trimValues) {
                oldVal = oldVal.trim();
              }
              oldVal = this.replaceEntitiesValue(oldVal);
              const newVal = this.options.attributeValueProcessor(attrName, oldVal, jPath);
              if (newVal === null || newVal === void 0) {
                attrs[aName] = oldVal;
              } else if (typeof newVal !== typeof oldVal || newVal !== oldVal) {
                attrs[aName] = newVal;
              } else {
                attrs[aName] = parseValue(
                  oldVal,
                  this.options.parseAttributeValue,
                  this.options.numberParseOptions
                );
              }
            } else if (this.options.allowBooleanAttributes) {
              attrs[aName] = true;
            }
          }
        }
        if (!Object.keys(attrs).length) {
          return;
        }
        if (this.options.attributesGroupName) {
          const attrCollection = {};
          attrCollection[this.options.attributesGroupName] = attrs;
          return attrCollection;
        }
        return attrs;
      }
    }
    __name(buildAttributesMap, "buildAttributesMap");
    var parseXml = /* @__PURE__ */ __name(function(xmlData) {
      xmlData = xmlData.replace(/\r\n?/g, "\n");
      const xmlObj = new xmlNode("!xml");
      let currentNode = xmlObj;
      let textData = "";
      let jPath = "";
      for (let i = 0; i < xmlData.length; i++) {
        const ch = xmlData[i];
        if (ch === "<") {
          if (xmlData[i + 1] === "/") {
            const closeIndex = findClosingIndex(xmlData, ">", i, "Closing Tag is not closed.");
            let tagName = xmlData.substring(i + 2, closeIndex).trim();
            if (this.options.removeNSPrefix) {
              const colonIndex = tagName.indexOf(":");
              if (colonIndex !== -1) {
                tagName = tagName.substr(colonIndex + 1);
              }
            }
            if (this.options.transformTagName) {
              tagName = this.options.transformTagName(tagName);
            }
            if (currentNode) {
              textData = this.saveTextToParentTag(textData, currentNode, jPath);
            }
            const lastTagName = jPath.substring(jPath.lastIndexOf(".") + 1);
            if (tagName && this.options.unpairedTags.indexOf(tagName) !== -1) {
              throw new Error(`Unpaired tag can not be used as closing tag: </${tagName}>`);
            }
            let propIndex = 0;
            if (lastTagName && this.options.unpairedTags.indexOf(lastTagName) !== -1) {
              propIndex = jPath.lastIndexOf(".", jPath.lastIndexOf(".") - 1);
              this.tagsNodeStack.pop();
            } else {
              propIndex = jPath.lastIndexOf(".");
            }
            jPath = jPath.substring(0, propIndex);
            currentNode = this.tagsNodeStack.pop();
            textData = "";
            i = closeIndex;
          } else if (xmlData[i + 1] === "?") {
            let tagData = readTagExp(xmlData, i, false, "?>");
            if (!tagData) throw new Error("Pi Tag is not closed.");
            textData = this.saveTextToParentTag(textData, currentNode, jPath);
            if (this.options.ignoreDeclaration && tagData.tagName === "?xml" || this.options.ignorePiTags) {
            } else {
              const childNode = new xmlNode(tagData.tagName);
              childNode.add(this.options.textNodeName, "");
              if (tagData.tagName !== tagData.tagExp && tagData.attrExpPresent) {
                childNode[":@"] = this.buildAttributesMap(tagData.tagExp, jPath, tagData.tagName);
              }
              this.addChild(currentNode, childNode, jPath);
            }
            i = tagData.closeIndex + 1;
          } else if (xmlData.substr(i + 1, 3) === "!--") {
            const endIndex = findClosingIndex(xmlData, "-->", i + 4, "Comment is not closed.");
            if (this.options.commentPropName) {
              const comment = xmlData.substring(i + 4, endIndex - 2);
              textData = this.saveTextToParentTag(textData, currentNode, jPath);
              currentNode.add(this.options.commentPropName, [{ [this.options.textNodeName]: comment }]);
            }
            i = endIndex;
          } else if (xmlData.substr(i + 1, 2) === "!D") {
            const result = readDocType(xmlData, i);
            this.docTypeEntities = result.entities;
            i = result.i;
          } else if (xmlData.substr(i + 1, 2) === "![") {
            const closeIndex = findClosingIndex(xmlData, "]]>", i, "CDATA is not closed.") - 2;
            const tagExp = xmlData.substring(i + 9, closeIndex);
            textData = this.saveTextToParentTag(textData, currentNode, jPath);
            let val = this.parseTextData(tagExp, currentNode.tagname, jPath, true, false, true, true);
            if (val == void 0) val = "";
            if (this.options.cdataPropName) {
              currentNode.add(this.options.cdataPropName, [{ [this.options.textNodeName]: tagExp }]);
            } else {
              currentNode.add(this.options.textNodeName, val);
            }
            i = closeIndex + 2;
          } else {
            let result = readTagExp(xmlData, i, this.options.removeNSPrefix);
            let tagName = result.tagName;
            const rawTagName = result.rawTagName;
            let tagExp = result.tagExp;
            let attrExpPresent = result.attrExpPresent;
            let closeIndex = result.closeIndex;
            if (this.options.transformTagName) {
              tagName = this.options.transformTagName(tagName);
            }
            if (currentNode && textData) {
              if (currentNode.tagname !== "!xml") {
                textData = this.saveTextToParentTag(textData, currentNode, jPath, false);
              }
            }
            const lastTag = currentNode;
            if (lastTag && this.options.unpairedTags.indexOf(lastTag.tagname) !== -1) {
              currentNode = this.tagsNodeStack.pop();
              jPath = jPath.substring(0, jPath.lastIndexOf("."));
            }
            if (tagName !== xmlObj.tagname) {
              jPath += jPath ? "." + tagName : tagName;
            }
            if (this.isItStopNode(this.options.stopNodes, jPath, tagName)) {
              let tagContent = "";
              if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
                if (tagName[tagName.length - 1] === "/") {
                  tagName = tagName.substr(0, tagName.length - 1);
                  jPath = jPath.substr(0, jPath.length - 1);
                  tagExp = tagName;
                } else {
                  tagExp = tagExp.substr(0, tagExp.length - 1);
                }
                i = result.closeIndex;
              } else if (this.options.unpairedTags.indexOf(tagName) !== -1) {
                i = result.closeIndex;
              } else {
                const result2 = this.readStopNodeData(xmlData, rawTagName, closeIndex + 1);
                if (!result2) throw new Error(`Unexpected end of ${rawTagName}`);
                i = result2.i;
                tagContent = result2.tagContent;
              }
              const childNode = new xmlNode(tagName);
              if (tagName !== tagExp && attrExpPresent) {
                childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
              }
              if (tagContent) {
                tagContent = this.parseTextData(tagContent, tagName, jPath, true, attrExpPresent, true, true);
              }
              jPath = jPath.substr(0, jPath.lastIndexOf("."));
              childNode.add(this.options.textNodeName, tagContent);
              this.addChild(currentNode, childNode, jPath);
            } else {
              if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
                if (tagName[tagName.length - 1] === "/") {
                  tagName = tagName.substr(0, tagName.length - 1);
                  jPath = jPath.substr(0, jPath.length - 1);
                  tagExp = tagName;
                } else {
                  tagExp = tagExp.substr(0, tagExp.length - 1);
                }
                if (this.options.transformTagName) {
                  tagName = this.options.transformTagName(tagName);
                }
                const childNode = new xmlNode(tagName);
                if (tagName !== tagExp && attrExpPresent) {
                  childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
                }
                this.addChild(currentNode, childNode, jPath);
                jPath = jPath.substr(0, jPath.lastIndexOf("."));
              } else {
                const childNode = new xmlNode(tagName);
                this.tagsNodeStack.push(currentNode);
                if (tagName !== tagExp && attrExpPresent) {
                  childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
                }
                this.addChild(currentNode, childNode, jPath);
                currentNode = childNode;
              }
              textData = "";
              i = closeIndex;
            }
          }
        } else {
          textData += xmlData[i];
        }
      }
      return xmlObj.child;
    }, "parseXml");
    function addChild(currentNode, childNode, jPath) {
      const result = this.options.updateTag(childNode.tagname, jPath, childNode[":@"]);
      if (result === false) {
      } else if (typeof result === "string") {
        childNode.tagname = result;
        currentNode.addChild(childNode);
      } else {
        currentNode.addChild(childNode);
      }
    }
    __name(addChild, "addChild");
    var replaceEntitiesValue = /* @__PURE__ */ __name(function(val) {
      if (this.options.processEntities) {
        for (let entityName in this.docTypeEntities) {
          const entity = this.docTypeEntities[entityName];
          val = val.replace(entity.regx, entity.val);
        }
        for (let entityName in this.lastEntities) {
          const entity = this.lastEntities[entityName];
          val = val.replace(entity.regex, entity.val);
        }
        if (this.options.htmlEntities) {
          for (let entityName in this.htmlEntities) {
            const entity = this.htmlEntities[entityName];
            val = val.replace(entity.regex, entity.val);
          }
        }
        val = val.replace(this.ampEntity.regex, this.ampEntity.val);
      }
      return val;
    }, "replaceEntitiesValue");
    function saveTextToParentTag(textData, currentNode, jPath, isLeafNode) {
      if (textData) {
        if (isLeafNode === void 0) isLeafNode = currentNode.child.length === 0;
        textData = this.parseTextData(
          textData,
          currentNode.tagname,
          jPath,
          false,
          currentNode[":@"] ? Object.keys(currentNode[":@"]).length !== 0 : false,
          isLeafNode
        );
        if (textData !== void 0 && textData !== "")
          currentNode.add(this.options.textNodeName, textData);
        textData = "";
      }
      return textData;
    }
    __name(saveTextToParentTag, "saveTextToParentTag");
    function isItStopNode(stopNodes, jPath, currentTagName) {
      const allNodesExp = "*." + currentTagName;
      for (const stopNodePath in stopNodes) {
        const stopNodeExp = stopNodes[stopNodePath];
        if (allNodesExp === stopNodeExp || jPath === stopNodeExp) return true;
      }
      return false;
    }
    __name(isItStopNode, "isItStopNode");
    function tagExpWithClosingIndex(xmlData, i, closingChar = ">") {
      let attrBoundary;
      let tagExp = "";
      for (let index = i; index < xmlData.length; index++) {
        let ch = xmlData[index];
        if (attrBoundary) {
          if (ch === attrBoundary) attrBoundary = "";
        } else if (ch === '"' || ch === "'") {
          attrBoundary = ch;
        } else if (ch === closingChar[0]) {
          if (closingChar[1]) {
            if (xmlData[index + 1] === closingChar[1]) {
              return {
                data: tagExp,
                index
              };
            }
          } else {
            return {
              data: tagExp,
              index
            };
          }
        } else if (ch === "	") {
          ch = " ";
        }
        tagExp += ch;
      }
    }
    __name(tagExpWithClosingIndex, "tagExpWithClosingIndex");
    function findClosingIndex(xmlData, str, i, errMsg) {
      const closingIndex = xmlData.indexOf(str, i);
      if (closingIndex === -1) {
        throw new Error(errMsg);
      } else {
        return closingIndex + str.length - 1;
      }
    }
    __name(findClosingIndex, "findClosingIndex");
    function readTagExp(xmlData, i, removeNSPrefix, closingChar = ">") {
      const result = tagExpWithClosingIndex(xmlData, i + 1, closingChar);
      if (!result) return;
      let tagExp = result.data;
      const closeIndex = result.index;
      const separatorIndex = tagExp.search(/\s/);
      let tagName = tagExp;
      let attrExpPresent = true;
      if (separatorIndex !== -1) {
        tagName = tagExp.substring(0, separatorIndex);
        tagExp = tagExp.substring(separatorIndex + 1).trimStart();
      }
      const rawTagName = tagName;
      if (removeNSPrefix) {
        const colonIndex = tagName.indexOf(":");
        if (colonIndex !== -1) {
          tagName = tagName.substr(colonIndex + 1);
          attrExpPresent = tagName !== result.data.substr(colonIndex + 1);
        }
      }
      return {
        tagName,
        tagExp,
        closeIndex,
        attrExpPresent,
        rawTagName
      };
    }
    __name(readTagExp, "readTagExp");
    function readStopNodeData(xmlData, tagName, i) {
      const startIndex = i;
      let openTagCount = 1;
      for (; i < xmlData.length; i++) {
        if (xmlData[i] === "<") {
          if (xmlData[i + 1] === "/") {
            const closeIndex = findClosingIndex(xmlData, ">", i, `${tagName} is not closed`);
            let closeTagName = xmlData.substring(i + 2, closeIndex).trim();
            if (closeTagName === tagName) {
              openTagCount--;
              if (openTagCount === 0) {
                return {
                  tagContent: xmlData.substring(startIndex, i),
                  i: closeIndex
                };
              }
            }
            i = closeIndex;
          } else if (xmlData[i + 1] === "?") {
            const closeIndex = findClosingIndex(xmlData, "?>", i + 1, "StopNode is not closed.");
            i = closeIndex;
          } else if (xmlData.substr(i + 1, 3) === "!--") {
            const closeIndex = findClosingIndex(xmlData, "-->", i + 3, "StopNode is not closed.");
            i = closeIndex;
          } else if (xmlData.substr(i + 1, 2) === "![") {
            const closeIndex = findClosingIndex(xmlData, "]]>", i, "StopNode is not closed.") - 2;
            i = closeIndex;
          } else {
            const tagData = readTagExp(xmlData, i, ">");
            if (tagData) {
              const openTagName = tagData && tagData.tagName;
              if (openTagName === tagName && tagData.tagExp[tagData.tagExp.length - 1] !== "/") {
                openTagCount++;
              }
              i = tagData.closeIndex;
            }
          }
        }
      }
    }
    __name(readStopNodeData, "readStopNodeData");
    function parseValue(val, shouldParse, options) {
      if (shouldParse && typeof val === "string") {
        const newval = val.trim();
        if (newval === "true") return true;
        else if (newval === "false") return false;
        else return toNumber(val, options);
      } else {
        if (util2.isExist(val)) {
          return val;
        } else {
          return "";
        }
      }
    }
    __name(parseValue, "parseValue");
    module.exports = OrderedObjParser;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/node2json.js
var require_node2json = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/node2json.js"(exports) {
    "use strict";
    init_modules_watch_stub();
    function prettify(node, options) {
      return compress(node, options);
    }
    __name(prettify, "prettify");
    function compress(arr, options, jPath) {
      let text;
      const compressedObj = {};
      for (let i = 0; i < arr.length; i++) {
        const tagObj = arr[i];
        const property = propName(tagObj);
        let newJpath = "";
        if (jPath === void 0) newJpath = property;
        else newJpath = jPath + "." + property;
        if (property === options.textNodeName) {
          if (text === void 0) text = tagObj[property];
          else text += "" + tagObj[property];
        } else if (property === void 0) {
          continue;
        } else if (tagObj[property]) {
          let val = compress(tagObj[property], options, newJpath);
          const isLeaf = isLeafTag(val, options);
          if (tagObj[":@"]) {
            assignAttributes(val, tagObj[":@"], newJpath, options);
          } else if (Object.keys(val).length === 1 && val[options.textNodeName] !== void 0 && !options.alwaysCreateTextNode) {
            val = val[options.textNodeName];
          } else if (Object.keys(val).length === 0) {
            if (options.alwaysCreateTextNode) val[options.textNodeName] = "";
            else val = "";
          }
          if (compressedObj[property] !== void 0 && compressedObj.hasOwnProperty(property)) {
            if (!Array.isArray(compressedObj[property])) {
              compressedObj[property] = [compressedObj[property]];
            }
            compressedObj[property].push(val);
          } else {
            if (options.isArray(property, newJpath, isLeaf)) {
              compressedObj[property] = [val];
            } else {
              compressedObj[property] = val;
            }
          }
        }
      }
      if (typeof text === "string") {
        if (text.length > 0) compressedObj[options.textNodeName] = text;
      } else if (text !== void 0) compressedObj[options.textNodeName] = text;
      return compressedObj;
    }
    __name(compress, "compress");
    function propName(obj) {
      const keys = Object.keys(obj);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key !== ":@") return key;
      }
    }
    __name(propName, "propName");
    function assignAttributes(obj, attrMap, jpath, options) {
      if (attrMap) {
        const keys = Object.keys(attrMap);
        const len = keys.length;
        for (let i = 0; i < len; i++) {
          const atrrName = keys[i];
          if (options.isArray(atrrName, jpath + "." + atrrName, true, true)) {
            obj[atrrName] = [attrMap[atrrName]];
          } else {
            obj[atrrName] = attrMap[atrrName];
          }
        }
      }
    }
    __name(assignAttributes, "assignAttributes");
    function isLeafTag(obj, options) {
      const { textNodeName } = options;
      const propCount = Object.keys(obj).length;
      if (propCount === 0) {
        return true;
      }
      if (propCount === 1 && (obj[textNodeName] || typeof obj[textNodeName] === "boolean" || obj[textNodeName] === 0)) {
        return true;
      }
      return false;
    }
    __name(isLeafTag, "isLeafTag");
    exports.prettify = prettify;
  }
});

// node_modules/fast-xml-parser/src/xmlparser/XMLParser.js
var require_XMLParser = __commonJS({
  "node_modules/fast-xml-parser/src/xmlparser/XMLParser.js"(exports, module) {
    init_modules_watch_stub();
    var { buildOptions } = require_OptionsBuilder();
    var OrderedObjParser = require_OrderedObjParser();
    var { prettify } = require_node2json();
    var validator = require_validator();
    var XMLParser2 = class {
      static {
        __name(this, "XMLParser");
      }
      constructor(options) {
        this.externalEntities = {};
        this.options = buildOptions(options);
      }
      /**
       * Parse XML dats to JS object 
       * @param {string|Buffer} xmlData 
       * @param {boolean|Object} validationOption 
       */
      parse(xmlData, validationOption) {
        if (typeof xmlData === "string") {
        } else if (xmlData.toString) {
          xmlData = xmlData.toString();
        } else {
          throw new Error("XML data is accepted in String or Bytes[] form.");
        }
        if (validationOption) {
          if (validationOption === true) validationOption = {};
          const result = validator.validate(xmlData, validationOption);
          if (result !== true) {
            throw Error(`${result.err.msg}:${result.err.line}:${result.err.col}`);
          }
        }
        const orderedObjParser = new OrderedObjParser(this.options);
        orderedObjParser.addExternalEntities(this.externalEntities);
        const orderedResult = orderedObjParser.parseXml(xmlData);
        if (this.options.preserveOrder || orderedResult === void 0) return orderedResult;
        else return prettify(orderedResult, this.options);
      }
      /**
       * Add Entity which is not by default supported by this library
       * @param {string} key 
       * @param {string} value 
       */
      addEntity(key, value) {
        if (value.indexOf("&") !== -1) {
          throw new Error("Entity value can't have '&'");
        } else if (key.indexOf("&") !== -1 || key.indexOf(";") !== -1) {
          throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
        } else if (value === "&") {
          throw new Error("An entity with value '&' is not permitted");
        } else {
          this.externalEntities[key] = value;
        }
      }
    };
    module.exports = XMLParser2;
  }
});

// node_modules/fast-xml-parser/src/xmlbuilder/orderedJs2Xml.js
var require_orderedJs2Xml = __commonJS({
  "node_modules/fast-xml-parser/src/xmlbuilder/orderedJs2Xml.js"(exports, module) {
    init_modules_watch_stub();
    var EOL = "\n";
    function toXml(jArray, options) {
      let indentation = "";
      if (options.format && options.indentBy.length > 0) {
        indentation = EOL;
      }
      return arrToStr(jArray, options, "", indentation);
    }
    __name(toXml, "toXml");
    function arrToStr(arr, options, jPath, indentation) {
      let xmlStr = "";
      let isPreviousElementTag = false;
      for (let i = 0; i < arr.length; i++) {
        const tagObj = arr[i];
        const tagName = propName(tagObj);
        if (tagName === void 0) continue;
        let newJPath = "";
        if (jPath.length === 0) newJPath = tagName;
        else newJPath = `${jPath}.${tagName}`;
        if (tagName === options.textNodeName) {
          let tagText = tagObj[tagName];
          if (!isStopNode(newJPath, options)) {
            tagText = options.tagValueProcessor(tagName, tagText);
            tagText = replaceEntitiesValue(tagText, options);
          }
          if (isPreviousElementTag) {
            xmlStr += indentation;
          }
          xmlStr += tagText;
          isPreviousElementTag = false;
          continue;
        } else if (tagName === options.cdataPropName) {
          if (isPreviousElementTag) {
            xmlStr += indentation;
          }
          xmlStr += `<![CDATA[${tagObj[tagName][0][options.textNodeName]}]]>`;
          isPreviousElementTag = false;
          continue;
        } else if (tagName === options.commentPropName) {
          xmlStr += indentation + `<!--${tagObj[tagName][0][options.textNodeName]}-->`;
          isPreviousElementTag = true;
          continue;
        } else if (tagName[0] === "?") {
          const attStr2 = attr_to_str(tagObj[":@"], options);
          const tempInd = tagName === "?xml" ? "" : indentation;
          let piTextNodeName = tagObj[tagName][0][options.textNodeName];
          piTextNodeName = piTextNodeName.length !== 0 ? " " + piTextNodeName : "";
          xmlStr += tempInd + `<${tagName}${piTextNodeName}${attStr2}?>`;
          isPreviousElementTag = true;
          continue;
        }
        let newIdentation = indentation;
        if (newIdentation !== "") {
          newIdentation += options.indentBy;
        }
        const attStr = attr_to_str(tagObj[":@"], options);
        const tagStart = indentation + `<${tagName}${attStr}`;
        const tagValue = arrToStr(tagObj[tagName], options, newJPath, newIdentation);
        if (options.unpairedTags.indexOf(tagName) !== -1) {
          if (options.suppressUnpairedNode) xmlStr += tagStart + ">";
          else xmlStr += tagStart + "/>";
        } else if ((!tagValue || tagValue.length === 0) && options.suppressEmptyNode) {
          xmlStr += tagStart + "/>";
        } else if (tagValue && tagValue.endsWith(">")) {
          xmlStr += tagStart + `>${tagValue}${indentation}</${tagName}>`;
        } else {
          xmlStr += tagStart + ">";
          if (tagValue && indentation !== "" && (tagValue.includes("/>") || tagValue.includes("</"))) {
            xmlStr += indentation + options.indentBy + tagValue + indentation;
          } else {
            xmlStr += tagValue;
          }
          xmlStr += `</${tagName}>`;
        }
        isPreviousElementTag = true;
      }
      return xmlStr;
    }
    __name(arrToStr, "arrToStr");
    function propName(obj) {
      const keys = Object.keys(obj);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (!obj.hasOwnProperty(key)) continue;
        if (key !== ":@") return key;
      }
    }
    __name(propName, "propName");
    function attr_to_str(attrMap, options) {
      let attrStr = "";
      if (attrMap && !options.ignoreAttributes) {
        for (let attr in attrMap) {
          if (!attrMap.hasOwnProperty(attr)) continue;
          let attrVal = options.attributeValueProcessor(attr, attrMap[attr]);
          attrVal = replaceEntitiesValue(attrVal, options);
          if (attrVal === true && options.suppressBooleanAttributes) {
            attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}`;
          } else {
            attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}="${attrVal}"`;
          }
        }
      }
      return attrStr;
    }
    __name(attr_to_str, "attr_to_str");
    function isStopNode(jPath, options) {
      jPath = jPath.substr(0, jPath.length - options.textNodeName.length - 1);
      let tagName = jPath.substr(jPath.lastIndexOf(".") + 1);
      for (let index in options.stopNodes) {
        if (options.stopNodes[index] === jPath || options.stopNodes[index] === "*." + tagName) return true;
      }
      return false;
    }
    __name(isStopNode, "isStopNode");
    function replaceEntitiesValue(textValue, options) {
      if (textValue && textValue.length > 0 && options.processEntities) {
        for (let i = 0; i < options.entities.length; i++) {
          const entity = options.entities[i];
          textValue = textValue.replace(entity.regex, entity.val);
        }
      }
      return textValue;
    }
    __name(replaceEntitiesValue, "replaceEntitiesValue");
    module.exports = toXml;
  }
});

// node_modules/fast-xml-parser/src/xmlbuilder/json2xml.js
var require_json2xml = __commonJS({
  "node_modules/fast-xml-parser/src/xmlbuilder/json2xml.js"(exports, module) {
    "use strict";
    init_modules_watch_stub();
    var buildFromOrderedJs = require_orderedJs2Xml();
    var getIgnoreAttributesFn = require_ignoreAttributes();
    var defaultOptions = {
      attributeNamePrefix: "@_",
      attributesGroupName: false,
      textNodeName: "#text",
      ignoreAttributes: true,
      cdataPropName: false,
      format: false,
      indentBy: "  ",
      suppressEmptyNode: false,
      suppressUnpairedNode: true,
      suppressBooleanAttributes: true,
      tagValueProcessor: /* @__PURE__ */ __name(function(key, a) {
        return a;
      }, "tagValueProcessor"),
      attributeValueProcessor: /* @__PURE__ */ __name(function(attrName, a) {
        return a;
      }, "attributeValueProcessor"),
      preserveOrder: false,
      commentPropName: false,
      unpairedTags: [],
      entities: [
        { regex: new RegExp("&", "g"), val: "&amp;" },
        //it must be on top
        { regex: new RegExp(">", "g"), val: "&gt;" },
        { regex: new RegExp("<", "g"), val: "&lt;" },
        { regex: new RegExp("'", "g"), val: "&apos;" },
        { regex: new RegExp('"', "g"), val: "&quot;" }
      ],
      processEntities: true,
      stopNodes: [],
      // transformTagName: false,
      // transformAttributeName: false,
      oneListGroup: false
    };
    function Builder(options) {
      this.options = Object.assign({}, defaultOptions, options);
      if (this.options.ignoreAttributes === true || this.options.attributesGroupName) {
        this.isAttribute = function() {
          return false;
        };
      } else {
        this.ignoreAttributesFn = getIgnoreAttributesFn(this.options.ignoreAttributes);
        this.attrPrefixLen = this.options.attributeNamePrefix.length;
        this.isAttribute = isAttribute;
      }
      this.processTextOrObjNode = processTextOrObjNode;
      if (this.options.format) {
        this.indentate = indentate;
        this.tagEndChar = ">\n";
        this.newLine = "\n";
      } else {
        this.indentate = function() {
          return "";
        };
        this.tagEndChar = ">";
        this.newLine = "";
      }
    }
    __name(Builder, "Builder");
    Builder.prototype.build = function(jObj) {
      if (this.options.preserveOrder) {
        return buildFromOrderedJs(jObj, this.options);
      } else {
        if (Array.isArray(jObj) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1) {
          jObj = {
            [this.options.arrayNodeName]: jObj
          };
        }
        return this.j2x(jObj, 0, []).val;
      }
    };
    Builder.prototype.j2x = function(jObj, level, ajPath) {
      let attrStr = "";
      let val = "";
      const jPath = ajPath.join(".");
      for (let key in jObj) {
        if (!Object.prototype.hasOwnProperty.call(jObj, key)) continue;
        if (typeof jObj[key] === "undefined") {
          if (this.isAttribute(key)) {
            val += "";
          }
        } else if (jObj[key] === null) {
          if (this.isAttribute(key)) {
            val += "";
          } else if (key === this.options.cdataPropName) {
            val += "";
          } else if (key[0] === "?") {
            val += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
          } else {
            val += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
          }
        } else if (jObj[key] instanceof Date) {
          val += this.buildTextValNode(jObj[key], key, "", level);
        } else if (typeof jObj[key] !== "object") {
          const attr = this.isAttribute(key);
          if (attr && !this.ignoreAttributesFn(attr, jPath)) {
            attrStr += this.buildAttrPairStr(attr, "" + jObj[key]);
          } else if (!attr) {
            if (key === this.options.textNodeName) {
              let newval = this.options.tagValueProcessor(key, "" + jObj[key]);
              val += this.replaceEntitiesValue(newval);
            } else {
              val += this.buildTextValNode(jObj[key], key, "", level);
            }
          }
        } else if (Array.isArray(jObj[key])) {
          const arrLen = jObj[key].length;
          let listTagVal = "";
          let listTagAttr = "";
          for (let j = 0; j < arrLen; j++) {
            const item = jObj[key][j];
            if (typeof item === "undefined") {
            } else if (item === null) {
              if (key[0] === "?") val += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
              else val += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
            } else if (typeof item === "object") {
              if (this.options.oneListGroup) {
                const result = this.j2x(item, level + 1, ajPath.concat(key));
                listTagVal += result.val;
                if (this.options.attributesGroupName && item.hasOwnProperty(this.options.attributesGroupName)) {
                  listTagAttr += result.attrStr;
                }
              } else {
                listTagVal += this.processTextOrObjNode(item, key, level, ajPath);
              }
            } else {
              if (this.options.oneListGroup) {
                let textValue = this.options.tagValueProcessor(key, item);
                textValue = this.replaceEntitiesValue(textValue);
                listTagVal += textValue;
              } else {
                listTagVal += this.buildTextValNode(item, key, "", level);
              }
            }
          }
          if (this.options.oneListGroup) {
            listTagVal = this.buildObjectNode(listTagVal, key, listTagAttr, level);
          }
          val += listTagVal;
        } else {
          if (this.options.attributesGroupName && key === this.options.attributesGroupName) {
            const Ks = Object.keys(jObj[key]);
            const L = Ks.length;
            for (let j = 0; j < L; j++) {
              attrStr += this.buildAttrPairStr(Ks[j], "" + jObj[key][Ks[j]]);
            }
          } else {
            val += this.processTextOrObjNode(jObj[key], key, level, ajPath);
          }
        }
      }
      return { attrStr, val };
    };
    Builder.prototype.buildAttrPairStr = function(attrName, val) {
      val = this.options.attributeValueProcessor(attrName, "" + val);
      val = this.replaceEntitiesValue(val);
      if (this.options.suppressBooleanAttributes && val === "true") {
        return " " + attrName;
      } else return " " + attrName + '="' + val + '"';
    };
    function processTextOrObjNode(object, key, level, ajPath) {
      const result = this.j2x(object, level + 1, ajPath.concat(key));
      if (object[this.options.textNodeName] !== void 0 && Object.keys(object).length === 1) {
        return this.buildTextValNode(object[this.options.textNodeName], key, result.attrStr, level);
      } else {
        return this.buildObjectNode(result.val, key, result.attrStr, level);
      }
    }
    __name(processTextOrObjNode, "processTextOrObjNode");
    Builder.prototype.buildObjectNode = function(val, key, attrStr, level) {
      if (val === "") {
        if (key[0] === "?") return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
        else {
          return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
        }
      } else {
        let tagEndExp = "</" + key + this.tagEndChar;
        let piClosingChar = "";
        if (key[0] === "?") {
          piClosingChar = "?";
          tagEndExp = "";
        }
        if ((attrStr || attrStr === "") && val.indexOf("<") === -1) {
          return this.indentate(level) + "<" + key + attrStr + piClosingChar + ">" + val + tagEndExp;
        } else if (this.options.commentPropName !== false && key === this.options.commentPropName && piClosingChar.length === 0) {
          return this.indentate(level) + `<!--${val}-->` + this.newLine;
        } else {
          return this.indentate(level) + "<" + key + attrStr + piClosingChar + this.tagEndChar + val + this.indentate(level) + tagEndExp;
        }
      }
    };
    Builder.prototype.closeTag = function(key) {
      let closeTag = "";
      if (this.options.unpairedTags.indexOf(key) !== -1) {
        if (!this.options.suppressUnpairedNode) closeTag = "/";
      } else if (this.options.suppressEmptyNode) {
        closeTag = "/";
      } else {
        closeTag = `></${key}`;
      }
      return closeTag;
    };
    Builder.prototype.buildTextValNode = function(val, key, attrStr, level) {
      if (this.options.cdataPropName !== false && key === this.options.cdataPropName) {
        return this.indentate(level) + `<![CDATA[${val}]]>` + this.newLine;
      } else if (this.options.commentPropName !== false && key === this.options.commentPropName) {
        return this.indentate(level) + `<!--${val}-->` + this.newLine;
      } else if (key[0] === "?") {
        return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
      } else {
        let textValue = this.options.tagValueProcessor(key, val);
        textValue = this.replaceEntitiesValue(textValue);
        if (textValue === "") {
          return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
        } else {
          return this.indentate(level) + "<" + key + attrStr + ">" + textValue + "</" + key + this.tagEndChar;
        }
      }
    };
    Builder.prototype.replaceEntitiesValue = function(textValue) {
      if (textValue && textValue.length > 0 && this.options.processEntities) {
        for (let i = 0; i < this.options.entities.length; i++) {
          const entity = this.options.entities[i];
          textValue = textValue.replace(entity.regex, entity.val);
        }
      }
      return textValue;
    };
    function indentate(level) {
      return this.options.indentBy.repeat(level);
    }
    __name(indentate, "indentate");
    function isAttribute(name) {
      if (name.startsWith(this.options.attributeNamePrefix) && name !== this.options.textNodeName) {
        return name.substr(this.attrPrefixLen);
      } else {
        return false;
      }
    }
    __name(isAttribute, "isAttribute");
    module.exports = Builder;
  }
});

// node_modules/fast-xml-parser/src/fxp.js
var require_fxp = __commonJS({
  "node_modules/fast-xml-parser/src/fxp.js"(exports, module) {
    "use strict";
    init_modules_watch_stub();
    var validator = require_validator();
    var XMLParser2 = require_XMLParser();
    var XMLBuilder = require_json2xml();
    module.exports = {
      XMLParser: XMLParser2,
      XMLValidator: validator,
      XMLBuilder
    };
  }
});

// .wrangler/tmp/bundle-Dq0ngM/middleware-loader.entry.ts
init_modules_watch_stub();

// .wrangler/tmp/bundle-Dq0ngM/middleware-insertion-facade.js
init_modules_watch_stub();

// src/index.ts
init_modules_watch_stub();

// src/lib/router.ts
init_modules_watch_stub();
function compilePath(path) {
  const keys = [];
  const normalized = path === "/" ? "" : path.replace(/\/$/, "");
  const escaped = normalized.replace(/([.+*?=^!:${}()[\]|\/\\])/g, "\\$1").replace(/\\\/:([A-Za-z0-9_]+)/g, (_m, key) => {
    keys.push(String(key));
    return "\\/([^\\/]+)";
  });
  const regex = new RegExp(`^${escaped || ""}\\/?$`);
  return { regex, keys };
}
__name(compilePath, "compilePath");
function describeValue(v) {
  const t = typeof v;
  if (v === null) return "null";
  if (t === "function") return `function ${v.name || "(anonymous)"}`;
  if (t !== "object") return `${t}(${String(v)})`;
  const obj = v;
  const ctor = obj?.constructor?.name;
  const keys = Object.keys(obj);
  return `object${ctor ? `(${ctor})` : ""} keys=[${keys.slice(0, 8).join(", ")}${keys.length > 8 ? ", ..." : ""}]`;
}
__name(describeValue, "describeValue");
var Router = class {
  static {
    __name(this, "Router");
  }
  routes = [];
  middlewares = [];
  // aceita vários e também arrays (app.use([mw1, mw2]) ou app.use(mw1, mw2))
  use(...mws) {
    const flat = mws.flat?.(Infinity) ?? [].concat(...mws);
    for (const mw of flat) {
      if (typeof mw !== "function") {
        throw new TypeError(
          `[Router.use] Middleware inv\xE1lido: ${describeValue(mw)}
Dicas comuns: import errado (import * as X), array passado sem spread, factory chamada errado (mw()), ou router/objeto passado no lugar da fun\xE7\xE3o.`
        );
      }
      const stack = new Error().stack;
      const addedAt = stack ? stack.split("\n").slice(2, 7).join("\n") : void 0;
      this.middlewares.push({
        fn: mw,
        name: mw.name || "(anonymous)",
        addedAt
      });
    }
    return this;
  }
  get(path, handler) {
    return this.add("GET", path, handler);
  }
  post(path, handler) {
    return this.add("POST", path, handler);
  }
  put(path, handler) {
    return this.add("PUT", path, handler);
  }
  patch(path, handler) {
    return this.add("PATCH", path, handler);
  }
  delete(path, handler) {
    return this.add("DELETE", path, handler);
  }
  options(path, handler) {
    return this.add("OPTIONS", path, handler);
  }
  add(method, path, handler) {
    const { regex, keys } = compilePath(path);
    this.routes.push({ method, regex, keys, handler });
    return this;
  }
  async handle(req, env) {
    const url = new URL(req.url);
    const method = req.method.toUpperCase();
    const pathname = url.pathname;
    const route = this.routes.find((r) => r.method === method && r.regex.test(pathname));
    if (!route) return new Response("Not found", { status: 404 });
    const match = pathname.match(route.regex);
    const params = {};
    if (match) {
      for (let i = 0; i < route.keys.length; i++) {
        params[route.keys[i]] = decodeURIComponent(match[i + 1]);
      }
    }
    const query = {};
    url.searchParams.forEach((value, key) => {
      query[key] = value;
    });
    const ctx = {
      requestId: crypto.randomUUID(),
      req,
      env,
      params,
      query
    };
    let idx = -1;
    const dispatch = /* @__PURE__ */ __name(async (i) => {
      if (i <= idx) throw new Error("Middleware chain error");
      idx = i;
      const stored = this.middlewares[i];
      if (stored !== void 0) {
        if (typeof stored.fn !== "function") {
          throw new TypeError(
            `[Router.dispatch] Middleware corrompido no \xEDndice ${i}: ${describeValue(stored.fn)}`
          );
        }
        try {
          return await stored.fn(ctx, () => dispatch(i + 1));
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          throw new Error(
            `Erro no middleware #${i} (${stored.name}).
` + (stored.addedAt ? `Registrado em:
${stored.addedAt}
` : "") + `Original: ${msg}`
          );
        }
      }
      return await Promise.resolve(route.handler(ctx));
    }, "dispatch");
    return dispatch(0);
  }
};

// src/middlewares/error.middleware.ts
init_modules_watch_stub();

// src/lib/errors.ts
init_modules_watch_stub();
var AppError = class extends Error {
  static {
    __name(this, "AppError");
  }
  status;
  code;
  details;
  constructor(status, code, message2, details) {
    super(message2);
    this.status = status;
    this.code = code;
    this.details = details;
  }
};
var ValidationError = class extends AppError {
  static {
    __name(this, "ValidationError");
  }
  constructor(message2, details) {
    super(400, "VALIDATION_ERROR", message2, details);
  }
};
var UnauthorizedError = class extends AppError {
  static {
    __name(this, "UnauthorizedError");
  }
  constructor(message2 = "Unauthorized") {
    super(401, "UNAUTHORIZED", message2);
  }
};
var NotFoundError = class extends AppError {
  static {
    __name(this, "NotFoundError");
  }
  constructor(message2 = "Not found") {
    super(404, "NOT_FOUND", message2);
  }
};

// src/lib/http.ts
init_modules_watch_stub();
function jsonResponse(body, init = {}) {
  const headers = new Headers(init.headers);
  if (!headers.has("content-type")) headers.set("content-type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(body), { ...init, headers });
}
__name(jsonResponse, "jsonResponse");
async function parseJson(req, schema) {
  let data;
  try {
    data = await req.json();
  } catch {
    throw new HttpError(400, "Invalid JSON body");
  }
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new HttpError(400, "Validation error", parsed.error.flatten());
  }
  return parsed.data;
}
__name(parseJson, "parseJson");
var HttpError = class extends Error {
  static {
    __name(this, "HttpError");
  }
  status;
  details;
  constructor(status, message2, details) {
    super(message2);
    this.status = status;
    this.details = details;
  }
};

// src/middlewares/error.middleware.ts
var errorMiddleware = /* @__PURE__ */ __name(async (ctx, next) => {
  try {
    return await next();
  } catch (err) {
    if (err instanceof AppError) {
      return jsonResponse(
        {
          error: {
            code: err.code,
            message: err.message
          }
        },
        err.status
      );
    }
    if (err instanceof HttpError) {
      return jsonResponse(
        {
          error: {
            code: "http_error",
            message: err.message
          }
        },
        err.status
      );
    }
    const message2 = err instanceof Error ? err.message : String(err);
    return jsonResponse(
      {
        error: {
          code: "internal_error",
          message: "Erro interno."
        },
        debug: ctx.env.ENV === "dev" ? message2 : void 0
      },
      500
    );
  }
}, "errorMiddleware");

// src/middlewares/cors.middleware.ts
init_modules_watch_stub();
var corsMiddleware = /* @__PURE__ */ __name(async (ctx, next) => {
  const origin = ctx.req.headers.get("origin") || "*";
  const headers = new Headers();
  headers.set("access-control-allow-origin", origin);
  headers.set("access-control-allow-methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  headers.set("access-control-allow-headers", "content-type,authorization,x-admin-key");
  headers.set("access-control-max-age", "86400");
  headers.set("access-control-allow-credentials", "true");
  if (ctx.req.method.toUpperCase() === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }
  const res = await next();
  const merged = new Headers(res.headers);
  headers.forEach((v, k) => merged.set(k, v));
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: merged
  });
}, "corsMiddleware");

// src/middlewares/auth.middleware.ts
init_modules_watch_stub();

// src/lib/jwt.ts
init_modules_watch_stub();

// node_modules/jose/dist/browser/index.js
init_modules_watch_stub();

// node_modules/jose/dist/browser/runtime/base64url.js
init_modules_watch_stub();

// node_modules/jose/dist/browser/lib/buffer_utils.js
init_modules_watch_stub();

// node_modules/jose/dist/browser/runtime/webcrypto.js
init_modules_watch_stub();
var webcrypto_default = crypto;
var isCryptoKey = /* @__PURE__ */ __name((key) => key instanceof CryptoKey, "isCryptoKey");

// node_modules/jose/dist/browser/lib/buffer_utils.js
var encoder = new TextEncoder();
var decoder = new TextDecoder();
var MAX_INT32 = 2 ** 32;
function concat(...buffers) {
  const size = buffers.reduce((acc, { length }) => acc + length, 0);
  const buf = new Uint8Array(size);
  let i = 0;
  for (const buffer of buffers) {
    buf.set(buffer, i);
    i += buffer.length;
  }
  return buf;
}
__name(concat, "concat");

// node_modules/jose/dist/browser/runtime/base64url.js
var encodeBase64 = /* @__PURE__ */ __name((input) => {
  let unencoded = input;
  if (typeof unencoded === "string") {
    unencoded = encoder.encode(unencoded);
  }
  const CHUNK_SIZE = 32768;
  const arr = [];
  for (let i = 0; i < unencoded.length; i += CHUNK_SIZE) {
    arr.push(String.fromCharCode.apply(null, unencoded.subarray(i, i + CHUNK_SIZE)));
  }
  return btoa(arr.join(""));
}, "encodeBase64");
var encode = /* @__PURE__ */ __name((input) => {
  return encodeBase64(input).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}, "encode");
var decodeBase64 = /* @__PURE__ */ __name((encoded) => {
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}, "decodeBase64");
var decode = /* @__PURE__ */ __name((input) => {
  let encoded = input;
  if (encoded instanceof Uint8Array) {
    encoded = decoder.decode(encoded);
  }
  encoded = encoded.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
  try {
    return decodeBase64(encoded);
  } catch {
    throw new TypeError("The input to be decoded is not correctly encoded.");
  }
}, "decode");

// node_modules/jose/dist/browser/util/errors.js
init_modules_watch_stub();
var JOSEError = class extends Error {
  static {
    __name(this, "JOSEError");
  }
  constructor(message2, options) {
    super(message2, options);
    this.code = "ERR_JOSE_GENERIC";
    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }
};
JOSEError.code = "ERR_JOSE_GENERIC";
var JWTClaimValidationFailed = class extends JOSEError {
  static {
    __name(this, "JWTClaimValidationFailed");
  }
  constructor(message2, payload, claim = "unspecified", reason = "unspecified") {
    super(message2, { cause: { claim, reason, payload } });
    this.code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
    this.claim = claim;
    this.reason = reason;
    this.payload = payload;
  }
};
JWTClaimValidationFailed.code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
var JWTExpired = class extends JOSEError {
  static {
    __name(this, "JWTExpired");
  }
  constructor(message2, payload, claim = "unspecified", reason = "unspecified") {
    super(message2, { cause: { claim, reason, payload } });
    this.code = "ERR_JWT_EXPIRED";
    this.claim = claim;
    this.reason = reason;
    this.payload = payload;
  }
};
JWTExpired.code = "ERR_JWT_EXPIRED";
var JOSEAlgNotAllowed = class extends JOSEError {
  static {
    __name(this, "JOSEAlgNotAllowed");
  }
  constructor() {
    super(...arguments);
    this.code = "ERR_JOSE_ALG_NOT_ALLOWED";
  }
};
JOSEAlgNotAllowed.code = "ERR_JOSE_ALG_NOT_ALLOWED";
var JOSENotSupported = class extends JOSEError {
  static {
    __name(this, "JOSENotSupported");
  }
  constructor() {
    super(...arguments);
    this.code = "ERR_JOSE_NOT_SUPPORTED";
  }
};
JOSENotSupported.code = "ERR_JOSE_NOT_SUPPORTED";
var JWEDecryptionFailed = class extends JOSEError {
  static {
    __name(this, "JWEDecryptionFailed");
  }
  constructor(message2 = "decryption operation failed", options) {
    super(message2, options);
    this.code = "ERR_JWE_DECRYPTION_FAILED";
  }
};
JWEDecryptionFailed.code = "ERR_JWE_DECRYPTION_FAILED";
var JWEInvalid = class extends JOSEError {
  static {
    __name(this, "JWEInvalid");
  }
  constructor() {
    super(...arguments);
    this.code = "ERR_JWE_INVALID";
  }
};
JWEInvalid.code = "ERR_JWE_INVALID";
var JWSInvalid = class extends JOSEError {
  static {
    __name(this, "JWSInvalid");
  }
  constructor() {
    super(...arguments);
    this.code = "ERR_JWS_INVALID";
  }
};
JWSInvalid.code = "ERR_JWS_INVALID";
var JWTInvalid = class extends JOSEError {
  static {
    __name(this, "JWTInvalid");
  }
  constructor() {
    super(...arguments);
    this.code = "ERR_JWT_INVALID";
  }
};
JWTInvalid.code = "ERR_JWT_INVALID";
var JWKInvalid = class extends JOSEError {
  static {
    __name(this, "JWKInvalid");
  }
  constructor() {
    super(...arguments);
    this.code = "ERR_JWK_INVALID";
  }
};
JWKInvalid.code = "ERR_JWK_INVALID";
var JWKSInvalid = class extends JOSEError {
  static {
    __name(this, "JWKSInvalid");
  }
  constructor() {
    super(...arguments);
    this.code = "ERR_JWKS_INVALID";
  }
};
JWKSInvalid.code = "ERR_JWKS_INVALID";
var JWKSNoMatchingKey = class extends JOSEError {
  static {
    __name(this, "JWKSNoMatchingKey");
  }
  constructor(message2 = "no applicable key found in the JSON Web Key Set", options) {
    super(message2, options);
    this.code = "ERR_JWKS_NO_MATCHING_KEY";
  }
};
JWKSNoMatchingKey.code = "ERR_JWKS_NO_MATCHING_KEY";
var JWKSMultipleMatchingKeys = class extends JOSEError {
  static {
    __name(this, "JWKSMultipleMatchingKeys");
  }
  constructor(message2 = "multiple matching keys found in the JSON Web Key Set", options) {
    super(message2, options);
    this.code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
  }
};
JWKSMultipleMatchingKeys.code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
var JWKSTimeout = class extends JOSEError {
  static {
    __name(this, "JWKSTimeout");
  }
  constructor(message2 = "request timed out", options) {
    super(message2, options);
    this.code = "ERR_JWKS_TIMEOUT";
  }
};
JWKSTimeout.code = "ERR_JWKS_TIMEOUT";
var JWSSignatureVerificationFailed = class extends JOSEError {
  static {
    __name(this, "JWSSignatureVerificationFailed");
  }
  constructor(message2 = "signature verification failed", options) {
    super(message2, options);
    this.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
  }
};
JWSSignatureVerificationFailed.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";

// node_modules/jose/dist/browser/lib/crypto_key.js
init_modules_watch_stub();
function unusable(name, prop = "algorithm.name") {
  return new TypeError(`CryptoKey does not support this operation, its ${prop} must be ${name}`);
}
__name(unusable, "unusable");
function isAlgorithm(algorithm, name) {
  return algorithm.name === name;
}
__name(isAlgorithm, "isAlgorithm");
function getHashLength(hash) {
  return parseInt(hash.name.slice(4), 10);
}
__name(getHashLength, "getHashLength");
function getNamedCurve(alg) {
  switch (alg) {
    case "ES256":
      return "P-256";
    case "ES384":
      return "P-384";
    case "ES512":
      return "P-521";
    default:
      throw new Error("unreachable");
  }
}
__name(getNamedCurve, "getNamedCurve");
function checkUsage(key, usages) {
  if (usages.length && !usages.some((expected) => key.usages.includes(expected))) {
    let msg = "CryptoKey does not support this operation, its usages must include ";
    if (usages.length > 2) {
      const last = usages.pop();
      msg += `one of ${usages.join(", ")}, or ${last}.`;
    } else if (usages.length === 2) {
      msg += `one of ${usages[0]} or ${usages[1]}.`;
    } else {
      msg += `${usages[0]}.`;
    }
    throw new TypeError(msg);
  }
}
__name(checkUsage, "checkUsage");
function checkSigCryptoKey(key, alg, ...usages) {
  switch (alg) {
    case "HS256":
    case "HS384":
    case "HS512": {
      if (!isAlgorithm(key.algorithm, "HMAC"))
        throw unusable("HMAC");
      const expected = parseInt(alg.slice(2), 10);
      const actual = getHashLength(key.algorithm.hash);
      if (actual !== expected)
        throw unusable(`SHA-${expected}`, "algorithm.hash");
      break;
    }
    case "RS256":
    case "RS384":
    case "RS512": {
      if (!isAlgorithm(key.algorithm, "RSASSA-PKCS1-v1_5"))
        throw unusable("RSASSA-PKCS1-v1_5");
      const expected = parseInt(alg.slice(2), 10);
      const actual = getHashLength(key.algorithm.hash);
      if (actual !== expected)
        throw unusable(`SHA-${expected}`, "algorithm.hash");
      break;
    }
    case "PS256":
    case "PS384":
    case "PS512": {
      if (!isAlgorithm(key.algorithm, "RSA-PSS"))
        throw unusable("RSA-PSS");
      const expected = parseInt(alg.slice(2), 10);
      const actual = getHashLength(key.algorithm.hash);
      if (actual !== expected)
        throw unusable(`SHA-${expected}`, "algorithm.hash");
      break;
    }
    case "EdDSA": {
      if (key.algorithm.name !== "Ed25519" && key.algorithm.name !== "Ed448") {
        throw unusable("Ed25519 or Ed448");
      }
      break;
    }
    case "Ed25519": {
      if (!isAlgorithm(key.algorithm, "Ed25519"))
        throw unusable("Ed25519");
      break;
    }
    case "ES256":
    case "ES384":
    case "ES512": {
      if (!isAlgorithm(key.algorithm, "ECDSA"))
        throw unusable("ECDSA");
      const expected = getNamedCurve(alg);
      const actual = key.algorithm.namedCurve;
      if (actual !== expected)
        throw unusable(expected, "algorithm.namedCurve");
      break;
    }
    default:
      throw new TypeError("CryptoKey does not support this operation");
  }
  checkUsage(key, usages);
}
__name(checkSigCryptoKey, "checkSigCryptoKey");

// node_modules/jose/dist/browser/lib/invalid_key_input.js
init_modules_watch_stub();
function message(msg, actual, ...types2) {
  types2 = types2.filter(Boolean);
  if (types2.length > 2) {
    const last = types2.pop();
    msg += `one of type ${types2.join(", ")}, or ${last}.`;
  } else if (types2.length === 2) {
    msg += `one of type ${types2[0]} or ${types2[1]}.`;
  } else {
    msg += `of type ${types2[0]}.`;
  }
  if (actual == null) {
    msg += ` Received ${actual}`;
  } else if (typeof actual === "function" && actual.name) {
    msg += ` Received function ${actual.name}`;
  } else if (typeof actual === "object" && actual != null) {
    if (actual.constructor?.name) {
      msg += ` Received an instance of ${actual.constructor.name}`;
    }
  }
  return msg;
}
__name(message, "message");
var invalid_key_input_default = /* @__PURE__ */ __name((actual, ...types2) => {
  return message("Key must be ", actual, ...types2);
}, "default");
function withAlg(alg, actual, ...types2) {
  return message(`Key for the ${alg} algorithm must be `, actual, ...types2);
}
__name(withAlg, "withAlg");

// node_modules/jose/dist/browser/runtime/is_key_like.js
init_modules_watch_stub();
var is_key_like_default = /* @__PURE__ */ __name((key) => {
  if (isCryptoKey(key)) {
    return true;
  }
  return key?.[Symbol.toStringTag] === "KeyObject";
}, "default");
var types = ["CryptoKey"];

// node_modules/jose/dist/browser/lib/is_disjoint.js
init_modules_watch_stub();
var isDisjoint = /* @__PURE__ */ __name((...headers) => {
  const sources = headers.filter(Boolean);
  if (sources.length === 0 || sources.length === 1) {
    return true;
  }
  let acc;
  for (const header of sources) {
    const parameters = Object.keys(header);
    if (!acc || acc.size === 0) {
      acc = new Set(parameters);
      continue;
    }
    for (const parameter of parameters) {
      if (acc.has(parameter)) {
        return false;
      }
      acc.add(parameter);
    }
  }
  return true;
}, "isDisjoint");
var is_disjoint_default = isDisjoint;

// node_modules/jose/dist/browser/lib/is_object.js
init_modules_watch_stub();
function isObjectLike(value) {
  return typeof value === "object" && value !== null;
}
__name(isObjectLike, "isObjectLike");
function isObject(input) {
  if (!isObjectLike(input) || Object.prototype.toString.call(input) !== "[object Object]") {
    return false;
  }
  if (Object.getPrototypeOf(input) === null) {
    return true;
  }
  let proto = input;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(input) === proto;
}
__name(isObject, "isObject");

// node_modules/jose/dist/browser/runtime/check_key_length.js
init_modules_watch_stub();
var check_key_length_default = /* @__PURE__ */ __name((alg, key) => {
  if (alg.startsWith("RS") || alg.startsWith("PS")) {
    const { modulusLength } = key.algorithm;
    if (typeof modulusLength !== "number" || modulusLength < 2048) {
      throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`);
    }
  }
}, "default");

// node_modules/jose/dist/browser/runtime/normalize_key.js
init_modules_watch_stub();

// node_modules/jose/dist/browser/lib/is_jwk.js
init_modules_watch_stub();
function isJWK(key) {
  return isObject(key) && typeof key.kty === "string";
}
__name(isJWK, "isJWK");
function isPrivateJWK(key) {
  return key.kty !== "oct" && typeof key.d === "string";
}
__name(isPrivateJWK, "isPrivateJWK");
function isPublicJWK(key) {
  return key.kty !== "oct" && typeof key.d === "undefined";
}
__name(isPublicJWK, "isPublicJWK");
function isSecretJWK(key) {
  return isJWK(key) && key.kty === "oct" && typeof key.k === "string";
}
__name(isSecretJWK, "isSecretJWK");

// node_modules/jose/dist/browser/runtime/jwk_to_key.js
init_modules_watch_stub();
function subtleMapping(jwk) {
  let algorithm;
  let keyUsages;
  switch (jwk.kty) {
    case "RSA": {
      switch (jwk.alg) {
        case "PS256":
        case "PS384":
        case "PS512":
          algorithm = { name: "RSA-PSS", hash: `SHA-${jwk.alg.slice(-3)}` };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "RS256":
        case "RS384":
        case "RS512":
          algorithm = { name: "RSASSA-PKCS1-v1_5", hash: `SHA-${jwk.alg.slice(-3)}` };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "RSA-OAEP":
        case "RSA-OAEP-256":
        case "RSA-OAEP-384":
        case "RSA-OAEP-512":
          algorithm = {
            name: "RSA-OAEP",
            hash: `SHA-${parseInt(jwk.alg.slice(-3), 10) || 1}`
          };
          keyUsages = jwk.d ? ["decrypt", "unwrapKey"] : ["encrypt", "wrapKey"];
          break;
        default:
          throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
      }
      break;
    }
    case "EC": {
      switch (jwk.alg) {
        case "ES256":
          algorithm = { name: "ECDSA", namedCurve: "P-256" };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "ES384":
          algorithm = { name: "ECDSA", namedCurve: "P-384" };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "ES512":
          algorithm = { name: "ECDSA", namedCurve: "P-521" };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "ECDH-ES":
        case "ECDH-ES+A128KW":
        case "ECDH-ES+A192KW":
        case "ECDH-ES+A256KW":
          algorithm = { name: "ECDH", namedCurve: jwk.crv };
          keyUsages = jwk.d ? ["deriveBits"] : [];
          break;
        default:
          throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
      }
      break;
    }
    case "OKP": {
      switch (jwk.alg) {
        case "Ed25519":
          algorithm = { name: "Ed25519" };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "EdDSA":
          algorithm = { name: jwk.crv };
          keyUsages = jwk.d ? ["sign"] : ["verify"];
          break;
        case "ECDH-ES":
        case "ECDH-ES+A128KW":
        case "ECDH-ES+A192KW":
        case "ECDH-ES+A256KW":
          algorithm = { name: jwk.crv };
          keyUsages = jwk.d ? ["deriveBits"] : [];
          break;
        default:
          throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
      }
      break;
    }
    default:
      throw new JOSENotSupported('Invalid or unsupported JWK "kty" (Key Type) Parameter value');
  }
  return { algorithm, keyUsages };
}
__name(subtleMapping, "subtleMapping");
var parse = /* @__PURE__ */ __name(async (jwk) => {
  if (!jwk.alg) {
    throw new TypeError('"alg" argument is required when "jwk.alg" is not present');
  }
  const { algorithm, keyUsages } = subtleMapping(jwk);
  const rest = [
    algorithm,
    jwk.ext ?? false,
    jwk.key_ops ?? keyUsages
  ];
  const keyData = { ...jwk };
  delete keyData.alg;
  delete keyData.use;
  return webcrypto_default.subtle.importKey("jwk", keyData, ...rest);
}, "parse");
var jwk_to_key_default = parse;

// node_modules/jose/dist/browser/runtime/normalize_key.js
var exportKeyValue = /* @__PURE__ */ __name((k) => decode(k), "exportKeyValue");
var privCache;
var pubCache;
var isKeyObject = /* @__PURE__ */ __name((key) => {
  return key?.[Symbol.toStringTag] === "KeyObject";
}, "isKeyObject");
var importAndCache = /* @__PURE__ */ __name(async (cache, key, jwk, alg, freeze = false) => {
  let cached = cache.get(key);
  if (cached?.[alg]) {
    return cached[alg];
  }
  const cryptoKey = await jwk_to_key_default({ ...jwk, alg });
  if (freeze)
    Object.freeze(key);
  if (!cached) {
    cache.set(key, { [alg]: cryptoKey });
  } else {
    cached[alg] = cryptoKey;
  }
  return cryptoKey;
}, "importAndCache");
var normalizePublicKey = /* @__PURE__ */ __name((key, alg) => {
  if (isKeyObject(key)) {
    let jwk = key.export({ format: "jwk" });
    delete jwk.d;
    delete jwk.dp;
    delete jwk.dq;
    delete jwk.p;
    delete jwk.q;
    delete jwk.qi;
    if (jwk.k) {
      return exportKeyValue(jwk.k);
    }
    pubCache || (pubCache = /* @__PURE__ */ new WeakMap());
    return importAndCache(pubCache, key, jwk, alg);
  }
  if (isJWK(key)) {
    if (key.k)
      return decode(key.k);
    pubCache || (pubCache = /* @__PURE__ */ new WeakMap());
    const cryptoKey = importAndCache(pubCache, key, key, alg, true);
    return cryptoKey;
  }
  return key;
}, "normalizePublicKey");
var normalizePrivateKey = /* @__PURE__ */ __name((key, alg) => {
  if (isKeyObject(key)) {
    let jwk = key.export({ format: "jwk" });
    if (jwk.k) {
      return exportKeyValue(jwk.k);
    }
    privCache || (privCache = /* @__PURE__ */ new WeakMap());
    return importAndCache(privCache, key, jwk, alg);
  }
  if (isJWK(key)) {
    if (key.k)
      return decode(key.k);
    privCache || (privCache = /* @__PURE__ */ new WeakMap());
    const cryptoKey = importAndCache(privCache, key, key, alg, true);
    return cryptoKey;
  }
  return key;
}, "normalizePrivateKey");
var normalize_key_default = { normalizePublicKey, normalizePrivateKey };

// node_modules/jose/dist/browser/key/import.js
init_modules_watch_stub();
async function importJWK(jwk, alg) {
  if (!isObject(jwk)) {
    throw new TypeError("JWK must be an object");
  }
  alg || (alg = jwk.alg);
  switch (jwk.kty) {
    case "oct":
      if (typeof jwk.k !== "string" || !jwk.k) {
        throw new TypeError('missing "k" (Key Value) Parameter value');
      }
      return decode(jwk.k);
    case "RSA":
      if ("oth" in jwk && jwk.oth !== void 0) {
        throw new JOSENotSupported('RSA JWK "oth" (Other Primes Info) Parameter value is not supported');
      }
    case "EC":
    case "OKP":
      return jwk_to_key_default({ ...jwk, alg });
    default:
      throw new JOSENotSupported('Unsupported "kty" (Key Type) Parameter value');
  }
}
__name(importJWK, "importJWK");

// node_modules/jose/dist/browser/lib/check_key_type.js
init_modules_watch_stub();
var tag = /* @__PURE__ */ __name((key) => key?.[Symbol.toStringTag], "tag");
var jwkMatchesOp = /* @__PURE__ */ __name((alg, key, usage) => {
  if (key.use !== void 0 && key.use !== "sig") {
    throw new TypeError("Invalid key for this operation, when present its use must be sig");
  }
  if (key.key_ops !== void 0 && key.key_ops.includes?.(usage) !== true) {
    throw new TypeError(`Invalid key for this operation, when present its key_ops must include ${usage}`);
  }
  if (key.alg !== void 0 && key.alg !== alg) {
    throw new TypeError(`Invalid key for this operation, when present its alg must be ${alg}`);
  }
  return true;
}, "jwkMatchesOp");
var symmetricTypeCheck = /* @__PURE__ */ __name((alg, key, usage, allowJwk) => {
  if (key instanceof Uint8Array)
    return;
  if (allowJwk && isJWK(key)) {
    if (isSecretJWK(key) && jwkMatchesOp(alg, key, usage))
      return;
    throw new TypeError(`JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present`);
  }
  if (!is_key_like_default(key)) {
    throw new TypeError(withAlg(alg, key, ...types, "Uint8Array", allowJwk ? "JSON Web Key" : null));
  }
  if (key.type !== "secret") {
    throw new TypeError(`${tag(key)} instances for symmetric algorithms must be of type "secret"`);
  }
}, "symmetricTypeCheck");
var asymmetricTypeCheck = /* @__PURE__ */ __name((alg, key, usage, allowJwk) => {
  if (allowJwk && isJWK(key)) {
    switch (usage) {
      case "sign":
        if (isPrivateJWK(key) && jwkMatchesOp(alg, key, usage))
          return;
        throw new TypeError(`JSON Web Key for this operation be a private JWK`);
      case "verify":
        if (isPublicJWK(key) && jwkMatchesOp(alg, key, usage))
          return;
        throw new TypeError(`JSON Web Key for this operation be a public JWK`);
    }
  }
  if (!is_key_like_default(key)) {
    throw new TypeError(withAlg(alg, key, ...types, allowJwk ? "JSON Web Key" : null));
  }
  if (key.type === "secret") {
    throw new TypeError(`${tag(key)} instances for asymmetric algorithms must not be of type "secret"`);
  }
  if (usage === "sign" && key.type === "public") {
    throw new TypeError(`${tag(key)} instances for asymmetric algorithm signing must be of type "private"`);
  }
  if (usage === "decrypt" && key.type === "public") {
    throw new TypeError(`${tag(key)} instances for asymmetric algorithm decryption must be of type "private"`);
  }
  if (key.algorithm && usage === "verify" && key.type === "private") {
    throw new TypeError(`${tag(key)} instances for asymmetric algorithm verifying must be of type "public"`);
  }
  if (key.algorithm && usage === "encrypt" && key.type === "private") {
    throw new TypeError(`${tag(key)} instances for asymmetric algorithm encryption must be of type "public"`);
  }
}, "asymmetricTypeCheck");
function checkKeyType(allowJwk, alg, key, usage) {
  const symmetric = alg.startsWith("HS") || alg === "dir" || alg.startsWith("PBES2") || /^A\d{3}(?:GCM)?KW$/.test(alg);
  if (symmetric) {
    symmetricTypeCheck(alg, key, usage, allowJwk);
  } else {
    asymmetricTypeCheck(alg, key, usage, allowJwk);
  }
}
__name(checkKeyType, "checkKeyType");
var check_key_type_default = checkKeyType.bind(void 0, false);
var checkKeyTypeWithJwk = checkKeyType.bind(void 0, true);

// node_modules/jose/dist/browser/lib/validate_crit.js
init_modules_watch_stub();
function validateCrit(Err, recognizedDefault, recognizedOption, protectedHeader, joseHeader) {
  if (joseHeader.crit !== void 0 && protectedHeader?.crit === void 0) {
    throw new Err('"crit" (Critical) Header Parameter MUST be integrity protected');
  }
  if (!protectedHeader || protectedHeader.crit === void 0) {
    return /* @__PURE__ */ new Set();
  }
  if (!Array.isArray(protectedHeader.crit) || protectedHeader.crit.length === 0 || protectedHeader.crit.some((input) => typeof input !== "string" || input.length === 0)) {
    throw new Err('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
  }
  let recognized;
  if (recognizedOption !== void 0) {
    recognized = new Map([...Object.entries(recognizedOption), ...recognizedDefault.entries()]);
  } else {
    recognized = recognizedDefault;
  }
  for (const parameter of protectedHeader.crit) {
    if (!recognized.has(parameter)) {
      throw new JOSENotSupported(`Extension Header Parameter "${parameter}" is not recognized`);
    }
    if (joseHeader[parameter] === void 0) {
      throw new Err(`Extension Header Parameter "${parameter}" is missing`);
    }
    if (recognized.get(parameter) && protectedHeader[parameter] === void 0) {
      throw new Err(`Extension Header Parameter "${parameter}" MUST be integrity protected`);
    }
  }
  return new Set(protectedHeader.crit);
}
__name(validateCrit, "validateCrit");
var validate_crit_default = validateCrit;

// node_modules/jose/dist/browser/lib/validate_algorithms.js
init_modules_watch_stub();
var validateAlgorithms = /* @__PURE__ */ __name((option, algorithms) => {
  if (algorithms !== void 0 && (!Array.isArray(algorithms) || algorithms.some((s) => typeof s !== "string"))) {
    throw new TypeError(`"${option}" option must be an array of strings`);
  }
  if (!algorithms) {
    return void 0;
  }
  return new Set(algorithms);
}, "validateAlgorithms");
var validate_algorithms_default = validateAlgorithms;

// node_modules/jose/dist/browser/jws/compact/verify.js
init_modules_watch_stub();

// node_modules/jose/dist/browser/jws/flattened/verify.js
init_modules_watch_stub();

// node_modules/jose/dist/browser/runtime/verify.js
init_modules_watch_stub();

// node_modules/jose/dist/browser/runtime/subtle_dsa.js
init_modules_watch_stub();
function subtleDsa(alg, algorithm) {
  const hash = `SHA-${alg.slice(-3)}`;
  switch (alg) {
    case "HS256":
    case "HS384":
    case "HS512":
      return { hash, name: "HMAC" };
    case "PS256":
    case "PS384":
    case "PS512":
      return { hash, name: "RSA-PSS", saltLength: alg.slice(-3) >> 3 };
    case "RS256":
    case "RS384":
    case "RS512":
      return { hash, name: "RSASSA-PKCS1-v1_5" };
    case "ES256":
    case "ES384":
    case "ES512":
      return { hash, name: "ECDSA", namedCurve: algorithm.namedCurve };
    case "Ed25519":
      return { name: "Ed25519" };
    case "EdDSA":
      return { name: algorithm.name };
    default:
      throw new JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
  }
}
__name(subtleDsa, "subtleDsa");

// node_modules/jose/dist/browser/runtime/get_sign_verify_key.js
init_modules_watch_stub();
async function getCryptoKey(alg, key, usage) {
  if (usage === "sign") {
    key = await normalize_key_default.normalizePrivateKey(key, alg);
  }
  if (usage === "verify") {
    key = await normalize_key_default.normalizePublicKey(key, alg);
  }
  if (isCryptoKey(key)) {
    checkSigCryptoKey(key, alg, usage);
    return key;
  }
  if (key instanceof Uint8Array) {
    if (!alg.startsWith("HS")) {
      throw new TypeError(invalid_key_input_default(key, ...types));
    }
    return webcrypto_default.subtle.importKey("raw", key, { hash: `SHA-${alg.slice(-3)}`, name: "HMAC" }, false, [usage]);
  }
  throw new TypeError(invalid_key_input_default(key, ...types, "Uint8Array", "JSON Web Key"));
}
__name(getCryptoKey, "getCryptoKey");

// node_modules/jose/dist/browser/runtime/verify.js
var verify = /* @__PURE__ */ __name(async (alg, key, signature, data) => {
  const cryptoKey = await getCryptoKey(alg, key, "verify");
  check_key_length_default(alg, cryptoKey);
  const algorithm = subtleDsa(alg, cryptoKey.algorithm);
  try {
    return await webcrypto_default.subtle.verify(algorithm, cryptoKey, signature, data);
  } catch {
    return false;
  }
}, "verify");
var verify_default = verify;

// node_modules/jose/dist/browser/jws/flattened/verify.js
async function flattenedVerify(jws, key, options) {
  if (!isObject(jws)) {
    throw new JWSInvalid("Flattened JWS must be an object");
  }
  if (jws.protected === void 0 && jws.header === void 0) {
    throw new JWSInvalid('Flattened JWS must have either of the "protected" or "header" members');
  }
  if (jws.protected !== void 0 && typeof jws.protected !== "string") {
    throw new JWSInvalid("JWS Protected Header incorrect type");
  }
  if (jws.payload === void 0) {
    throw new JWSInvalid("JWS Payload missing");
  }
  if (typeof jws.signature !== "string") {
    throw new JWSInvalid("JWS Signature missing or incorrect type");
  }
  if (jws.header !== void 0 && !isObject(jws.header)) {
    throw new JWSInvalid("JWS Unprotected Header incorrect type");
  }
  let parsedProt = {};
  if (jws.protected) {
    try {
      const protectedHeader = decode(jws.protected);
      parsedProt = JSON.parse(decoder.decode(protectedHeader));
    } catch {
      throw new JWSInvalid("JWS Protected Header is invalid");
    }
  }
  if (!is_disjoint_default(parsedProt, jws.header)) {
    throw new JWSInvalid("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
  }
  const joseHeader = {
    ...parsedProt,
    ...jws.header
  };
  const extensions = validate_crit_default(JWSInvalid, /* @__PURE__ */ new Map([["b64", true]]), options?.crit, parsedProt, joseHeader);
  let b64 = true;
  if (extensions.has("b64")) {
    b64 = parsedProt.b64;
    if (typeof b64 !== "boolean") {
      throw new JWSInvalid('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
    }
  }
  const { alg } = joseHeader;
  if (typeof alg !== "string" || !alg) {
    throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
  }
  const algorithms = options && validate_algorithms_default("algorithms", options.algorithms);
  if (algorithms && !algorithms.has(alg)) {
    throw new JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter value not allowed');
  }
  if (b64) {
    if (typeof jws.payload !== "string") {
      throw new JWSInvalid("JWS Payload must be a string");
    }
  } else if (typeof jws.payload !== "string" && !(jws.payload instanceof Uint8Array)) {
    throw new JWSInvalid("JWS Payload must be a string or an Uint8Array instance");
  }
  let resolvedKey = false;
  if (typeof key === "function") {
    key = await key(parsedProt, jws);
    resolvedKey = true;
    checkKeyTypeWithJwk(alg, key, "verify");
    if (isJWK(key)) {
      key = await importJWK(key, alg);
    }
  } else {
    checkKeyTypeWithJwk(alg, key, "verify");
  }
  const data = concat(encoder.encode(jws.protected ?? ""), encoder.encode("."), typeof jws.payload === "string" ? encoder.encode(jws.payload) : jws.payload);
  let signature;
  try {
    signature = decode(jws.signature);
  } catch {
    throw new JWSInvalid("Failed to base64url decode the signature");
  }
  const verified = await verify_default(alg, key, signature, data);
  if (!verified) {
    throw new JWSSignatureVerificationFailed();
  }
  let payload;
  if (b64) {
    try {
      payload = decode(jws.payload);
    } catch {
      throw new JWSInvalid("Failed to base64url decode the payload");
    }
  } else if (typeof jws.payload === "string") {
    payload = encoder.encode(jws.payload);
  } else {
    payload = jws.payload;
  }
  const result = { payload };
  if (jws.protected !== void 0) {
    result.protectedHeader = parsedProt;
  }
  if (jws.header !== void 0) {
    result.unprotectedHeader = jws.header;
  }
  if (resolvedKey) {
    return { ...result, key };
  }
  return result;
}
__name(flattenedVerify, "flattenedVerify");

// node_modules/jose/dist/browser/jws/compact/verify.js
async function compactVerify(jws, key, options) {
  if (jws instanceof Uint8Array) {
    jws = decoder.decode(jws);
  }
  if (typeof jws !== "string") {
    throw new JWSInvalid("Compact JWS must be a string or Uint8Array");
  }
  const { 0: protectedHeader, 1: payload, 2: signature, length } = jws.split(".");
  if (length !== 3) {
    throw new JWSInvalid("Invalid Compact JWS");
  }
  const verified = await flattenedVerify({ payload, protected: protectedHeader, signature }, key, options);
  const result = { payload: verified.payload, protectedHeader: verified.protectedHeader };
  if (typeof key === "function") {
    return { ...result, key: verified.key };
  }
  return result;
}
__name(compactVerify, "compactVerify");

// node_modules/jose/dist/browser/jwt/verify.js
init_modules_watch_stub();

// node_modules/jose/dist/browser/lib/jwt_claims_set.js
init_modules_watch_stub();

// node_modules/jose/dist/browser/lib/epoch.js
init_modules_watch_stub();
var epoch_default = /* @__PURE__ */ __name((date) => Math.floor(date.getTime() / 1e3), "default");

// node_modules/jose/dist/browser/lib/secs.js
init_modules_watch_stub();
var minute = 60;
var hour = minute * 60;
var day = hour * 24;
var week = day * 7;
var year = day * 365.25;
var REGEX = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i;
var secs_default = /* @__PURE__ */ __name((str) => {
  const matched = REGEX.exec(str);
  if (!matched || matched[4] && matched[1]) {
    throw new TypeError("Invalid time period format");
  }
  const value = parseFloat(matched[2]);
  const unit = matched[3].toLowerCase();
  let numericDate;
  switch (unit) {
    case "sec":
    case "secs":
    case "second":
    case "seconds":
    case "s":
      numericDate = Math.round(value);
      break;
    case "minute":
    case "minutes":
    case "min":
    case "mins":
    case "m":
      numericDate = Math.round(value * minute);
      break;
    case "hour":
    case "hours":
    case "hr":
    case "hrs":
    case "h":
      numericDate = Math.round(value * hour);
      break;
    case "day":
    case "days":
    case "d":
      numericDate = Math.round(value * day);
      break;
    case "week":
    case "weeks":
    case "w":
      numericDate = Math.round(value * week);
      break;
    default:
      numericDate = Math.round(value * year);
      break;
  }
  if (matched[1] === "-" || matched[4] === "ago") {
    return -numericDate;
  }
  return numericDate;
}, "default");

// node_modules/jose/dist/browser/lib/jwt_claims_set.js
var normalizeTyp = /* @__PURE__ */ __name((value) => value.toLowerCase().replace(/^application\//, ""), "normalizeTyp");
var checkAudiencePresence = /* @__PURE__ */ __name((audPayload, audOption) => {
  if (typeof audPayload === "string") {
    return audOption.includes(audPayload);
  }
  if (Array.isArray(audPayload)) {
    return audOption.some(Set.prototype.has.bind(new Set(audPayload)));
  }
  return false;
}, "checkAudiencePresence");
var jwt_claims_set_default = /* @__PURE__ */ __name((protectedHeader, encodedPayload, options = {}) => {
  let payload;
  try {
    payload = JSON.parse(decoder.decode(encodedPayload));
  } catch {
  }
  if (!isObject(payload)) {
    throw new JWTInvalid("JWT Claims Set must be a top-level JSON object");
  }
  const { typ } = options;
  if (typ && (typeof protectedHeader.typ !== "string" || normalizeTyp(protectedHeader.typ) !== normalizeTyp(typ))) {
    throw new JWTClaimValidationFailed('unexpected "typ" JWT header value', payload, "typ", "check_failed");
  }
  const { requiredClaims = [], issuer, subject, audience, maxTokenAge } = options;
  const presenceCheck = [...requiredClaims];
  if (maxTokenAge !== void 0)
    presenceCheck.push("iat");
  if (audience !== void 0)
    presenceCheck.push("aud");
  if (subject !== void 0)
    presenceCheck.push("sub");
  if (issuer !== void 0)
    presenceCheck.push("iss");
  for (const claim of new Set(presenceCheck.reverse())) {
    if (!(claim in payload)) {
      throw new JWTClaimValidationFailed(`missing required "${claim}" claim`, payload, claim, "missing");
    }
  }
  if (issuer && !(Array.isArray(issuer) ? issuer : [issuer]).includes(payload.iss)) {
    throw new JWTClaimValidationFailed('unexpected "iss" claim value', payload, "iss", "check_failed");
  }
  if (subject && payload.sub !== subject) {
    throw new JWTClaimValidationFailed('unexpected "sub" claim value', payload, "sub", "check_failed");
  }
  if (audience && !checkAudiencePresence(payload.aud, typeof audience === "string" ? [audience] : audience)) {
    throw new JWTClaimValidationFailed('unexpected "aud" claim value', payload, "aud", "check_failed");
  }
  let tolerance;
  switch (typeof options.clockTolerance) {
    case "string":
      tolerance = secs_default(options.clockTolerance);
      break;
    case "number":
      tolerance = options.clockTolerance;
      break;
    case "undefined":
      tolerance = 0;
      break;
    default:
      throw new TypeError("Invalid clockTolerance option type");
  }
  const { currentDate } = options;
  const now = epoch_default(currentDate || /* @__PURE__ */ new Date());
  if ((payload.iat !== void 0 || maxTokenAge) && typeof payload.iat !== "number") {
    throw new JWTClaimValidationFailed('"iat" claim must be a number', payload, "iat", "invalid");
  }
  if (payload.nbf !== void 0) {
    if (typeof payload.nbf !== "number") {
      throw new JWTClaimValidationFailed('"nbf" claim must be a number', payload, "nbf", "invalid");
    }
    if (payload.nbf > now + tolerance) {
      throw new JWTClaimValidationFailed('"nbf" claim timestamp check failed', payload, "nbf", "check_failed");
    }
  }
  if (payload.exp !== void 0) {
    if (typeof payload.exp !== "number") {
      throw new JWTClaimValidationFailed('"exp" claim must be a number', payload, "exp", "invalid");
    }
    if (payload.exp <= now - tolerance) {
      throw new JWTExpired('"exp" claim timestamp check failed', payload, "exp", "check_failed");
    }
  }
  if (maxTokenAge) {
    const age = now - payload.iat;
    const max = typeof maxTokenAge === "number" ? maxTokenAge : secs_default(maxTokenAge);
    if (age - tolerance > max) {
      throw new JWTExpired('"iat" claim timestamp check failed (too far in the past)', payload, "iat", "check_failed");
    }
    if (age < 0 - tolerance) {
      throw new JWTClaimValidationFailed('"iat" claim timestamp check failed (it should be in the past)', payload, "iat", "check_failed");
    }
  }
  return payload;
}, "default");

// node_modules/jose/dist/browser/jwt/verify.js
async function jwtVerify(jwt, key, options) {
  const verified = await compactVerify(jwt, key, options);
  if (verified.protectedHeader.crit?.includes("b64") && verified.protectedHeader.b64 === false) {
    throw new JWTInvalid("JWTs MUST NOT use unencoded payload");
  }
  const payload = jwt_claims_set_default(verified.protectedHeader, verified.payload, options);
  const result = { payload, protectedHeader: verified.protectedHeader };
  if (typeof key === "function") {
    return { ...result, key: verified.key };
  }
  return result;
}
__name(jwtVerify, "jwtVerify");

// node_modules/jose/dist/browser/jws/compact/sign.js
init_modules_watch_stub();

// node_modules/jose/dist/browser/jws/flattened/sign.js
init_modules_watch_stub();

// node_modules/jose/dist/browser/runtime/sign.js
init_modules_watch_stub();
var sign = /* @__PURE__ */ __name(async (alg, key, data) => {
  const cryptoKey = await getCryptoKey(alg, key, "sign");
  check_key_length_default(alg, cryptoKey);
  const signature = await webcrypto_default.subtle.sign(subtleDsa(alg, cryptoKey.algorithm), cryptoKey, data);
  return new Uint8Array(signature);
}, "sign");
var sign_default = sign;

// node_modules/jose/dist/browser/jws/flattened/sign.js
var FlattenedSign = class {
  static {
    __name(this, "FlattenedSign");
  }
  constructor(payload) {
    if (!(payload instanceof Uint8Array)) {
      throw new TypeError("payload must be an instance of Uint8Array");
    }
    this._payload = payload;
  }
  setProtectedHeader(protectedHeader) {
    if (this._protectedHeader) {
      throw new TypeError("setProtectedHeader can only be called once");
    }
    this._protectedHeader = protectedHeader;
    return this;
  }
  setUnprotectedHeader(unprotectedHeader) {
    if (this._unprotectedHeader) {
      throw new TypeError("setUnprotectedHeader can only be called once");
    }
    this._unprotectedHeader = unprotectedHeader;
    return this;
  }
  async sign(key, options) {
    if (!this._protectedHeader && !this._unprotectedHeader) {
      throw new JWSInvalid("either setProtectedHeader or setUnprotectedHeader must be called before #sign()");
    }
    if (!is_disjoint_default(this._protectedHeader, this._unprotectedHeader)) {
      throw new JWSInvalid("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
    }
    const joseHeader = {
      ...this._protectedHeader,
      ...this._unprotectedHeader
    };
    const extensions = validate_crit_default(JWSInvalid, /* @__PURE__ */ new Map([["b64", true]]), options?.crit, this._protectedHeader, joseHeader);
    let b64 = true;
    if (extensions.has("b64")) {
      b64 = this._protectedHeader.b64;
      if (typeof b64 !== "boolean") {
        throw new JWSInvalid('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
      }
    }
    const { alg } = joseHeader;
    if (typeof alg !== "string" || !alg) {
      throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
    }
    checkKeyTypeWithJwk(alg, key, "sign");
    let payload = this._payload;
    if (b64) {
      payload = encoder.encode(encode(payload));
    }
    let protectedHeader;
    if (this._protectedHeader) {
      protectedHeader = encoder.encode(encode(JSON.stringify(this._protectedHeader)));
    } else {
      protectedHeader = encoder.encode("");
    }
    const data = concat(protectedHeader, encoder.encode("."), payload);
    const signature = await sign_default(alg, key, data);
    const jws = {
      signature: encode(signature),
      payload: ""
    };
    if (b64) {
      jws.payload = decoder.decode(payload);
    }
    if (this._unprotectedHeader) {
      jws.header = this._unprotectedHeader;
    }
    if (this._protectedHeader) {
      jws.protected = decoder.decode(protectedHeader);
    }
    return jws;
  }
};

// node_modules/jose/dist/browser/jws/compact/sign.js
var CompactSign = class {
  static {
    __name(this, "CompactSign");
  }
  constructor(payload) {
    this._flattened = new FlattenedSign(payload);
  }
  setProtectedHeader(protectedHeader) {
    this._flattened.setProtectedHeader(protectedHeader);
    return this;
  }
  async sign(key, options) {
    const jws = await this._flattened.sign(key, options);
    if (jws.payload === void 0) {
      throw new TypeError("use the flattened module for creating JWS with b64: false");
    }
    return `${jws.protected}.${jws.payload}.${jws.signature}`;
  }
};

// node_modules/jose/dist/browser/jwt/sign.js
init_modules_watch_stub();

// node_modules/jose/dist/browser/jwt/produce.js
init_modules_watch_stub();
function validateInput(label, input) {
  if (!Number.isFinite(input)) {
    throw new TypeError(`Invalid ${label} input`);
  }
  return input;
}
__name(validateInput, "validateInput");
var ProduceJWT = class {
  static {
    __name(this, "ProduceJWT");
  }
  constructor(payload = {}) {
    if (!isObject(payload)) {
      throw new TypeError("JWT Claims Set MUST be an object");
    }
    this._payload = payload;
  }
  setIssuer(issuer) {
    this._payload = { ...this._payload, iss: issuer };
    return this;
  }
  setSubject(subject) {
    this._payload = { ...this._payload, sub: subject };
    return this;
  }
  setAudience(audience) {
    this._payload = { ...this._payload, aud: audience };
    return this;
  }
  setJti(jwtId) {
    this._payload = { ...this._payload, jti: jwtId };
    return this;
  }
  setNotBefore(input) {
    if (typeof input === "number") {
      this._payload = { ...this._payload, nbf: validateInput("setNotBefore", input) };
    } else if (input instanceof Date) {
      this._payload = { ...this._payload, nbf: validateInput("setNotBefore", epoch_default(input)) };
    } else {
      this._payload = { ...this._payload, nbf: epoch_default(/* @__PURE__ */ new Date()) + secs_default(input) };
    }
    return this;
  }
  setExpirationTime(input) {
    if (typeof input === "number") {
      this._payload = { ...this._payload, exp: validateInput("setExpirationTime", input) };
    } else if (input instanceof Date) {
      this._payload = { ...this._payload, exp: validateInput("setExpirationTime", epoch_default(input)) };
    } else {
      this._payload = { ...this._payload, exp: epoch_default(/* @__PURE__ */ new Date()) + secs_default(input) };
    }
    return this;
  }
  setIssuedAt(input) {
    if (typeof input === "undefined") {
      this._payload = { ...this._payload, iat: epoch_default(/* @__PURE__ */ new Date()) };
    } else if (input instanceof Date) {
      this._payload = { ...this._payload, iat: validateInput("setIssuedAt", epoch_default(input)) };
    } else if (typeof input === "string") {
      this._payload = {
        ...this._payload,
        iat: validateInput("setIssuedAt", epoch_default(/* @__PURE__ */ new Date()) + secs_default(input))
      };
    } else {
      this._payload = { ...this._payload, iat: validateInput("setIssuedAt", input) };
    }
    return this;
  }
};

// node_modules/jose/dist/browser/jwt/sign.js
var SignJWT = class extends ProduceJWT {
  static {
    __name(this, "SignJWT");
  }
  setProtectedHeader(protectedHeader) {
    this._protectedHeader = protectedHeader;
    return this;
  }
  async sign(key, options) {
    const sig = new CompactSign(encoder.encode(JSON.stringify(this._payload)));
    sig.setProtectedHeader(this._protectedHeader);
    if (Array.isArray(this._protectedHeader?.crit) && this._protectedHeader.crit.includes("b64") && this._protectedHeader.b64 === false) {
      throw new JWTInvalid("JWTs MUST NOT use unencoded payload");
    }
    return sig.sign(key, options);
  }
};

// src/lib/jwt.ts
async function signAccessToken(payload, secret, issuer, expiresIn = "7d") {
  const key = new TextEncoder().encode(secret);
  const jwt = await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setSubject(payload.sub).setIssuer(issuer).setIssuedAt().setExpirationTime(expiresIn).sign(key);
  return jwt;
}
__name(signAccessToken, "signAccessToken");
async function verifyAccessToken(token, secret, issuer) {
  const key = new TextEncoder().encode(secret);
  const { payload } = await jwtVerify(token, key, { issuer });
  return payload;
}
__name(verifyAccessToken, "verifyAccessToken");

// src/repositories/user.repository.ts
init_modules_watch_stub();
var UserRepository = class {
  constructor(db) {
    this.db = db;
  }
  static {
    __name(this, "UserRepository");
  }
  async getById(id) {
    const row = await this.db.prepare(
      `SELECT id, email, hash_senha, nome, perfil, criado_em, atualizado_em, excluido_em
         FROM usuarios
         WHERE id = ?
         LIMIT 1`
    ).bind(id).first();
    return row ?? null;
  }
  async getByEmail(email) {
    const row = await this.db.prepare(
      `SELECT id, email, hash_senha, nome, perfil, criado_em, atualizado_em, excluido_em
         FROM usuarios
         WHERE lower(email) = lower(?)
           AND excluido_em IS NULL
         LIMIT 1`
    ).bind(email).first();
    return row ?? null;
  }
  async createUser(params) {
    const id = crypto.randomUUID();
    const perfil = params.perfil ?? "USUARIO";
    await this.db.prepare(
      `INSERT INTO usuarios (id, email, hash_senha, nome, perfil)
         VALUES (?, ?, ?, ?, ?)`
    ).bind(id, params.email, params.hash_senha, params.nome, perfil).run();
    const created = await this.getById(id);
    if (!created) throw new Error("Falha ao criar usu\xE1rio");
    return created;
  }
  async updateName(userId, nome) {
    await this.db.prepare(
      `UPDATE usuarios
         SET nome = ?, atualizado_em = datetime('now')
         WHERE id = ? AND excluido_em IS NULL`
    ).bind(nome, userId).run();
  }
  async updateEmail(userId, email) {
    await this.db.prepare(
      `UPDATE usuarios
         SET email = ?, atualizado_em = datetime('now')
         WHERE id = ? AND excluido_em IS NULL`
    ).bind(email, userId).run();
  }
  async updatePassword(userId, newHash) {
    await this.db.prepare(
      `UPDATE usuarios
         SET hash_senha = ?, atualizado_em = datetime('now')
         WHERE id = ? AND excluido_em IS NULL`
    ).bind(newHash, userId).run();
  }
  async softDelete(userId) {
    await this.db.prepare(
      `UPDATE usuarios
         SET excluido_em = datetime('now'), atualizado_em = datetime('now')
         WHERE id = ? AND excluido_em IS NULL`
    ).bind(userId).run();
  }
};

// src/middlewares/auth.middleware.ts
var authMiddleware = /* @__PURE__ */ __name(async (ctx, next) => {
  const auth = ctx.req.headers.get("authorization") || ctx.req.headers.get("Authorization") || "";
  const token = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : null;
  const secret = ctx.env.JWT_SECRET;
  if (token && secret) {
    try {
      const issuer = ctx.env.JWT_ISSUER || "financialsecretary";
      const payload = await verifyAccessToken(token, secret, issuer);
      const userId = typeof payload.sub === "string" ? payload.sub : null;
      if (userId) {
        const userRepo = new UserRepository(ctx.env.DB);
        const user = await userRepo.getById(userId);
        if (user && !user.excluido_em) {
          ctx.user = {
            id: user.id,
            perfil: user.perfil,
            email: user.email,
            nome: user.nome
          };
        }
      }
    } catch {
    }
  }
  return await next();
}, "authMiddleware");

// src/middlewares/require_auth.middleware.ts
init_modules_watch_stub();
var PUBLIC_PATHS = /* @__PURE__ */ new Set([
  "/",
  "/api/v1/health",
  "/api/v1/docs",
  "/api/v1/openapi.json",
  "/api/v1/plans",
  "/api/v1/terms/current",
  "/api/v1/auth/register",
  "/api/v1/auth/login",
  "/api/v1/auth/forgot-password",
  "/api/v1/auth/reset-password"
]);
var requireAuthMiddleware = /* @__PURE__ */ __name(async (ctx, next) => {
  const pathname = new URL(ctx.req.url).pathname;
  if (PUBLIC_PATHS.has(pathname)) {
    return await next();
  }
  if (pathname.startsWith("/api/v1/") && !ctx.user) {
    throw new UnauthorizedError();
  }
  return await next();
}, "requireAuthMiddleware");

// src/controllers/auth.controller.ts
init_modules_watch_stub();

// node_modules/zod/index.js
init_modules_watch_stub();

// node_modules/zod/v3/external.js
var external_exports = {};
__export(external_exports, {
  BRAND: () => BRAND,
  DIRTY: () => DIRTY,
  EMPTY_PATH: () => EMPTY_PATH,
  INVALID: () => INVALID,
  NEVER: () => NEVER,
  OK: () => OK,
  ParseStatus: () => ParseStatus,
  Schema: () => ZodType,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBigInt: () => ZodBigInt,
  ZodBoolean: () => ZodBoolean,
  ZodBranded: () => ZodBranded,
  ZodCatch: () => ZodCatch,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodEffects: () => ZodEffects,
  ZodEnum: () => ZodEnum,
  ZodError: () => ZodError,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodIntersection: () => ZodIntersection,
  ZodIssueCode: () => ZodIssueCode,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNever: () => ZodNever,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodParsedType: () => ZodParsedType,
  ZodPipeline: () => ZodPipeline,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRecord: () => ZodRecord,
  ZodSchema: () => ZodType,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodSymbol: () => ZodSymbol,
  ZodTransformer: () => ZodEffects,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  addIssueToContext: () => addIssueToContext,
  any: () => anyType,
  array: () => arrayType,
  bigint: () => bigIntType,
  boolean: () => booleanType,
  coerce: () => coerce,
  custom: () => custom,
  date: () => dateType,
  datetimeRegex: () => datetimeRegex,
  defaultErrorMap: () => en_default,
  discriminatedUnion: () => discriminatedUnionType,
  effect: () => effectsType,
  enum: () => enumType,
  function: () => functionType,
  getErrorMap: () => getErrorMap,
  getParsedType: () => getParsedType,
  instanceof: () => instanceOfType,
  intersection: () => intersectionType,
  isAborted: () => isAborted,
  isAsync: () => isAsync,
  isDirty: () => isDirty,
  isValid: () => isValid,
  late: () => late,
  lazy: () => lazyType,
  literal: () => literalType,
  makeIssue: () => makeIssue,
  map: () => mapType,
  nan: () => nanType,
  nativeEnum: () => nativeEnumType,
  never: () => neverType,
  null: () => nullType,
  nullable: () => nullableType,
  number: () => numberType,
  object: () => objectType,
  objectUtil: () => objectUtil,
  oboolean: () => oboolean,
  onumber: () => onumber,
  optional: () => optionalType,
  ostring: () => ostring,
  pipeline: () => pipelineType,
  preprocess: () => preprocessType,
  promise: () => promiseType,
  quotelessJson: () => quotelessJson,
  record: () => recordType,
  set: () => setType,
  setErrorMap: () => setErrorMap,
  strictObject: () => strictObjectType,
  string: () => stringType,
  symbol: () => symbolType,
  transformer: () => effectsType,
  tuple: () => tupleType,
  undefined: () => undefinedType,
  union: () => unionType,
  unknown: () => unknownType,
  util: () => util,
  void: () => voidType
});
init_modules_watch_stub();

// node_modules/zod/v3/errors.js
init_modules_watch_stub();

// node_modules/zod/v3/locales/en.js
init_modules_watch_stub();

// node_modules/zod/v3/ZodError.js
init_modules_watch_stub();

// node_modules/zod/v3/helpers/util.js
init_modules_watch_stub();
var util;
(function(util2) {
  util2.assertEqual = (_) => {
  };
  function assertIs(_arg) {
  }
  __name(assertIs, "assertIs");
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  __name(assertNever, "assertNever");
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  __name(joinValues, "joinValues");
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = /* @__PURE__ */ __name((data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
}, "getParsedType");

// node_modules/zod/v3/ZodError.js
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = /* @__PURE__ */ __name((obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
}, "quotelessJson");
var ZodError = class _ZodError extends Error {
  static {
    __name(this, "ZodError");
  }
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = /* @__PURE__ */ __name((error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    }, "processError");
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof _ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};

// node_modules/zod/v3/locales/en.js
var errorMap = /* @__PURE__ */ __name((issue, _ctx) => {
  let message2;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message2 = "Required";
      } else {
        message2 = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message2 = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message2 = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message2 = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message2 = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message2 = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message2 = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message2 = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message2 = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message2 = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message2 = `${message2} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message2 = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message2 = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message2 = `Invalid ${issue.validation}`;
      } else {
        message2 = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message2 = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message2 = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message2 = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "bigint")
        message2 = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message2 = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message2 = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message2 = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message2 = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message2 = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message2 = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message2 = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message2 = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message2 = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message2 = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message2 = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message2 = "Number must be finite";
      break;
    default:
      message2 = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message: message2 };
}, "errorMap");
var en_default = errorMap;

// node_modules/zod/v3/errors.js
var overrideErrorMap = en_default;
function setErrorMap(map) {
  overrideErrorMap = map;
}
__name(setErrorMap, "setErrorMap");
function getErrorMap() {
  return overrideErrorMap;
}
__name(getErrorMap, "getErrorMap");

// node_modules/zod/v3/helpers/parseUtil.js
init_modules_watch_stub();
var makeIssue = /* @__PURE__ */ __name((params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
}, "makeIssue");
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === en_default ? void 0 : en_default
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
__name(addIssueToContext, "addIssueToContext");
var ParseStatus = class _ParseStatus {
  static {
    __name(this, "ParseStatus");
  }
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return _ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = /* @__PURE__ */ __name((value) => ({ status: "dirty", value }), "DIRTY");
var OK = /* @__PURE__ */ __name((value) => ({ status: "valid", value }), "OK");
var isAborted = /* @__PURE__ */ __name((x) => x.status === "aborted", "isAborted");
var isDirty = /* @__PURE__ */ __name((x) => x.status === "dirty", "isDirty");
var isValid = /* @__PURE__ */ __name((x) => x.status === "valid", "isValid");
var isAsync = /* @__PURE__ */ __name((x) => typeof Promise !== "undefined" && x instanceof Promise, "isAsync");

// node_modules/zod/v3/types.js
init_modules_watch_stub();

// node_modules/zod/v3/helpers/errorUtil.js
init_modules_watch_stub();
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message2) => typeof message2 === "string" ? { message: message2 } : message2 || {};
  errorUtil2.toString = (message2) => typeof message2 === "string" ? message2 : message2?.message;
})(errorUtil || (errorUtil = {}));

// node_modules/zod/v3/types.js
var ParseInputLazyPath = class {
  static {
    __name(this, "ParseInputLazyPath");
  }
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
var handleResult = /* @__PURE__ */ __name((ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
}, "handleResult");
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = /* @__PURE__ */ __name((iss, ctx) => {
    const { message: message2 } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message2 ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message2 ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message2 ?? invalid_type_error ?? ctx.defaultError };
  }, "customMap");
  return { errorMap: customMap, description };
}
__name(processCreateParams, "processCreateParams");
var ZodType = class {
  static {
    __name(this, "ZodType");
  }
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    const ctx = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if (err?.message?.toLowerCase()?.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params?.errorMap,
        async: true
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message2) {
    const getIssueProperties = /* @__PURE__ */ __name((val) => {
      if (typeof message2 === "string" || typeof message2 === "undefined") {
        return { message: message2 };
      } else if (typeof message2 === "function") {
        return message2(val);
      } else {
        return message2;
      }
    }, "getIssueProperties");
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = /* @__PURE__ */ __name(() => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      }), "setError");
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: /* @__PURE__ */ __name((data) => this["~validate"](data), "validate")
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
__name(timeRegexSource, "timeRegexSource");
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
__name(timeRegex, "timeRegex");
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
__name(datetimeRegex, "datetimeRegex");
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
__name(isValidIP, "isValidIP");
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
__name(isValidJWT, "isValidJWT");
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
__name(isValidCidr, "isValidCidr");
var ZodString = class _ZodString extends ZodType {
  static {
    __name(this, "ZodString");
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message2) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message2)
    });
  }
  _addCheck(check) {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message2) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message2) });
  }
  url(message2) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message2) });
  }
  emoji(message2) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message2) });
  }
  uuid(message2) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message2) });
  }
  nanoid(message2) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message2) });
  }
  cuid(message2) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message2) });
  }
  cuid2(message2) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message2) });
  }
  ulid(message2) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message2) });
  }
  base64(message2) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message2) });
  }
  base64url(message2) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message2)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      offset: options?.offset ?? false,
      local: options?.local ?? false,
      ...errorUtil.errToObj(options?.message)
    });
  }
  date(message2) {
    return this._addCheck({ kind: "date", message: message2 });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      ...errorUtil.errToObj(options?.message)
    });
  }
  duration(message2) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message2) });
  }
  regex(regex, message2) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message2)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options?.position,
      ...errorUtil.errToObj(options?.message)
    });
  }
  startsWith(value, message2) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message2)
    });
  }
  endsWith(value, message2) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message2)
    });
  }
  min(minLength, message2) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message2)
    });
  }
  max(maxLength, message2) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message2)
    });
  }
  length(len, message2) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message2)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message2) {
    return this.min(1, errorUtil.errToObj(message2));
  }
  trim() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodString.create = (params) => {
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
__name(floatSafeRemainder, "floatSafeRemainder");
var ZodNumber = class _ZodNumber extends ZodType {
  static {
    __name(this, "ZodNumber");
  }
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message2) {
    return this.setLimit("min", value, true, errorUtil.toString(message2));
  }
  gt(value, message2) {
    return this.setLimit("min", value, false, errorUtil.toString(message2));
  }
  lte(value, message2) {
    return this.setLimit("max", value, true, errorUtil.toString(message2));
  }
  lt(value, message2) {
    return this.setLimit("max", value, false, errorUtil.toString(message2));
  }
  setLimit(kind, value, inclusive, message2) {
    return new _ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message2)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message2) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message2)
    });
  }
  positive(message2) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message2)
    });
  }
  negative(message2) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message2)
    });
  }
  nonpositive(message2) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message2)
    });
  }
  nonnegative(message2) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message2)
    });
  }
  multipleOf(value, message2) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message2)
    });
  }
  finite(message2) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message2)
    });
  }
  safe(message2) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message2)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message2)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class _ZodBigInt extends ZodType {
  static {
    __name(this, "ZodBigInt");
  }
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message2) {
    return this.setLimit("min", value, true, errorUtil.toString(message2));
  }
  gt(value, message2) {
    return this.setLimit("min", value, false, errorUtil.toString(message2));
  }
  lte(value, message2) {
    return this.setLimit("max", value, true, errorUtil.toString(message2));
  }
  lt(value, message2) {
    return this.setLimit("max", value, false, errorUtil.toString(message2));
  }
  setLimit(kind, value, inclusive, message2) {
    return new _ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message2)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message2) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message2)
    });
  }
  negative(message2) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message2)
    });
  }
  nonpositive(message2) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message2)
    });
  }
  nonnegative(message2) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message2)
    });
  }
  multipleOf(value, message2) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message2)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodBigInt.create = (params) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
var ZodBoolean = class extends ZodType {
  static {
    __name(this, "ZodBoolean");
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class _ZodDate extends ZodType {
  static {
    __name(this, "ZodDate");
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new _ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message2) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message2)
    });
  }
  max(maxDate, message2) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message2)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: params?.coerce || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType {
  static {
    __name(this, "ZodSymbol");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType {
  static {
    __name(this, "ZodUndefined");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull = class extends ZodType {
  static {
    __name(this, "ZodNull");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType {
  static {
    __name(this, "ZodAny");
  }
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown = class extends ZodType {
  static {
    __name(this, "ZodUnknown");
  }
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever = class extends ZodType {
  static {
    __name(this, "ZodNever");
  }
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType {
  static {
    __name(this, "ZodVoid");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray = class _ZodArray extends ZodType {
  static {
    __name(this, "ZodArray");
  }
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message2) {
    return new _ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message2) }
    });
  }
  max(maxLength, message2) {
    return new _ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message2) }
    });
  }
  length(len, message2) {
    return new _ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message2) }
    });
  }
  nonempty(message2) {
    return this.min(1, message2);
  }
};
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: /* @__PURE__ */ __name(() => newShape, "shape")
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
__name(deepPartialify, "deepPartialify");
var ZodObject = class _ZodObject extends ZodType {
  static {
    __name(this, "ZodObject");
  }
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") {
      } else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message2) {
    errorUtil.errToObj;
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message2 !== void 0 ? {
        errorMap: /* @__PURE__ */ __name((issue, ctx) => {
          const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: errorUtil.errToObj(message2).message ?? defaultError
            };
          return {
            message: defaultError
          };
        }, "errorMap")
      } : {}
    });
  }
  strip() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject({
      ...this._def,
      shape: /* @__PURE__ */ __name(() => ({
        ...this._def.shape(),
        ...augmentation
      }), "shape")
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: /* @__PURE__ */ __name(() => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }), "shape"),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new _ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: /* @__PURE__ */ __name(() => shape, "shape")
    });
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: /* @__PURE__ */ __name(() => shape, "shape")
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: /* @__PURE__ */ __name(() => newShape, "shape")
    });
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: /* @__PURE__ */ __name(() => newShape, "shape")
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: /* @__PURE__ */ __name(() => shape, "shape"),
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: /* @__PURE__ */ __name(() => shape, "shape"),
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
var ZodUnion = class extends ZodType {
  static {
    __name(this, "ZodUnion");
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    __name(handleResults, "handleResults");
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
ZodUnion.create = (types2, params) => {
  return new ZodUnion({
    options: types2,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = /* @__PURE__ */ __name((type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
}, "getDiscriminator");
var ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
  static {
    __name(this, "ZodDiscriminatedUnion");
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new _ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
__name(mergeValues, "mergeValues");
var ZodIntersection = class extends ZodType {
  static {
    __name(this, "ZodIntersection");
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = /* @__PURE__ */ __name((parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    }, "handleParsed");
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class _ZodTuple extends ZodType {
  static {
    __name(this, "ZodTuple");
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new _ZodTuple({
      ...this._def,
      rest
    });
  }
};
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
var ZodRecord = class _ZodRecord extends ZodType {
  static {
    __name(this, "ZodRecord");
  }
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new _ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new _ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
var ZodMap = class extends ZodType {
  static {
    __name(this, "ZodMap");
  }
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class _ZodSet extends ZodType {
  static {
    __name(this, "ZodSet");
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    __name(finalizeSet, "finalizeSet");
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message2) {
    return new _ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message2) }
    });
  }
  max(maxSize, message2) {
    return new _ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message2) }
    });
  }
  size(size, message2) {
    return this.min(size, message2).max(size, message2);
  }
  nonempty(message2) {
    return this.min(1, message2);
  }
};
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class _ZodFunction extends ZodType {
  static {
    __name(this, "ZodFunction");
  }
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    __name(makeArgsIssue, "makeArgsIssue");
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    __name(makeReturnsIssue, "makeReturnsIssue");
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new _ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new _ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new _ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
var ZodLazy = class extends ZodType {
  static {
    __name(this, "ZodLazy");
  }
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral = class extends ZodType {
  static {
    __name(this, "ZodLiteral");
  }
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
__name(createZodEnum, "createZodEnum");
var ZodEnum = class _ZodEnum extends ZodType {
  static {
    __name(this, "ZodEnum");
  }
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return _ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
};
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  static {
    __name(this, "ZodNativeEnum");
  }
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType {
  static {
    __name(this, "ZodPromise");
  }
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType {
  static {
    __name(this, "ZodEffects");
  }
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: /* @__PURE__ */ __name((arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      }, "addIssue"),
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = /* @__PURE__ */ __name((acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      }, "executeRefinement");
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return INVALID;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return INVALID;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result
          }));
        });
      }
    }
    util.assertNever(effect);
  }
};
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
var ZodOptional = class extends ZodType {
  static {
    __name(this, "ZodOptional");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable = class extends ZodType {
  static {
    __name(this, "ZodNullable");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault = class extends ZodType {
  static {
    __name(this, "ZodDefault");
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch = class extends ZodType {
  static {
    __name(this, "ZodCatch");
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType {
  static {
    __name(this, "ZodNaN");
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
};
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  static {
    __name(this, "ZodBranded");
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline = class _ZodPipeline extends ZodType {
  static {
    __name(this, "ZodPipeline");
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = /* @__PURE__ */ __name(async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      }, "handleAsync");
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new _ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
var ZodReadonly = class extends ZodType {
  static {
    __name(this, "ZodReadonly");
  }
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = /* @__PURE__ */ __name((data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    }, "freeze");
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
__name(cleanParams, "cleanParams");
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
__name(custom, "custom");
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = /* @__PURE__ */ __name((cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params), "instanceOfType");
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = /* @__PURE__ */ __name(() => stringType().optional(), "ostring");
var onumber = /* @__PURE__ */ __name(() => numberType().optional(), "onumber");
var oboolean = /* @__PURE__ */ __name(() => booleanType().optional(), "oboolean");
var coerce = {
  string: /* @__PURE__ */ __name(((arg) => ZodString.create({ ...arg, coerce: true })), "string"),
  number: /* @__PURE__ */ __name(((arg) => ZodNumber.create({ ...arg, coerce: true })), "number"),
  boolean: /* @__PURE__ */ __name(((arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  })), "boolean"),
  bigint: /* @__PURE__ */ __name(((arg) => ZodBigInt.create({ ...arg, coerce: true })), "bigint"),
  date: /* @__PURE__ */ __name(((arg) => ZodDate.create({ ...arg, coerce: true })), "date")
};
var NEVER = INVALID;

// src/repositories/plan.repository.ts
init_modules_watch_stub();
var PlanRepository = class {
  constructor(db) {
    this.db = db;
  }
  static {
    __name(this, "PlanRepository");
  }
  async listActivePlans() {
    const rs = await this.db.prepare(`SELECT * FROM planos WHERE ativo = 1 ORDER BY preco_mensal ASC`).all();
    return rs.results;
  }
  async getPlanByName(nome) {
    return await this.db.prepare(`SELECT * FROM planos WHERE nome = ? AND ativo = 1 LIMIT 1`).bind(nome).first();
  }
  async getActiveSubscriptionForUser(userId) {
    const sub = await this.db.prepare(
      `
        SELECT *
          FROM assinaturas_usuario
         WHERE usuario_id = ?
           AND status IN ('ATIVA','INADIMPLENTE')
           AND (fim_em IS NULL OR datetime(fim_em) > datetime('now'))
         ORDER BY datetime(criado_em) DESC
         LIMIT 1
        `
    ).bind(userId).first();
    return sub ?? null;
  }
  async getCurrentPlanForUser(userId) {
    const rs = await this.db.prepare(
      `
        SELECT p.*
          FROM assinaturas_usuario s
          JOIN planos p ON p.id = s.plano_id
         WHERE s.usuario_id = ?
           AND s.status IN ('ATIVA','INADIMPLENTE')
           AND (s.fim_em IS NULL OR datetime(s.fim_em) > datetime('now'))
           AND p.ativo = 1
         ORDER BY datetime(s.criado_em) DESC
         LIMIT 1
        `
    ).bind(userId).first();
    return rs ?? null;
  }
  async assignUserPlan(userId, planId) {
    const id = crypto.randomUUID();
    await this.db.prepare(
      `
        INSERT INTO assinaturas_usuario (id, usuario_id, plano_id, status)
        VALUES (?, ?, ?, 'ATIVA')
        `
    ).bind(id, userId, planId).run();
    return id;
  }
  async ensureDefaultPlanForUser(userId, defaultPlanName = "FREE") {
    const current = await this.getCurrentPlanForUser(userId);
    if (current) return current;
    const plan = await this.getPlanByName(defaultPlanName);
    if (!plan) return null;
    await this.assignUserPlan(userId, plan.id);
    return plan;
  }
  async getUserPlan(userId) {
    return this.getCurrentPlanForUser(userId);
  }
};

// src/repositories/preferences.repository.ts
init_modules_watch_stub();
var PreferencesRepository = class {
  constructor(db) {
    this.db = db;
  }
  static {
    __name(this, "PreferencesRepository");
  }
  async getByUserId(userId) {
    const p = await this.db.prepare(`SELECT * FROM preferencias_usuario WHERE usuario_id = ? LIMIT 1`).bind(userId).first();
    return p ?? null;
  }
  async ensureDefaults(userId) {
    await this.db.prepare(`INSERT OR IGNORE INTO preferencias_usuario (id, usuario_id) VALUES (?, ?)`).bind(crypto.randomUUID(), userId).run();
  }
  async upsert(userId, changes) {
    await this.ensureDefaults(userId);
    await this.update(userId, changes);
  }
  async update(userId, changes) {
    const fields = [];
    const binds = [];
    if (typeof changes.fuso_horario === "string") {
      fields.push("fuso_horario = ?");
      binds.push(changes.fuso_horario);
    }
    if (typeof changes.resumo_diario_ativo === "number") {
      fields.push("resumo_diario_ativo = ?");
      binds.push(changes.resumo_diario_ativo);
    }
    if (typeof changes.horario_resumo === "string") {
      fields.push("horario_resumo = ?");
      binds.push(changes.horario_resumo);
    }
    if (typeof changes.canal_padrao_noticias === "string") {
      fields.push("canal_padrao_noticias = ?");
      binds.push(changes.canal_padrao_noticias);
    }
    if (typeof changes.alerta_aviso_push_obrigatorio === "number") {
      fields.push("alerta_aviso_push_obrigatorio = ?");
      binds.push(changes.alerta_aviso_push_obrigatorio);
    }
    if (fields.length === 0) return;
    await this.db.prepare(
      `UPDATE preferencias_usuario SET ${fields.join(", ")}, atualizado_em = datetime('now') WHERE usuario_id = ?`
    ).bind(...binds, userId).run();
  }
  async listDailyDigestUsers() {
    const rows = await this.db.prepare(`
        SELECT u.id as user_id, u.email as email, p.fuso_horario as fuso_horario, p.horario_resumo as horario_resumo, p.canal_padrao_noticias as canal_padrao_noticias
        FROM usuarios u
        JOIN preferencias_usuario p ON p.usuario_id = u.id
        WHERE u.excluido_em IS NULL AND p.resumo_diario_ativo = 1
      `).all();
    return rows.results ?? [];
  }
};

// src/repositories/terms.repository.ts
init_modules_watch_stub();
var TermsRepository = class {
  constructor(db) {
    this.db = db;
  }
  static {
    __name(this, "TermsRepository");
  }
  async getLatestAcceptanceByUser(userId) {
    return await this.db.prepare(
      `
        SELECT * FROM aceites_termos
         WHERE usuario_id = ?
         ORDER BY datetime(criado_em) DESC
         LIMIT 1
        `
    ).bind(userId).first();
  }
  async recordAcceptance(userId, version, meta) {
    const id = crypto.randomUUID();
    await this.db.prepare(
      `
        INSERT INTO aceites_termos (id, usuario_id, versao_termos, aceito, aceito_em, ip, user_agent, observacoes)
        VALUES (?, ?, ?, 1, datetime('now'), ?, ?, ?)
        `
    ).bind(id, userId, version, meta?.ip || null, meta?.userAgent || null, meta?.observacoes || null).run();
    return id;
  }
};

// src/repositories/password_reset.repository.ts
init_modules_watch_stub();
var PasswordResetRepository = class {
  constructor(db) {
    this.db = db;
  }
  static {
    __name(this, "PasswordResetRepository");
  }
  async create(userId, opts) {
    const id = crypto.randomUUID();
    const token = crypto.randomUUID();
    const expiresMinutes = opts?.expiresMinutes ?? 60;
    const expira_em = new Date(Date.now() + expiresMinutes * 6e4).toISOString();
    await this.db.prepare(`INSERT INTO tokens_reset_senha (id, usuario_id, token, expira_em) VALUES (?1, ?2, ?3, ?4)`).bind(id, userId, token, expira_em).run();
    return { id, token, expira_em };
  }
  async getValidByToken(token) {
    const row = await this.db.prepare(`
        SELECT id, usuario_id, token, expira_em, usado_em, criado_em
          FROM tokens_reset_senha
         WHERE token = ?1
           AND usado_em IS NULL
           AND expira_em > datetime('now')
         LIMIT 1
      `).bind(token).first();
    return row ?? null;
  }
  async markUsed(id) {
    await this.db.prepare(`UPDATE tokens_reset_senha SET usado_em = datetime('now') WHERE id = ?1`).bind(id).run();
  }
  async revokeAllForUser(userId) {
    await this.db.prepare(`UPDATE tokens_reset_senha SET usado_em = datetime('now') WHERE usuario_id = ?1 AND usado_em IS NULL`).bind(userId).run();
  }
};

// src/services/auth.service.ts
init_modules_watch_stub();

// src/lib/password.ts
init_modules_watch_stub();
function b64encode(buf) {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}
__name(b64encode, "b64encode");
function b64decode(str) {
  const bin = atob(str);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}
__name(b64decode, "b64decode");
async function hashPassword(password, iterations = 15e4) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMat = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    keyMat,
    256
  );
  const saltB64 = b64encode(salt.buffer);
  const hashB64 = b64encode(bits);
  return `pbkdf2$${iterations}$${saltB64}$${hashB64}`;
}
__name(hashPassword, "hashPassword");
async function verifyPassword(password, stored) {
  const parts = stored.split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
  const iterations = Number(parts[1]);
  const salt = new Uint8Array(b64decode(parts[2]));
  const expected = parts[3];
  const keyMat = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    keyMat,
    256
  );
  const actual = b64encode(bits);
  return timingSafeEqual(expected, actual);
}
__name(verifyPassword, "verifyPassword");
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let res = 0;
  for (let i = 0; i < a.length; i++) res |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return res === 0;
}
__name(timingSafeEqual, "timingSafeEqual");

// src/services/auth.service.ts
var AuthService = class {
  constructor(env, users, prefs, terms, plans, resetRepo, email) {
    this.env = env;
    this.users = users;
    this.prefs = prefs;
    this.terms = terms;
    this.plans = plans;
    this.resetRepo = resetRepo;
    this.email = email;
  }
  static {
    __name(this, "AuthService");
  }
  async issueToken(user) {
    const secret = this.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET not configured");
    return signAccessToken(
      { sub: user.id, perfil: user.perfil, email: user.email, nome: user.nome },
      secret,
      this.env.JWT_ISSUER || "financial-secretary"
    );
  }
  async register(params) {
    const email = params.email.trim().toLowerCase();
    const existing = await this.users.getByEmail(email);
    if (existing && !existing.excluido_em) throw new ValidationError("Email j\xE1 cadastrado");
    const hash = await hashPassword(params.senha);
    const userId = crypto.randomUUID();
    await this.users.create({ id: userId, email, hash_senha: hash, nome: params.nome });
    await this.prefs.ensureForUser(userId);
    await this.plans.ensureDefaultPlanForUser(userId);
    if (params.termos_versao && params.termos_aceito) {
      await this.terms.setAccepted({
        usuario_id: userId,
        versao_termos: params.termos_versao,
        ip: params.ip ?? null,
        user_agent: params.user_agent ?? null
      });
    }
    const user = await this.users.getById(userId);
    if (!user) throw new Error("Falha ao criar usu\xE1rio");
    const token = await this.issueToken(user);
    const { hash_senha, ...safeUser } = user;
    return { user: safeUser, token };
  }
  async login(params) {
    const email = params.email.trim().toLowerCase();
    const user = await this.users.getByEmail(email);
    if (!user || user.excluido_em) throw new ValidationError("Credenciais inv\xE1lidas");
    const ok = await verifyPassword(params.senha, user.hash_senha);
    if (!ok) throw new ValidationError("Credenciais inv\xE1lidas");
    const token = await this.issueToken(user);
    const { hash_senha, ...safeUser } = user;
    return { user: safeUser, token };
  }
  async forgotPassword(params) {
    const email = params.email.trim().toLowerCase();
    const user = await this.users.getByEmail(email);
    if (!user || user.excluido_em) return { ok: true };
    await this.resetRepo.revokeAllForUser(user.id);
    const created = await this.resetRepo.create(user.id, { expiresMinutes: 60 });
    const resetUrl = `${params.resetUrlBase.replace(/\/$/, "")}?token=${encodeURIComponent(created.token)}`;
    const hasEmail = !!this.env.RESEND_API_KEY && !!this.env.EMAIL_FROM;
    if (hasEmail) {
      await this.email.sendPasswordReset({
        to: user.email,
        userName: user.nome,
        resetUrl
      });
      return { ok: true };
    }
    if ((this.env.ENV || "dev") !== "production") return { ok: true, token_dev: created.token };
    return { ok: true };
  }
  async resetPassword(params) {
    const row = await this.resetRepo.getValidByToken(params.token);
    if (!row) throw new ValidationError("Token inv\xE1lido ou expirado");
    const hash = await hashPassword(params.newPassword);
    await this.users.updatePassword(row.usuario_id, hash);
    await this.resetRepo.markUsed(row.id);
    return { ok: true };
  }
};

// src/services/email.service.ts
init_modules_watch_stub();
var EmailService = class {
  constructor(env) {
    this.env = env;
  }
  static {
    __name(this, "EmailService");
  }
  async sendPasswordResetEmail(params) {
    const subject = "Redefini\xE7\xE3o de senha - InvestAlerta";
    const body = `Ol\xE1${params.nome ? " " + params.nome : ""}!

Use o link abaixo para redefinir sua senha:
${params.resetLink}

Se voc\xEA n\xE3o solicitou, ignore este email.`;
    await this.sendRawEmail({ to: params.to, subject, body });
  }
  async sendDailyDigestEmail(params) {
    await this.sendRawEmail({ to: params.to, subject: params.subject, body: params.body });
  }
  async sendRawEmail(params) {
    if (!this.env.RESEND_API_KEY) {
      console.log("[EmailService] RESEND_API_KEY ausente. Email n\xE3o enviado.", {
        to: params.to,
        subject: params.subject
      });
      return;
    }
    if (!this.env.EMAIL_FROM) {
      console.log("[EmailService] EMAIL_FROM ausente. Email n\xE3o enviado.", {
        to: params.to,
        subject: params.subject
      });
      return;
    }
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: this.env.EMAIL_FROM,
        to: params.to,
        subject: params.subject,
        text: params.body
      })
    });
    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      console.log("[EmailService] Falha ao enviar email.", { status: resp.status, text });
    }
  }
  async sendNotificationEmail(params) {
    if (!this.env.RESEND_API_KEY || !this.env.EMAIL_FROM) {
      return { skipped: true };
    }
    const payload = {
      from: this.env.EMAIL_FROM,
      to: params.to,
      subject: params.subject,
      html: params.html ?? (params.text ? `<pre style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; white-space: pre-wrap;">${params.text}</pre>` : void 0),
      text: params.text ?? void 0
    };
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    if (!r.ok) {
      const t = await r.text();
      throw new Error(`resend_error: ${r.status} ${t}`);
    }
    const data = await r.json();
    return { id: data.id ?? null };
  }
};

// src/controllers/_helpers.ts
init_modules_watch_stub();
function requireUser(ctx) {
  if (!ctx.user) throw new AppError(401, "N\xE3o autenticado.", "N\xE3o autenticado");
  return ctx.user;
}
__name(requireUser, "requireUser");
function getClientIp(req) {
  return req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for") || null;
}
__name(getClientIp, "getClientIp");
function getUserAgent(req) {
  return req.headers.get("user-agent") || null;
}
__name(getUserAgent, "getUserAgent");

// src/controllers/auth.controller.ts
var registerSchema = external_exports.object({
  email: external_exports.string().email(),
  senha: external_exports.string().min(6),
  nome: external_exports.string().min(1),
  aceitou_termos: external_exports.boolean()
});
var loginSchema = external_exports.object({
  email: external_exports.string().email(),
  senha: external_exports.string().min(1)
});
var forgotSchema = external_exports.object({
  email: external_exports.string().email()
});
var resetSchema = external_exports.object({
  token: external_exports.string().min(10),
  nova_senha: external_exports.string().min(6)
});
function buildAuthService(ctx) {
  const userRepo = new UserRepository(ctx.env.DB);
  const planRepo = new PlanRepository(ctx.env.DB);
  const prefsRepo = new PreferencesRepository(ctx.env.DB);
  const termsRepo = new TermsRepository(ctx.env.DB);
  const resetRepo = new PasswordResetRepository(ctx.env.DB);
  const emailService = new EmailService(ctx.env);
  return new AuthService(ctx.env, userRepo, prefsRepo, termsRepo, planRepo, resetRepo, emailService);
}
__name(buildAuthService, "buildAuthService");
function registerAuthController(router) {
  router.post("/api/v1/auth/register", async (ctx) => {
    const body = await parseJson(ctx.req, registerSchema);
    const service = buildAuthService(ctx);
    const { user, token } = await service.register({
      email: body.email,
      senha: body.senha,
      nome: body.nome,
      termos_versao: ctx.env.TERMS_VERSION || "v1",
      termos_aceito: body.aceitou_termos,
      ip: getClientIp(ctx.req),
      user_agent: getUserAgent(ctx.req)
    });
    return jsonResponse({ user, token }, { status: 200 });
  });
  router.post("/api/v1/auth/login", async (ctx) => {
    const body = await parseJson(ctx.req, loginSchema);
    const service = buildAuthService(ctx);
    const { user, token } = await service.login({ email: body.email, senha: body.senha });
    return jsonResponse({ user, token }, { status: 200 });
  });
  router.post("/api/v1/auth/forgot-password", async (ctx) => {
    const body = await parseJson(ctx.req, forgotSchema);
    const service = buildAuthService(ctx);
    const resetUrlBase = `${(ctx.env.APP_BASE_URL || new URL(ctx.req.url).origin).replace(/\/$/, "")}/reset-password`;
    const result = await service.forgotPassword({ email: body.email, resetUrlBase });
    return jsonResponse(result, { status: 200 });
  });
  router.post("/api/v1/auth/reset-password", async (ctx) => {
    const body = await parseJson(ctx.req, resetSchema);
    const service = buildAuthService(ctx);
    const result = await service.resetPassword({ token: body.token, newPassword: body.nova_senha });
    return jsonResponse(result, { status: 200 });
  });
}
__name(registerAuthController, "registerAuthController");

// src/controllers/account.controller.ts
init_modules_watch_stub();
var updateMeSchema = external_exports.object({
  nome: external_exports.string().min(1).optional(),
  email: external_exports.string().email().optional()
});
function registerAccountController(router) {
  router.get("/api/v1/me", async (ctx) => {
    const user = requireUser(ctx);
    const userRepo = new UserRepository(ctx.env.DB);
    const planRepo = new PlanRepository(ctx.env.DB);
    const prefsRepo = new PreferencesRepository(ctx.env.DB);
    const termsRepo = new TermsRepository(ctx.env.DB);
    const row = await userRepo.getById(user.id);
    if (!row || row.excluido_em) return jsonResponse({ error: { code: "not_found", message: "Usu\xE1rio n\xE3o encontrado." } }, { status: 404 });
    const plan = await planRepo.getUserPlan(user.id);
    const prefs = await prefsRepo.getByUserId(user.id);
    const terms = await termsRepo.getLatestAcceptanceByUser(user.id);
    return jsonResponse(
      {
        user: { id: row.id, email: row.email, nome: row.nome, perfil: row.perfil, criado_em: row.criado_em },
        plano: plan,
        preferencias: prefs,
        termos: terms
      },
      { status: 200 }
    );
  });
  router.put("/api/v1/me", async (ctx) => {
    const user = requireUser(ctx);
    const body = await parseJson(ctx.req, updateMeSchema);
    const userRepo = new UserRepository(ctx.env.DB);
    const current = await userRepo.getById(user.id);
    if (!current || current.excluido_em) return jsonResponse({ error: { code: "not_found", message: "Usu\xE1rio n\xE3o encontrado." } }, { status: 404 });
    if (body.email && body.email !== current.email) {
      await userRepo.updateEmail(user.id, body.email);
    }
    if (body.nome && body.nome !== current.nome) {
      await userRepo.updateName(user.id, body.nome);
    }
    const updated = await userRepo.getById(user.id);
    return jsonResponse({ user: { id: updated.id, email: updated.email, nome: updated.nome, perfil: updated.perfil } }, { status: 200 });
  });
  router.delete("/api/v1/me", async (ctx) => {
    const user = requireUser(ctx);
    const userRepo = new UserRepository(ctx.env.DB);
    await userRepo.softDelete(user.id);
    return jsonResponse({ ok: true }, { status: 200 });
  });
}
__name(registerAccountController, "registerAccountController");

// src/controllers/assets.controller.ts
init_modules_watch_stub();

// src/repositories/asset.repository.ts
init_modules_watch_stub();
var AssetRepository = class {
  constructor(env) {
    this.env = env;
  }
  static {
    __name(this, "AssetRepository");
  }
  // Aliases para manter serviços/controllers simples
  async searchByTickerOrName(query, limit = 25) {
    return this.search(query, limit);
  }
  async getLatestQuoteByAssetId(assetId) {
    return this.getLatestQuote(assetId);
  }
  async updateNameShort(assetId, nameShort) {
    await this.env.DB.prepare(
      `UPDATE ativos
            SET nome_curto = ?, atualizado_em = datetime('now')
          WHERE id = ?`
    ).bind(nameShort, assetId).run();
  }
  async createAsset(asset) {
    return this.upsertAsset({
      id: asset.id,
      ticker: asset.ticker,
      nome_curto: asset.nome_curto ?? null,
      tipo: asset.tipo,
      bolsa: asset.bolsa ?? null
    });
  }
  async search(query, limit = 20) {
    const q = `%${query.toUpperCase()}%`;
    const res = await this.env.DB.prepare(
      `SELECT * FROM ativos
         WHERE ativo = 1 AND (UPPER(ticker) LIKE ? OR UPPER(COALESCE(nome_curto,'')) LIKE ?)
         ORDER BY ticker
         LIMIT ?`
    ).bind(q, q, limit).all();
    return res.results;
  }
  async getByTicker(ticker) {
    const a = await this.env.DB.prepare(`SELECT * FROM ativos WHERE UPPER(ticker) = UPPER(?) AND ativo = 1 LIMIT 1`).bind(ticker).first();
    return a ?? null;
  }
  async getById(id) {
    const a = await this.env.DB.prepare(`SELECT * FROM ativos WHERE id = ? AND ativo = 1 LIMIT 1`).bind(id).first();
    return a ?? null;
  }
  async upsertAsset(asset) {
    const id = asset.id ?? crypto.randomUUID();
    await this.env.DB.prepare(
      `INSERT INTO ativos (id, ticker, nome_curto, tipo, bolsa, ativo)
         VALUES (?, ?, ?, ?, ?, 1)
         ON CONFLICT(ticker) DO UPDATE SET
           nome_curto = COALESCE(excluded.nome_curto, ativos.nome_curto),
           tipo = excluded.tipo,
           bolsa = COALESCE(excluded.bolsa, ativos.bolsa),
           ativo = 1,
           atualizado_em = datetime('now')`
    ).bind(id, asset.ticker.toUpperCase(), asset.nome_curto ?? null, asset.tipo, asset.bolsa ?? null).run();
    const row = await this.getByTicker(asset.ticker);
    if (!row) throw new Error("Failed to upsert asset");
    return row;
  }
  async insertQuote(quote) {
    await this.env.DB.prepare(`INSERT INTO cotacoes (id, ativo_id, preco, cotado_em, fonte) VALUES (?, ?, ?, ?, ?)`).bind(quote.id ?? crypto.randomUUID(), quote.ativo_id, quote.preco, quote.cotado_em, quote.fonte ?? null).run();
  }
  async getLatestQuote(assetId) {
    const q = await this.env.DB.prepare(
      `SELECT * FROM cotacoes
         WHERE ativo_id = ?
         ORDER BY datetime(buscado_em) DESC
         LIMIT 1`
    ).bind(assetId).first();
    return q ?? null;
  }
  async getLatestQuotes(assetIds) {
    if (assetIds.length === 0) return {};
    const placeholders = assetIds.map(() => "?").join(",");
    const sql = `SELECT c.*
       FROM cotacoes c
       JOIN (
         SELECT ativo_id, MAX(datetime(buscado_em)) AS max_buscado
         FROM cotacoes
         WHERE ativo_id IN (${placeholders})
         GROUP BY ativo_id
       ) t ON t.ativo_id = c.ativo_id AND datetime(c.buscado_em) = t.max_buscado`;
    const res = await this.env.DB.prepare(sql).bind(...assetIds).all();
    const map = {};
    for (const row of res.results) map[row.ativo_id] = row;
    return map;
  }
};

// src/repositories/news.repository.ts
init_modules_watch_stub();
var NewsRepository = class {
  constructor(db) {
    this.db = db;
  }
  static {
    __name(this, "NewsRepository");
  }
  async upsertNews(news) {
    const id = crypto.randomUUID();
    await this.db.prepare(
      `
        INSERT INTO noticias (id, url, fonte, titulo, trecho, publicado_em, hash_dedupe)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(url) DO UPDATE SET
          fonte = COALESCE(excluded.fonte, noticias.fonte),
          titulo = excluded.titulo,
          trecho = COALESCE(excluded.trecho, noticias.trecho),
          publicado_em = COALESCE(excluded.publicado_em, noticias.publicado_em),
          hash_dedupe = COALESCE(excluded.hash_dedupe, noticias.hash_dedupe)
        `
    ).bind(id, news.url, news.fonte ?? null, news.titulo, news.trecho ?? null, news.publicado_em ?? null, news.hash_dedupe).run();
    const row = await this.db.prepare(`SELECT * FROM noticias WHERE url = ? LIMIT 1`).bind(news.url).first();
    if (!row) throw new Error("Failed to upsert news");
    return row;
  }
  async linkNewsToAsset(noticiaId, assetId) {
    await this.db.prepare(`INSERT OR IGNORE INTO noticias_ativos (id, noticia_id, ativo_id) VALUES (?, ?, ?)`).bind(crypto.randomUUID(), noticiaId, assetId).run();
  }
  async listNewsForAsset(assetId, limit = 20) {
    const rs = await this.db.prepare(
      `
        SELECT n.*
          FROM noticias_ativos na
          JOIN noticias n ON n.id = na.noticia_id
         WHERE na.ativo_id = ?
         ORDER BY datetime(COALESCE(n.publicado_em, n.buscado_em)) DESC
         LIMIT ?
        `
    ).bind(assetId, limit).all();
    return rs.results;
  }
  async listNewsForUserWatchlist(userId, sinceHours, limit = 50) {
    const rs = await this.db.prepare(
      `
        SELECT DISTINCT n.*
          FROM itens_watchlist w
          JOIN noticias_ativos na ON na.ativo_id = w.ativo_id
          JOIN noticias n ON n.id = na.noticia_id
         WHERE w.usuario_id = ? AND w.ativo = 1
           AND datetime(COALESCE(n.publicado_em, n.buscado_em)) >= datetime('now', '-' || ? || ' hours')
         ORDER BY datetime(COALESCE(n.publicado_em, n.buscado_em)) DESC
         LIMIT ?
        `
    ).bind(userId, String(sinceHours), limit).all();
    return rs.results;
  }
};

// src/services/asset.service.ts
init_modules_watch_stub();
var AssetService = class {
  constructor(env, assetRepo, marketData) {
    this.env = env;
    this.assetRepo = assetRepo;
    this.marketData = marketData;
  }
  static {
    __name(this, "AssetService");
  }
  async search(query) {
    if (!query || query.trim().length < 1) throw new ValidationError("query \xE9 obrigat\xF3rio");
    return this.assetRepo.searchByTickerOrName(query.trim());
  }
  async getByTicker(ticker) {
    const asset = await this.assetRepo.getByTicker(ticker.trim().toUpperCase());
    if (!asset) throw new NotFoundError("Ativo n\xE3o encontrado");
    const quote = await this.assetRepo.getLatestQuoteByAssetId(asset.id);
    return {
      id: asset.id,
      ticker: asset.ticker,
      nome_curto: asset.nome_curto,
      tipo: asset.tipo,
      bolsa: asset.bolsa,
      last_price: quote?.preco ?? null,
      last_updated_at: quote?.buscado_em ?? null,
      source: quote?.fonte ?? null
    };
  }
  async ensureAssetExists(ticker) {
    const t = ticker.trim().toUpperCase();
    const existing = await this.assetRepo.getByTicker(t);
    if (existing) return existing;
    const isCrypto = ["BTC", "ETH", "SOL"].includes(t);
    const created = await this.assetRepo.createAsset({
      id: crypto.randomUUID(),
      ticker: t,
      nome_curto: isCrypto ? t : null,
      tipo: isCrypto ? "CRIPTO" : "ACAO",
      bolsa: isCrypto ? "GLOBAL" : "B3"
    });
    return created;
  }
  async refreshAndStoreQuoteByAsset(ticker) {
    const t = ticker.trim().toUpperCase();
    const asset = await this.ensureAssetExists(t);
    const quote = await this.marketData.fetchQuote(t, asset.tipo);
    if (!quote) return null;
    if (quote.nameShort && quote.nameShort !== asset.nome_curto) {
      await this.assetRepo.updateNameShort(asset.id, quote.nameShort);
    }
    await this.assetRepo.insertQuote({
      id: crypto.randomUUID(),
      ativo_id: asset.id,
      preco: quote.price,
      cotado_em: quote.quotedAt || (/* @__PURE__ */ new Date()).toISOString(),
      fonte: quote.source
    });
    return quote;
  }
  async getCryptoSnapshot() {
    const out = [];
    for (const t of ["BTC", "ETH", "SOL"]) {
      const asset = await this.ensureAssetExists(t);
      const quote = await this.assetRepo.getLatestQuoteByAssetId(asset.id);
      out.push({
        ticker: t,
        price: quote?.preco ?? null,
        updatedAt: quote?.buscado_em ?? null,
        source: quote?.fonte ?? null
      });
    }
    return out;
  }
};

// src/services/market_data.service.ts
init_modules_watch_stub();
var MarketDataService = class {
  constructor(env) {
    this.env = env;
  }
  static {
    __name(this, "MarketDataService");
  }
  async fetchQuote(tickerRaw, tipo = "ACAO") {
    const ticker = tickerRaw.trim().toUpperCase();
    if (tipo === "CRIPTO") {
      return this.fetchCryptoQuote(ticker);
    }
    return this.fetchBrapiQuote(ticker);
  }
  async fetchBrapiQuote(ticker) {
    const endpoint = new URL("https://brapi.dev/api/quote/" + encodeURIComponent(ticker));
    if (this.env.BRAPI_TOKEN) endpoint.searchParams.set("token", this.env.BRAPI_TOKEN);
    const res = await fetch(endpoint.toString(), {
      headers: { "Accept": "application/json" }
    });
    if (!res.ok) return null;
    const json = await res.json();
    const result = json?.results?.[0];
    const price = Number(result?.regularMarketPrice ?? result?.price);
    if (!Number.isFinite(price)) return null;
    const quotedAt = result?.regularMarketTime ? new Date(result.regularMarketTime * 1e3).toISOString() : (/* @__PURE__ */ new Date()).toISOString();
    return {
      ticker,
      price,
      quotedAt,
      source: "BRAPI",
      nameShort: result?.shortName ?? result?.longName ?? null
    };
  }
  async fetchCryptoQuote(ticker) {
    const symbol = this.mapCryptoTickerToSymbol(ticker);
    const url = "https://api.binance.com/api/v3/ticker/price?symbol=" + encodeURIComponent(symbol);
    const res = await fetch(url, { headers: { "Accept": "application/json" } });
    if (!res.ok) return null;
    const json = await res.json();
    const price = Number(json?.price);
    if (!Number.isFinite(price)) return null;
    return {
      ticker,
      price,
      quotedAt: (/* @__PURE__ */ new Date()).toISOString(),
      source: "BINANCE",
      nameShort: ticker
    };
  }
  mapCryptoTickerToSymbol(ticker) {
    const t = ticker.toUpperCase();
    if (t.endsWith("USDT")) return t;
    switch (t) {
      case "BTC":
        return "BTCUSDT";
      case "ETH":
        return "ETHUSDT";
      case "SOL":
        return "SOLUSDT";
      default:
        return t + "USDT";
    }
  }
};

// src/controllers/assets.controller.ts
function registerAssetsController(router) {
  router.get("/api/v1/assets/search", async (ctx) => {
    const url = new URL(ctx.req.url);
    const q = (url.searchParams.get("query") || url.searchParams.get("q") || "").trim();
    if (!q) return jsonResponse({ assets: [] });
    const repo = new AssetRepository(ctx.env);
    const assets = await repo.searchByTickerOrName(q);
    return jsonResponse({ assets });
  });
  router.get("/api/v1/assets/:ticker", async (ctx) => {
    const ticker = (ctx.params.ticker || "").trim().toUpperCase();
    const assetRepo = new AssetRepository(ctx.env);
    const market = new MarketDataService(ctx.env);
    const assetService = new AssetService(ctx.env, assetRepo, market);
    const asset = await assetService.ensureAssetExists(ticker);
    const latest = await assetRepo.getLatestQuoteByAssetId(asset.id);
    return jsonResponse({ asset, latest_quote: latest });
  });
  router.get("/api/v1/assets/:ticker/news", async (ctx) => {
    const ticker = (ctx.params.ticker || "").trim().toUpperCase();
    const assetRepo = new AssetRepository(ctx.env);
    const asset = await assetRepo.getByTicker(ticker);
    if (!asset) return jsonResponse({ news: [] }, { status: 200 });
    const url = new URL(ctx.req.url);
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit") || "20")));
    const newsRepo = new NewsRepository(ctx.env.DB);
    const news = await newsRepo.listNewsForAsset(asset.id, limit);
    return jsonResponse({ asset: { id: asset.id, ticker: asset.ticker }, news });
  });
}
__name(registerAssetsController, "registerAssetsController");

// src/controllers/watchlist.controller.ts
init_modules_watch_stub();

// src/repositories/watchlist.repository.ts
init_modules_watch_stub();
var WatchlistRepository = class {
  constructor(db) {
    this.db = db;
  }
  static {
    __name(this, "WatchlistRepository");
  }
  async countActiveByUser(userId) {
    const row = await this.db.prepare(`SELECT COUNT(1) as cnt FROM itens_watchlist WHERE usuario_id = ? AND ativo = 1`).bind(userId).first();
    return Number(row?.cnt ?? 0);
  }
  async isInWatchlist(userId, assetId) {
    const row = await this.db.prepare(`SELECT 1 as ok FROM itens_watchlist WHERE usuario_id = ? AND ativo_id = ? AND ativo = 1 LIMIT 1`).bind(userId, assetId).first();
    return !!row;
  }
  async listByUser(userId) {
    const rs = await this.db.prepare(
      `
        SELECT w.id,
               w.usuario_id,
               w.ativo_id,
               w.ativo,
               w.criado_em,
               a.ticker,
               a.nome_curto,
               a.tipo,
               a.bolsa
          FROM itens_watchlist w
          JOIN ativos a ON a.id = w.ativo_id
         WHERE w.usuario_id = ?
           AND w.ativo = 1
           AND a.ativo = 1
         ORDER BY datetime(w.criado_em) DESC
        `
    ).bind(userId).all();
    return rs.results;
  }
  async listDistinctActiveAssetIds() {
    const rs = await this.db.prepare(`SELECT DISTINCT ativo_id as id FROM itens_watchlist WHERE ativo = 1`).all();
    return rs.results.map((r) => r.id);
  }
  async add(userId, assetId) {
    const existing = await this.db.prepare(`SELECT id, ativo FROM itens_watchlist WHERE usuario_id = ? AND ativo_id = ? LIMIT 1`).bind(userId, assetId).first();
    if (existing) {
      if (existing.ativo === 1) return existing.id;
      await this.db.prepare(`UPDATE itens_watchlist SET ativo = 1, criado_em = datetime('now') WHERE id = ?`).bind(existing.id).run();
      return existing.id;
    }
    const id = crypto.randomUUID();
    await this.db.prepare(
      `
        INSERT INTO itens_watchlist (id, usuario_id, ativo_id, ativo)
        VALUES (?, ?, ?, 1)
        `
    ).bind(id, userId, assetId).run();
    return id;
  }
  async remove(userId, assetId) {
    await this.db.prepare(`UPDATE itens_watchlist SET ativo = 0 WHERE usuario_id = ? AND ativo_id = ?`).bind(userId, assetId).run();
  }
};

// src/services/watchlist.service.ts
init_modules_watch_stub();
var WatchlistService = class {
  constructor(repo) {
    this.repo = repo;
  }
  static {
    __name(this, "WatchlistService");
  }
  async add(userId, assetId, maxAllowed) {
    const current = await this.repo.countActiveByUser(userId);
    if (current >= maxAllowed) {
      throw new ValidationError(`Limite do plano atingido. M\xE1ximo de ${maxAllowed} ativos acompanhados.`);
    }
    return this.repo.add(userId, assetId);
  }
  async remove(userId, assetId) {
    return this.repo.remove(userId, assetId);
  }
};

// src/controllers/watchlist.controller.ts
var AddSchema = external_exports.object({ ticker: external_exports.string().min(1).max(15) });
function registerWatchlistController(router) {
  router.get("/api/v1/watchlist", async (ctx) => {
    const user = requireUser(ctx);
    const watchlistRepo = new WatchlistRepository(ctx.env.DB);
    const assetRepo = new AssetRepository(ctx.env);
    const items = await watchlistRepo.listByUser(user.id);
    const enriched = await Promise.all(
      items.map(async (it) => {
        const q = await assetRepo.getLatestQuoteByAssetId(it.ativo_id);
        return {
          ...it,
          ultimo_preco: q?.preco ?? null,
          ultima_atualizacao: q?.buscado_em ?? null
        };
      })
    );
    return jsonResponse({ items: enriched });
  });
  router.post("/api/v1/watchlist", async (ctx) => {
    const user = requireUser(ctx);
    const body = await parseJson(ctx.req, AddSchema);
    const planRepo = new PlanRepository(ctx.env.DB);
    const watchlistRepo = new WatchlistRepository(ctx.env.DB);
    const plan = await planRepo.getCurrentPlanForUser(user.id);
    const maxAllowed = plan?.max_ativos_acompanhados ?? 2;
    const assetRepo = new AssetRepository(ctx.env);
    const marketData = new MarketDataService(ctx.env);
    const assetService = new AssetService(ctx.env, assetRepo, marketData);
    const watchlistService = new WatchlistService(watchlistRepo);
    const asset = await assetService.ensureAssetExists(body.ticker);
    await watchlistService.add(user.id, asset.id, maxAllowed);
    return jsonResponse({ ok: true }, { status: 201 });
  });
  router.delete("/api/v1/watchlist/:ticker", async (ctx) => {
    const user = requireUser(ctx);
    const ticker = (ctx.params?.ticker ?? "").toUpperCase();
    if (!ticker) return jsonResponse({ ok: false }, { status: 400 });
    const assetRepo = new AssetRepository(ctx.env);
    const asset = await assetRepo.getByTicker(ticker);
    if (!asset) return jsonResponse({ ok: true });
    const watchlistRepo = new WatchlistRepository(ctx.env.DB);
    const service = new WatchlistService(watchlistRepo);
    await service.remove(user.id, asset.id);
    return jsonResponse({ ok: true });
  });
}
__name(registerWatchlistController, "registerWatchlistController");

// src/controllers/alerts.controller.ts
init_modules_watch_stub();

// src/repositories/alert.repository.ts
init_modules_watch_stub();
var AlertRepository = class {
  constructor(db) {
    this.db = db;
  }
  static {
    __name(this, "AlertRepository");
  }
  async countActiveByUserAndAsset(userId, assetId) {
    const row = await this.db.prepare(`SELECT COUNT(1) as cnt FROM alertas_preco WHERE usuario_id = ? AND ativo_id = ? AND ativo = 1`).bind(userId, assetId).first();
    return Number(row?.cnt ?? 0);
  }
  async listActiveForPolling() {
    const rs = await this.db.prepare(`SELECT id, usuario_id, ativo_id, condicao, preco_alvo, ativo, cooldown_minutos, ultimo_disparo_em, criado_em, atualizado_em FROM alertas_preco WHERE ativo = 1`).all();
    return rs.results;
  }
  async listByUser(userId) {
    const rs = await this.db.prepare(
      `
        SELECT ap.id, ap.usuario_id, ap.ativo_id, ap.condicao, ap.preco_alvo, ap.ativo,
               ap.cooldown_minutos, ap.ultimo_disparo_em, ap.criado_em, ap.atualizado_em,
               a.ticker as ticker, a.nome_curto as nome_curto, a.tipo as tipo
          FROM alertas_preco ap
          JOIN ativos a ON a.id = ap.ativo_id
         WHERE ap.usuario_id = ?
         ORDER BY datetime(ap.criado_em) DESC
        `
    ).bind(userId).all();
    return rs.results;
  }
  async getById(userId, id) {
    return await this.db.prepare(
      `
        SELECT ap.id, ap.usuario_id, ap.ativo_id, ap.condicao, ap.preco_alvo, ap.ativo,
               ap.cooldown_minutos, ap.ultimo_disparo_em, ap.criado_em, ap.atualizado_em,
               a.ticker as ticker, a.nome_curto as nome_curto, a.tipo as tipo
          FROM alertas_preco ap
          JOIN ativos a ON a.id = ap.ativo_id
         WHERE ap.usuario_id = ? AND ap.id = ?
         LIMIT 1
        `
    ).bind(userId, id).first();
  }
  async create(input) {
    const id = crypto.randomUUID();
    const cooldown = input.cooldown_minutos ?? 30;
    await this.db.prepare(
      `
        INSERT INTO alertas_preco (id, usuario_id, ativo_id, condicao, preco_alvo, ativo, cooldown_minutos)
        VALUES (?, ?, ?, ?, ?, 1, ?)
        `
    ).bind(id, input.usuario_id, input.ativo_id, input.condicao, input.preco_alvo, cooldown).run();
    return id;
  }
  async update(userId, id, patch) {
    const keys = [];
    const values = [];
    if (patch.condicao) {
      keys.push("condicao = ?");
      values.push(patch.condicao);
    }
    if (patch.preco_alvo !== void 0) {
      keys.push("preco_alvo = ?");
      values.push(patch.preco_alvo);
    }
    if (patch.ativo !== void 0) {
      keys.push("ativo = ?");
      values.push(patch.ativo);
    }
    if (patch.cooldown_minutos !== void 0) {
      keys.push("cooldown_minutos = ?");
      values.push(patch.cooldown_minutos);
    }
    if (!keys.length) return;
    keys.push(`atualizado_em = datetime('now')`);
    await this.db.prepare(`UPDATE alertas_preco SET ${keys.join(", ")} WHERE usuario_id = ? AND id = ?`).bind(...values, userId, id).run();
  }
  async delete(userId, id) {
    await this.db.prepare(`DELETE FROM alertas_preco WHERE usuario_id = ? AND id = ?`).bind(userId, id).run();
  }
  async listActiveByAssetIds(assetIds) {
    if (!assetIds.length) return [];
    const placeholders = assetIds.map(() => "?").join(",");
    const rs = await this.db.prepare(
      `
        SELECT id, usuario_id, ativo_id, condicao, preco_alvo, ativo, cooldown_minutos, ultimo_disparo_em, criado_em, atualizado_em
          FROM alertas_preco
         WHERE ativo = 1 AND ativo_id IN (${placeholders})
        `
    ).bind(...assetIds).all();
    return rs.results;
  }
  async listDistinctActiveAssetIds() {
    const rs = await this.db.prepare(`SELECT DISTINCT ativo_id as ativo_id FROM alertas_preco WHERE ativo = 1`).all();
    return rs.results.map((r) => r.ativo_id);
  }
  async markFired(alertId, firedAtIso) {
    await this.db.prepare(`UPDATE alertas_preco SET ultimo_disparo_em = ?, atualizado_em = datetime('now') WHERE id = ?`).bind(firedAtIso, alertId).run();
  }
  async createFireEvent(input) {
    const id = crypto.randomUUID();
    const motivo = input.motivo ?? "CONDICAO_ATINGIDA";
    await this.db.prepare(
      `
        INSERT INTO eventos_disparo_alerta (id, alerta_id, usuario_id, ativo_id, preco_observado, motivo)
        VALUES (?, ?, ?, ?, ?, ?)
        `
    ).bind(id, input.alerta_id, input.usuario_id, input.ativo_id, input.preco_observado, motivo).run();
    return id;
  }
  async listHistoryByUser(userId, limit = 100) {
    const rs = await this.db.prepare(
      `
        SELECT e.id, e.alerta_id, e.usuario_id, e.ativo_id, e.preco_observado, e.disparado_em, e.motivo,
               a.ticker as ticker
          FROM eventos_disparo_alerta e
          JOIN ativos a ON a.id = e.ativo_id
         WHERE e.usuario_id = ?
         ORDER BY datetime(e.disparado_em) DESC
         LIMIT ?
        `
    ).bind(userId, limit).all();
    return rs.results;
  }
};

// src/services/alert.service.ts
init_modules_watch_stub();
var AlertService = class {
  constructor(repo) {
    this.repo = repo;
  }
  static {
    __name(this, "AlertService");
  }
  async list(userId) {
    return this.repo.listByUser(userId);
  }
  async get(userId, alertId) {
    return this.repo.getById(userId, alertId);
  }
  async create(params) {
    const count = await this.repo.countActiveByUserAndAsset(params.userId, params.assetId);
    if (count >= params.maxAlertsPerAsset) {
      throw new ValidationError(
        `Limite do plano atingido. M\xE1ximo de ${params.maxAlertsPerAsset} alertas por ativo.`
      );
    }
    const id = await this.repo.create({
      usuario_id: params.userId,
      ativo_id: params.assetId,
      condicao: params.condicao,
      preco_alvo: params.precoAlvo,
      cooldown_minutos: params.cooldownMinutos
    });
    return id;
  }
  async update(userId, alertId, patch) {
    await this.repo.update(userId, alertId, {
      condicao: patch.condicao,
      preco_alvo: patch.preco_alvo,
      ativo: patch.ativo,
      cooldown_minutos: patch.cooldown_minutos
    });
  }
  async remove(userId, alertId) {
    await this.repo.delete(userId, alertId);
  }
  async listEvents(userId, limit = 50) {
    return this.repo.listHistoryByUser(userId, limit);
  }
};

// src/controllers/alerts.controller.ts
var CreateSchema = external_exports.object({
  ticker: external_exports.string().min(1).max(15),
  condicao: external_exports.enum(["ACIMA_OU_IGUAL", "ABAIXO_OU_IGUAL"]),
  preco_alvo: external_exports.number().positive(),
  cooldown_minutos: external_exports.number().int().min(1).max(7 * 24 * 60).optional()
});
var PatchSchema = external_exports.object({
  condicao: external_exports.enum(["ACIMA_OU_IGUAL", "ABAIXO_OU_IGUAL"]).optional(),
  preco_alvo: external_exports.number().positive().optional(),
  ativo: external_exports.boolean().optional(),
  cooldown_minutos: external_exports.number().int().min(1).max(7 * 24 * 60).optional()
});
function registerAlertsController(router) {
  router.get("/api/v1/alerts", async (ctx) => {
    const user = requireUser(ctx);
    const service = new AlertService(new AlertRepository(ctx.env.DB));
    const items = await service.list(user.id);
    return jsonResponse({ items });
  });
  router.get("/api/v1/alerts/events", async (ctx) => {
    const user = requireUser(ctx);
    const url = new URL(ctx.req.url);
    const limit = Number(url.searchParams.get("limit") ?? "50");
    const service = new AlertService(new AlertRepository(ctx.env.DB));
    const items = await service.listEvents(user.id, Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 200) : 50);
    return jsonResponse({ items });
  });
  router.post("/api/v1/alerts", async (ctx) => {
    const user = requireUser(ctx);
    const body = await parseJson(ctx.req, CreateSchema);
    const planRepo = new PlanRepository(ctx.env.DB);
    const plan = await planRepo.getCurrentPlanForUser(user.id);
    const maxPerAsset = plan?.max_alertas_por_ativo ?? 3;
    const assetRepo = new AssetRepository(ctx.env);
    const marketData = new MarketDataService(ctx.env);
    const assetService = new AssetService(ctx.env, assetRepo, marketData);
    const asset = await assetService.ensureAssetExists(body.ticker);
    const alertService = new AlertService(new AlertRepository(ctx.env.DB));
    const id = await alertService.create({
      userId: user.id,
      assetId: asset.id,
      condicao: body.condicao,
      precoAlvo: body.preco_alvo,
      cooldownMinutos: body.cooldown_minutos,
      maxAlertsPerAsset: maxPerAsset
    });
    return jsonResponse({ id }, { status: 201 });
  });
  router.patch("/api/v1/alerts/:id", async (ctx) => {
    const user = requireUser(ctx);
    const id = ctx.params?.id ?? "";
    if (!id) return jsonResponse({ ok: false }, { status: 400 });
    const body = await parseJson(ctx.req, PatchSchema);
    const service = new AlertService(new AlertRepository(ctx.env.DB));
    await service.update(user.id, id, {
      condicao: body.condicao,
      preco_alvo: body.preco_alvo,
      ativo: body.ativo === void 0 ? void 0 : body.ativo ? 1 : 0,
      cooldown_minutos: body.cooldown_minutos
    });
    return jsonResponse({ ok: true });
  });
  router.delete("/api/v1/alerts/:id", async (ctx) => {
    const user = requireUser(ctx);
    const id = ctx.params?.id ?? "";
    if (!id) return jsonResponse({ ok: false }, { status: 400 });
    const service = new AlertService(new AlertRepository(ctx.env.DB));
    await service.remove(user.id, id);
    return jsonResponse({ ok: true });
  });
}
__name(registerAlertsController, "registerAlertsController");

// src/controllers/preferences.controller.ts
init_modules_watch_stub();
var UpdateSchema = external_exports.object({
  fuso_horario: external_exports.string().optional(),
  resumo_diario_ativo: external_exports.boolean().optional(),
  horario_resumo: external_exports.string().regex(/^\d{2}:\d{2}$/).optional(),
  canal_padrao_noticias: external_exports.enum(["PUSH", "EMAIL", "AMBOS"]).optional(),
  alerta_aviso_push_obrigatorio: external_exports.boolean().optional()
});
function registerPreferencesController(router) {
  router.get("/api/v1/preferences", async (ctx) => {
    const user = requireUser(ctx);
    const repo = new PreferencesRepository(ctx.env.DB);
    await repo.ensureDefaults(user.id);
    const preferences = await repo.getByUserId(user.id);
    return jsonResponse({ preferences });
  });
  router.put("/api/v1/preferences", async (ctx) => {
    const user = requireUser(ctx);
    const body = await parseJson(ctx.req, UpdateSchema);
    const repo = new PreferencesRepository(ctx.env.DB);
    await repo.ensureDefaults(user.id);
    await repo.update(user.id, {
      fuso_horario: body.fuso_horario,
      resumo_diario_ativo: body.resumo_diario_ativo === void 0 ? void 0 : body.resumo_diario_ativo ? 1 : 0,
      horario_resumo: body.horario_resumo,
      canal_padrao_noticias: body.canal_padrao_noticias,
      alerta_aviso_push_obrigatorio: body.alerta_aviso_push_obrigatorio === void 0 ? void 0 : body.alerta_aviso_push_obrigatorio ? 1 : 0
    });
    const preferences = await repo.getByUserId(user.id);
    return jsonResponse({ preferences });
  });
}
__name(registerPreferencesController, "registerPreferencesController");

// src/controllers/crypto.controller.ts
init_modules_watch_stub();
var CRYPTO_TICKERS = ["BTC", "ETH", "SOL"];
function registerCryptoController(router) {
  router.get("/api/v1/crypto/prices", async (ctx) => {
    const assetRepo = new AssetRepository(ctx.env);
    const market = new MarketDataService(ctx.env);
    const assetService = new AssetService(ctx.env, assetRepo, market);
    const items = [];
    for (const ticker of CRYPTO_TICKERS) {
      const asset = await assetService.ensureAssetExists(ticker);
      const quote = await assetRepo.getLatestQuoteByAssetId(asset.id);
      items.push({ asset, latest_quote: quote });
    }
    return jsonResponse({ items });
  });
}
__name(registerCryptoController, "registerCryptoController");

// src/controllers/docs.controller.ts
init_modules_watch_stub();

// src/docs/openapi.ts
init_modules_watch_stub();
function buildOpenApiSpec(baseUrl) {
  return {
    openapi: "3.0.3",
    info: {
      title: "FinancialSecretary API",
      version: "0.1.0",
      description: "API do FinancialSecretary (Cloudflare Workers + D1)"
    },
    servers: [{ url: baseUrl.replace(/\/$/, "") }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
      }
    },
    security: [{ bearerAuth: [] }],
    paths: {
      "/api/v1/health": {
        get: {
          summary: "Healthcheck",
          security: [],
          responses: { "200": { description: "OK" } }
        }
      },
      "/api/v1/auth/register": {
        post: {
          summary: "Criar conta",
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "senha", "nome", "aceitou_termos"],
                  properties: {
                    email: { type: "string" },
                    senha: { type: "string" },
                    nome: { type: "string" },
                    aceitou_termos: { type: "boolean" }
                  }
                }
              }
            }
          },
          responses: { "200": { description: "OK" } }
        }
      },
      "/api/v1/auth/login": {
        post: {
          summary: "Login",
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "senha"],
                  properties: {
                    email: { type: "string" },
                    senha: { type: "string" }
                  }
                }
              }
            }
          },
          responses: { "200": { description: "OK" } }
        }
      },
      "/api/v1/me": {
        get: { summary: "Dados da conta", responses: { "200": { description: "OK" } } },
        put: { summary: "Atualizar conta", responses: { "200": { description: "OK" } } },
        delete: { summary: "Excluir conta (soft delete)", responses: { "200": { description: "OK" } } }
      },
      "/api/v1/preferences": {
        get: { summary: "Prefer\xEAncias do usu\xE1rio", responses: { "200": { description: "OK" } } },
        put: { summary: "Atualizar prefer\xEAncias do usu\xE1rio", responses: { "200": { description: "OK" } } }
      },
      "/api/v1/assets/search": {
        get: {
          summary: "Buscar ativo por ticker/nome",
          parameters: [{ name: "q", in: "query", schema: { type: "string" }, required: true }],
          responses: { "200": { description: "OK" } }
        }
      },
      "/api/v1/news": {
        get: {
          summary: "Not\xEDcias relacionadas aos ativos do usu\xE1rio",
          parameters: [
            { name: "sinceHours", in: "query", schema: { type: "integer", default: 24 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 50 } }
          ],
          responses: { "200": { description: "OK" } }
        }
      },
      "/api/v1/digest/latest": {
        get: { summary: "Resumo di\xE1rio mais recente", responses: { "200": { description: "OK" } } }
      },
      "/api/v1/watchlist": {
        get: { summary: "Listar watchlist", responses: { "200": { description: "OK" } } },
        post: { summary: "Adicionar ativo", responses: { "200": { description: "OK" } } }
      },
      "/api/v1/watchlist/{ticker}": {
        delete: {
          summary: "Remover ativo",
          parameters: [{ name: "ticker", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "OK" } }
        }
      },
      "/api/v1/alerts": {
        get: { summary: "Listar alertas", responses: { "200": { description: "OK" } } },
        post: { summary: "Criar alerta", responses: { "200": { description: "OK" } } }
      },
      "/api/v1/alerts/{id}": {
        put: {
          summary: "Atualizar alerta",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "OK" } }
        },
        delete: {
          summary: "Excluir alerta",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "OK" } }
        }
      },
      "/api/v1/notifications/devices": {
        get: { summary: "Listar dispositivos do usu\xE1rio", responses: { "200": { description: "OK" } } }
      },
      "/api/v1/notifications/device": {
        post: { summary: "Registrar/atualizar dispositivo", responses: { "201": { description: "Created" } } }
      },
      "/api/v1/notifications/push/subscribe": {
        post: { summary: "Salvar subscription de Web Push", responses: { "201": { description: "Created" } } }
      },
      "/api/v1/notifications/push/revoke": {
        post: { summary: "Revogar subscription de Web Push", responses: { "200": { description: "OK" } } }
      },
      "/api/v1/notifications/push/permission": {
        post: { summary: "Registrar estado de permiss\xE3o de notifica\xE7\xE3o", responses: { "201": { description: "Created" } } }
      },
      "/api/v1/notifications/messages": {
        get: { summary: "Listar mensagens de notifica\xE7\xE3o do usu\xE1rio", responses: { "200": { description: "OK" } } }
      },
      "/api/v1/dashboard": {
        get: { summary: "Dashboard", responses: { "200": { description: "OK" } } }
      },
      "/api/v1/crypto/prices": {
        get: { summary: "Pre\xE7o cripto (BTC/ETH/SOL)", responses: { "200": { description: "OK" } } }
      },
      "/api/v1/admin/summary": {
        get: { summary: "Admin: m\xE9tricas b\xE1sicas", responses: { "200": { description: "OK" } } }
      },
      "/api/v1/admin/jobs/recent": {
        get: { summary: "Admin: jobs recentes", responses: { "200": { description: "OK" } } }
      },
      "/api/v1/admin/errors/recent": {
        get: { summary: "Admin: erros recentes", responses: { "200": { description: "OK" } } }
      }
    }
  };
}
__name(buildOpenApiSpec, "buildOpenApiSpec");

// src/docs/swagger.ts
init_modules_watch_stub();
function swaggerHtml(openApiUrl) {
  const url = openApiUrl.replace(/"/g, "&quot;");
  return `<!doctype html>
<html lang="pt-br">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>FinancialSecretary API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  <style>
    body { margin: 0; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"><\/script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: "${url}",
        dom_id: '#swagger-ui',
        deepLinking: true,
        persistAuthorization: true,
      });
    };
  <\/script>
</body>
</html>`;
}
__name(swaggerHtml, "swaggerHtml");

// src/controllers/docs.controller.ts
function registerDocsController(router) {
  router.get("/api/v1/openapi.json", (ctx) => {
    const url = new URL(ctx.req.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const spec = buildOpenApiSpec(baseUrl);
    return jsonResponse(spec, { status: 200 });
  });
  router.get("/api/v1/docs", (ctx) => {
    const url = new URL(ctx.req.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const html = swaggerHtml(`${baseUrl}/api/v1/openapi.json`);
    return new Response(html, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8"
      }
    });
  });
}
__name(registerDocsController, "registerDocsController");

// src/controllers/notifications.controller.ts
init_modules_watch_stub();

// src/repositories/notification.repository.ts
init_modules_watch_stub();
var NotificationRepository = class {
  constructor(db) {
    this.db = db;
  }
  static {
    __name(this, "NotificationRepository");
  }
  async upsertDevice(input) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    if (input.id) {
      const update = await this.db.prepare(
        `UPDATE dispositivos_usuario
             SET apelido_dispositivo = ?,
                 plataforma = ?,
                 user_agent = ?,
                 visto_por_ultimo_em = ?,
                 ativo = 1,
                 atualizado_em = datetime('now')
           WHERE id = ? AND usuario_id = ?`
      ).bind(
        input.apelido_dispositivo ?? null,
        input.plataforma ?? null,
        input.user_agent ?? null,
        now,
        input.id,
        input.usuario_id
      ).run();
      if (update.success && (update.meta.changes ?? 0) > 0) {
        const row = await this.getDeviceById(input.id, input.usuario_id);
        if (row) return row;
      }
    }
    const id = crypto.randomUUID();
    await this.db.prepare(
      `INSERT INTO dispositivos_usuario (id, usuario_id, apelido_dispositivo, plataforma, user_agent, visto_por_ultimo_em, ativo)
         VALUES (?, ?, ?, ?, ?, ?, 1)`
    ).bind(
      id,
      input.usuario_id,
      input.apelido_dispositivo ?? null,
      input.plataforma ?? null,
      input.user_agent ?? null,
      now
    ).run();
    const created = await this.getDeviceById(id, input.usuario_id);
    if (!created) throw new Error("Falha ao criar dispositivo");
    return created;
  }
  async getDeviceById(id, usuarioId) {
    const res = await this.db.prepare(
      `SELECT * FROM dispositivos_usuario
         WHERE id = ? AND usuario_id = ?`
    ).bind(id, usuarioId).first();
    return res ?? null;
  }
  async listDevicesByUser(usuarioId) {
    const res = await this.db.prepare(
      `SELECT * FROM dispositivos_usuario
         WHERE usuario_id = ?
         ORDER BY atualizado_em DESC`
    ).bind(usuarioId).all();
    return res.results ?? [];
  }
  async upsertPushSubscription(input) {
    const id = crypto.randomUUID();
    await this.db.prepare(
      `INSERT INTO inscricoes_push (id, usuario_id, dispositivo_id, endpoint, p256dh, auth, valida)
         VALUES (?, ?, ?, ?, ?, ?, 1)
         ON CONFLICT(dispositivo_id, endpoint) DO UPDATE SET
           p256dh = excluded.p256dh,
           auth = excluded.auth,
           valida = 1,
           revogado_em = NULL`
    ).bind(id, input.usuario_id, input.dispositivo_id, input.endpoint, input.p256dh, input.auth).run();
    const row = await this.db.prepare(
      `SELECT * FROM inscricoes_push
         WHERE usuario_id = ? AND dispositivo_id = ? AND endpoint = ?`
    ).bind(input.usuario_id, input.dispositivo_id, input.endpoint).first();
    if (!row) throw new Error("Falha ao registrar inscricao push");
    return row;
  }
  async revokePushSubscription(input) {
    await this.db.prepare(
      `UPDATE inscricoes_push
           SET valida = 0,
               revogado_em = datetime('now')
         WHERE usuario_id = ? AND dispositivo_id = ? AND endpoint = ?`
    ).bind(input.usuario_id, input.dispositivo_id, input.endpoint).run();
  }
  async listValidSubscriptionsByUser(usuarioId) {
    const res = await this.db.prepare(
      `SELECT * FROM inscricoes_push
         WHERE usuario_id = ? AND valida = 1`
    ).bind(usuarioId).all();
    return res.results ?? [];
  }
  async markSubscriptionInvalidByEndpoint(endpoint) {
    await this.db.prepare(
      `UPDATE inscricoes_push
           SET valida = 0,
               revogado_em = datetime('now')
         WHERE endpoint = ?`
    ).bind(endpoint).run();
  }
  async recordPermissionHistory(input) {
    const id = crypto.randomUUID();
    await this.db.prepare(
      `INSERT INTO historico_permissao_notificacao (id, usuario_id, dispositivo_id, estado, origem, detalhes)
         VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(
      id,
      input.usuario_id,
      input.dispositivo_id ?? null,
      input.estado,
      input.origem,
      input.detalhes ?? null
    ).run();
  }
  async createMessage(input) {
    const id = crypto.randomUUID();
    const status = input.status ?? "PENDENTE";
    await this.db.prepare(
      `INSERT INTO mensagens_notificacao (id, usuario_id, tipo, canal, titulo, corpo, deep_link, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id,
      input.usuario_id,
      input.tipo,
      input.canal,
      input.titulo,
      input.corpo ?? null,
      input.deep_link ?? null,
      status
    ).run();
    const row = await this.db.prepare("SELECT * FROM mensagens_notificacao WHERE id = ?").bind(id).first();
    if (!row) throw new Error("Falha ao criar mensagem");
    return row;
  }
  async markMessageSent(id, providerId) {
    await this.db.prepare(
      `UPDATE mensagens_notificacao
           SET status = 'ENVIADA',
               id_provedor = ?,
               erro = NULL,
               enviado_em = datetime('now')
         WHERE id = ?`
    ).bind(providerId ?? null, id).run();
  }
  async markMessageFailed(id, error) {
    await this.db.prepare(
      `UPDATE mensagens_notificacao
           SET status = 'FALHOU',
               erro = ?,
               enviado_em = datetime('now')
         WHERE id = ?`
    ).bind(error, id).run();
  }
  async markMessageIgnored(id, reason) {
    await this.db.prepare(
      `UPDATE mensagens_notificacao
           SET status = 'IGNORADA',
               erro = ?
         WHERE id = ?`
    ).bind(reason ?? null, id).run();
  }
  async listMessagesByUser(usuarioId, limit = 50) {
    const res = await this.db.prepare(
      `SELECT * FROM mensagens_notificacao
         WHERE usuario_id = ?
         ORDER BY criado_em DESC
         LIMIT ?`
    ).bind(usuarioId, limit).all();
    return res.results ?? [];
  }
  async getPushSubscriptionById(id, usuarioId) {
    const row = await this.db.prepare(`SELECT * FROM inscricoes_push WHERE id = ? AND usuario_id = ? LIMIT 1`).bind(id, usuarioId).first();
    return row ?? null;
  }
  async revokePushSubscriptionById(usuarioId, subscriptionId) {
    await this.db.prepare(
      `UPDATE inscricoes_push
           SET valida = 0,
               revogado_em = datetime('now')
         WHERE id = ? AND usuario_id = ?`
    ).bind(subscriptionId, usuarioId).run();
  }
  async listPendingMessages(limit = 100) {
    const res = await this.db.prepare(
      `SELECT * FROM mensagens_notificacao
         WHERE status = 'PENDENTE'
         ORDER BY datetime(criado_em) ASC
         LIMIT ?`
    ).bind(limit).all();
    return res.results ?? [];
  }
};

// src/services/notification.service.ts
init_modules_watch_stub();
var NotificationService = class {
  constructor(notifRepo) {
    this.notifRepo = notifRepo;
  }
  static {
    __name(this, "NotificationService");
  }
  async upsertDevice(params) {
    return await this.notifRepo.upsertDevice(params);
  }
  async listDevices(usuarioId) {
    return await this.notifRepo.listDevicesByUser(usuarioId);
  }
  async upsertPushSubscription(params) {
    if (!params.subscription?.endpoint) {
      throw new AppError("subscription_invalida", 400, "Subscription inv\xE1lida.");
    }
    return await this.notifRepo.upsertPushSubscription({
      usuario_id: params.usuario_id,
      dispositivo_id: params.dispositivo_id,
      endpoint: params.subscription.endpoint,
      p256dh: params.subscription.keys.p256dh,
      auth: params.subscription.keys.auth
    });
  }
  async revokePushSubscription(params) {
    await this.notifRepo.revokePushSubscription(params);
  }
  async recordPermission(params) {
    return await this.notifRepo.recordPermissionHistory({
      ...params,
      dispositivo_id: params.dispositivo_id ?? null,
      detalhes: params.detalhes ?? null
    });
  }
  async listMessages(usuarioId, limit = 50) {
    return await this.notifRepo.listMessagesByUser(usuarioId, limit);
  }
  async revokeSubscriptionById(params) {
    const row = await this.notifRepo.getPushSubscriptionById(params.subscription_id, params.usuario_id);
    if (!row) {
      return;
    }
    await this.notifRepo.revokePushSubscriptionById(params.usuario_id, params.subscription_id);
  }
};

// src/controllers/notifications.controller.ts
var UpsertDeviceSchema = external_exports.object({
  id: external_exports.string().optional(),
  apelido_dispositivo: external_exports.string().max(60).optional(),
  plataforma: external_exports.enum(["web", "android", "ios"]).optional(),
  user_agent: external_exports.string().optional()
});
var SubscribeSchema = external_exports.object({
  dispositivo_id: external_exports.string().min(1),
  subscription: external_exports.object({
    endpoint: external_exports.string().url(),
    keys: external_exports.object({
      p256dh: external_exports.string().min(1),
      auth: external_exports.string().min(1)
    })
  })
});
var PermissionSchema = external_exports.object({
  dispositivo_id: external_exports.string().optional(),
  estado: external_exports.enum(["CONCEDIDA", "NEGADA", "BLOQUEADA", "PADRAO"]),
  origem: external_exports.enum(["POPUP_NAVEGADOR", "TELA_CONFIG_APP", "CONFIG_SISTEMA", "DESCONHECIDA"]),
  detalhes: external_exports.string().optional()
});
var RevokeSchema = external_exports.object({
  subscription_id: external_exports.string().min(1)
});
function registerNotificationsController(router) {
  router.get("/api/v1/notifications/devices", async (ctx) => {
    const user = requireUser(ctx);
    const service = new NotificationService(new NotificationRepository(ctx.env.DB));
    const devices = await service.listDevices(user.id);
    return jsonResponse({ devices });
  });
  router.post("/api/v1/notifications/device", async (ctx) => {
    const user = requireUser(ctx);
    const body = await parseJson(ctx.req, UpsertDeviceSchema);
    const service = new NotificationService(new NotificationRepository(ctx.env.DB));
    const device = await service.upsertDevice({
      usuario_id: user.id,
      id: body.id,
      apelido_dispositivo: body.apelido_dispositivo,
      plataforma: body.plataforma,
      user_agent: body.user_agent
    });
    return jsonResponse({ device }, { status: 201 });
  });
  router.post("/api/v1/notifications/push/subscribe", async (ctx) => {
    const user = requireUser(ctx);
    const body = await parseJson(ctx.req, SubscribeSchema);
    const service = new NotificationService(new NotificationRepository(ctx.env.DB));
    const subscription = await service.upsertPushSubscription({
      usuario_id: user.id,
      dispositivo_id: body.dispositivo_id,
      subscription: body.subscription
    });
    return jsonResponse({ subscription }, { status: 201 });
  });
  router.post("/api/v1/notifications/push/revoke", async (ctx) => {
    const user = requireUser(ctx);
    const body = await parseJson(ctx.req, RevokeSchema);
    const service = new NotificationService(new NotificationRepository(ctx.env.DB));
    await service.revokeSubscriptionById({ usuario_id: user.id, subscription_id: body.subscription_id });
    return jsonResponse({ ok: true });
  });
  router.post("/api/v1/notifications/push/permission", async (ctx) => {
    const user = requireUser(ctx);
    const body = await parseJson(ctx.req, PermissionSchema);
    const service = new NotificationService(new NotificationRepository(ctx.env.DB));
    const permission = await service.recordPermission({
      usuario_id: user.id,
      dispositivo_id: body.dispositivo_id,
      estado: body.estado,
      origem: body.origem,
      detalhes: body.detalhes
    });
    return jsonResponse({ permission }, { status: 201 });
  });
  router.get("/api/v1/notifications/messages", async (ctx) => {
    const user = requireUser(ctx);
    const service = new NotificationService(new NotificationRepository(ctx.env.DB));
    const messages = await service.listMessages(user.id, 50);
    return jsonResponse({ messages });
  });
}
__name(registerNotificationsController, "registerNotificationsController");

// src/controllers/dashboard.controller.ts
init_modules_watch_stub();

// src/repositories/digest.repository.ts
init_modules_watch_stub();
var DigestRepository = class {
  constructor(db) {
    this.db = db;
  }
  static {
    __name(this, "DigestRepository");
  }
  async getLatestDigestForUser(usuarioId) {
    const row = await this.db.prepare(
      `SELECT *
           FROM resumos_diarios
          WHERE usuario_id = ?
          ORDER BY data_resumo DESC
          LIMIT 1`
    ).bind(usuarioId).first();
    return row ?? null;
  }
  async getDigestByUserAndDate(usuarioId, dataResumo) {
    const row = await this.db.prepare(
      `SELECT *
           FROM resumos_diarios
          WHERE usuario_id = ? AND data_resumo = ?
          LIMIT 1`
    ).bind(usuarioId, dataResumo).first();
    return row ?? null;
  }
  async upsertDigest(params) {
    const { id, usuario_id, data_resumo, provedor_modelo, nome_modelo, texto_resumo } = params;
    await this.db.prepare(
      `INSERT INTO resumos_diarios (id, usuario_id, data_resumo, provedor_modelo, nome_modelo, texto_resumo)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(usuario_id, data_resumo) DO UPDATE SET
           provedor_modelo = excluded.provedor_modelo,
           nome_modelo = excluded.nome_modelo,
           texto_resumo = excluded.texto_resumo`
    ).bind(id, usuario_id, data_resumo, provedor_modelo ?? null, nome_modelo ?? null, texto_resumo ?? null).run();
  }
  async markDigestSent(resumoId) {
    await this.db.prepare(
      `UPDATE resumos_diarios
            SET enviado_em = datetime('now')
          WHERE id = ?`
    ).bind(resumoId).run();
  }
  async replaceDigestItems(resumoId, items) {
    await this.db.prepare(`DELETE FROM itens_resumo_diario WHERE resumo_id = ?`).bind(resumoId).run();
    for (const item of items) {
      await this.db.prepare(
        `INSERT INTO itens_resumo_diario (id, resumo_id, noticia_id, ativo_id, bullets, ordem)
           VALUES (?, ?, ?, ?, ?, ?)`
      ).bind(item.id, resumoId, item.noticia_id, item.ativo_id ?? null, item.bullets ?? null, item.ordem).run();
    }
  }
  async listDigestItems(resumoId) {
    const res = await this.db.prepare(
      `SELECT *
           FROM itens_resumo_diario
          WHERE resumo_id = ?
          ORDER BY ordem ASC`
    ).bind(resumoId).all();
    return res.results ?? [];
  }
};

// src/controllers/dashboard.controller.ts
function registerDashboardController(router) {
  router.get("/api/v1/dashboard", async (ctx) => {
    const user = requireUser(ctx);
    const watchlistRepo = new WatchlistRepository(ctx.env.DB);
    const assetRepo = new AssetRepository(ctx.env);
    const alertRepo = new AlertRepository(ctx.env.DB);
    const digestRepo = new DigestRepository(ctx.env.DB);
    const notifRepo = new NotificationRepository(ctx.env.DB);
    const watchlist = await watchlistRepo.listByUser(user.id);
    const watchlistWithQuote = await Promise.all(
      watchlist.map(async (i) => {
        const q = await assetRepo.getLatestQuoteByAssetId(i.ativo_id);
        return {
          ...i,
          cotacao: q ? { preco: q.preco, cotado_em: q.cotado_em, fonte: q.fonte } : null
        };
      })
    );
    const alerts = await alertRepo.listByUser(user.id);
    const alertHistory = await alertRepo.listHistoryByUser(user.id, 20);
    const lastDigest = await digestRepo.getLatestDigestForUser(user.id);
    const lastDigestItems = lastDigest ? await digestRepo.listDigestItems(lastDigest.id) : [];
    const messages = await notifRepo.listMessagesByUser(user.id, 20);
    return jsonResponse({
      watchlist: watchlistWithQuote,
      alerts,
      alert_history: alertHistory,
      last_digest: lastDigest ? { ...lastDigest, items: lastDigestItems } : null,
      notifications: messages
    });
  });
}
__name(registerDashboardController, "registerDashboardController");

// src/controllers/news.controller.ts
init_modules_watch_stub();
function registerNewsController(router) {
  router.get("/api/v1/news", async (ctx) => {
    const user = requireUser(ctx);
    const sinceHours = ctx.query.sinceHours ? Number(ctx.query.sinceHours) : 24;
    const limit = ctx.query.limit ? Number(ctx.query.limit) : 50;
    const repo = new NewsRepository(ctx.env.DB);
    const news = await repo.listNewsForUserWatchlist(user.id, Number.isFinite(sinceHours) ? sinceHours : 24, Number.isFinite(limit) ? limit : 50);
    return jsonResponse({ news });
  });
}
__name(registerNewsController, "registerNewsController");

// src/controllers/digest.controller.ts
init_modules_watch_stub();
function registerDigestController(router) {
  router.get("/api/v1/digest/latest", async (ctx) => {
    const user = requireUser(ctx);
    const repo = new DigestRepository(ctx.env.DB);
    const digest = await repo.getLatestDigestForUser(user.id);
    if (!digest) return jsonResponse({ digest: null });
    const items = await repo.listDigestItems(digest.id);
    return jsonResponse({ digest: { ...digest, items } });
  });
}
__name(registerDigestController, "registerDigestController");

// src/controllers/admin.controller.ts
init_modules_watch_stub();

// src/repositories/job.repository.ts
init_modules_watch_stub();
var JobRepository = class {
  constructor(db) {
    this.db = db;
  }
  static {
    __name(this, "JobRepository");
  }
  async startExecution(tipo, detalhes) {
    const id = crypto.randomUUID();
    const detalhesText = detalhes == null ? null : JSON.stringify(detalhes);
    await this.db.prepare(
      `INSERT INTO execucoes_job (id, tipo, status, detalhes, qtd_processada, qtd_erros)
         VALUES (?, ?, 'EXECUTANDO', ?, 0, 0)`
    ).bind(id, tipo, detalhesText).run();
    return id;
  }
  async finishExecution(id, status, opts) {
    const detalhesText = opts?.detalhes == null ? null : JSON.stringify(opts.detalhes);
    await this.db.prepare(
      `UPDATE execucoes_job
           SET finalizado_em = datetime('now'),
               status = ?,
               detalhes = COALESCE(?, detalhes),
               qtd_processada = COALESCE(?, qtd_processada),
               qtd_erros = COALESCE(?, qtd_erros)
         WHERE id = ?`
    ).bind(status, detalhesText, opts?.qtdProcessada ?? null, opts?.qtdErros ?? null, id).run();
  }
  async logError(payload) {
    const id = crypto.randomUUID();
    await this.db.prepare(
      `INSERT INTO logs_erro (id, tipo_job, usuario_id, ativo_id, mensagem, stack, contexto_json)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id,
      payload.tipo_job ?? null,
      payload.usuario_id ?? null,
      payload.ativo_id ?? null,
      payload.mensagem,
      payload.stack ?? null,
      payload.contexto == null ? null : JSON.stringify(payload.contexto)
    ).run();
    return id;
  }
  async listRecentExecutions(limit = 50) {
    const { results } = await this.db.prepare(
      `SELECT id, tipo, iniciado_em, finalizado_em, status, detalhes, qtd_processada, qtd_erros
           FROM execucoes_job
       ORDER BY iniciado_em DESC
          LIMIT ?`
    ).bind(limit).all();
    return results;
  }
  async listRecentErrors(limit = 50) {
    const { results } = await this.db.prepare(
      `SELECT id, ocorrido_em, tipo_job, usuario_id, ativo_id, mensagem, stack, contexto_json
           FROM logs_erro
       ORDER BY ocorrido_em DESC
          LIMIT ?`
    ).bind(limit).all();
    return results;
  }
};

// src/controllers/admin.controller.ts
function requireAdmin(ctx) {
  const user = requireUser(ctx);
  if (user.perfil !== "ADMIN") {
    throw new AppError(403, "403", "Acesso negado.");
  }
  return user;
}
__name(requireAdmin, "requireAdmin");
function registerAdminController(router) {
  router.get("/api/v1/admin/summary", async (ctx) => {
    requireAdmin(ctx);
    const db = ctx.env.DB;
    const usersRow = await db.prepare(`SELECT COUNT(1) as c FROM usuarios WHERE excluido_em IS NULL`).first();
    const subsRow = await db.prepare(`SELECT COUNT(1) as c FROM inscricoes_push WHERE valida = 1`).first();
    const watchRow = await db.prepare(`SELECT COUNT(1) as c FROM itens_watchlist WHERE ativo = 1`).first();
    const assetsRow = await db.prepare(`SELECT COUNT(1) as c FROM ativos WHERE ativo = 1`).first();
    return jsonResponse({
      totals: {
        users: usersRow?.c ?? 0,
        push_subscriptions_valid: subsRow?.c ?? 0,
        watchlist_items_active: watchRow?.c ?? 0,
        assets_active: assetsRow?.c ?? 0
      }
    });
  });
  router.get("/api/v1/admin/jobs/recent", async (ctx) => {
    requireAdmin(ctx);
    const repo = new JobRepository(ctx.env.DB);
    const jobs = await repo.listRecentExecutions(50);
    return jsonResponse({ jobs });
  });
  router.get("/api/v1/admin/errors/recent", async (ctx) => {
    requireAdmin(ctx);
    const repo = new JobRepository(ctx.env.DB);
    const errors = await repo.listRecentErrors(50);
    return jsonResponse({ errors });
  });
}
__name(registerAdminController, "registerAdminController");

// src/jobs/scheduler.ts
init_modules_watch_stub();

// src/repositories/feature_flags.repository.ts
init_modules_watch_stub();
var FeatureFlagsRepository = class {
  constructor(db) {
    this.db = db;
  }
  static {
    __name(this, "FeatureFlagsRepository");
  }
  async isEnabledGlobal(chave) {
    const row = await this.db.prepare(`SELECT habilitada FROM feature_flags WHERE chave = ? AND escopo = 'GLOBAL' LIMIT 1`).bind(chave).first();
    if (!row) return true;
    return row.habilitada === 1;
  }
  async listGlobal() {
    const { results } = await this.db.prepare(`SELECT * FROM feature_flags WHERE escopo = 'GLOBAL' ORDER BY chave`).all();
    return results;
  }
};

// src/jobs/price_polling.job.ts
init_modules_watch_stub();
function isConditionMet(alert, price) {
  if (alert.condicao === "ACIMA_OU_IGUAL") return price >= alert.preco_alvo;
  if (alert.condicao === "ABAIXO_OU_IGUAL") return price <= alert.preco_alvo;
  return false;
}
__name(isConditionMet, "isConditionMet");
function minutesBetween(aIso, bIso) {
  const a = new Date(aIso).getTime();
  const b = new Date(bIso).getTime();
  if (Number.isNaN(a) || Number.isNaN(b)) return Number.POSITIVE_INFINITY;
  return Math.abs(a - b) / 6e4;
}
__name(minutesBetween, "minutesBetween");
async function runPricePolling(env, meta) {
  const jobRepo = new JobRepository(env.DB);
  const execId = await jobRepo.startExecution("POLLING_PRECO", { cron: meta?.cron ?? null });
  const watchlistRepo = new WatchlistRepository(env.DB);
  const alertRepo = new AlertRepository(env.DB);
  const assetRepo = new AssetRepository(env.DB);
  const notifRepo = new NotificationRepository(env.DB);
  const market = new MarketDataService(env);
  let processed = 0;
  let alertsTriggered = 0;
  let errors = 0;
  try {
    const watchIds = await watchlistRepo.listDistinctActiveAssetIds();
    const alertIds = await alertRepo.listDistinctActiveAssetIds();
    const assetIds = Array.from(/* @__PURE__ */ new Set([...watchIds, ...alertIds]));
    if (assetIds.length === 0) {
      await jobRepo.finishExecution(execId, "SUCESSO", { qtdProcessada: 0, qtdErros: 0, detalhes: { note: "no-assets" } });
      return { processed: 0, alertsTriggered: 0, errors: 0 };
    }
    const alerts = await alertRepo.listActiveByAssetIds(assetIds);
    const alertsByAsset = /* @__PURE__ */ new Map();
    for (const a of alerts) {
      if (!alertsByAsset.has(a.ativo_id)) alertsByAsset.set(a.ativo_id, []);
      alertsByAsset.get(a.ativo_id).push(a);
    }
    for (const assetId of assetIds) {
      const asset = await assetRepo.getById(assetId);
      if (!asset) continue;
      try {
        const quote = await market.fetchQuote(asset.ticker, asset.tipo);
        if (!quote) continue;
        if (!asset.nome_curto && quote.nameShort) {
          await assetRepo.updateNameShort(asset.id, quote.nameShort);
        }
        await assetRepo.insertQuote({
          id: crypto.randomUUID(),
          ativo_id: asset.id,
          preco: quote.price,
          cotado_em: quote.quotedAt,
          buscado_em: (/* @__PURE__ */ new Date()).toISOString(),
          fonte: quote.source
        });
        processed += 1;
        const assetAlerts = alertsByAsset.get(asset.id) ?? [];
        if (assetAlerts.length === 0) continue;
        for (const alert of assetAlerts) {
          if (!isConditionMet(alert, quote.price)) continue;
          if (alert.ultimo_disparo_em) {
            const mins = minutesBetween(alert.ultimo_disparo_em, (/* @__PURE__ */ new Date()).toISOString());
            if (mins < (alert.cooldown_minutos ?? 30)) {
              continue;
            }
          }
          await alertRepo.createFireEvent({
            id: crypto.randomUUID(),
            alerta_id: alert.id,
            usuario_id: alert.usuario_id,
            ativo_id: alert.ativo_id,
            preco_observado: quote.price,
            motivo: "CONDICAO_ATINGIDA"
          });
          await alertRepo.markFired(alert.id);
          const condText = alert.condicao === "ACIMA_OU_IGUAL" ? "acima/igual" : "abaixo/igual";
          const title = `Alerta: ${asset.ticker} ${condText} ${alert.preco_alvo}`;
          const body = `Pre\xE7o observado: ${quote.price} (${quote.quotedAt}).`;
          await notifRepo.createMessage({
            id: crypto.randomUUID(),
            usuario_id: alert.usuario_id,
            tipo: "ALERTA_PRECO",
            canal: "PUSH",
            titulo: title,
            corpo: body,
            deep_link: `/ativos/${asset.ticker}`
          });
          alertsTriggered += 1;
        }
      } catch (e) {
        errors += 1;
        await jobRepo.logError({
          tipo_job: "POLLING_PRECO",
          ativo_id: assetId,
          mensagem: e?.message ?? "Erro no polling de pre\xE7o",
          stack: e?.stack,
          contexto: { assetId }
        });
      }
    }
    await jobRepo.finishExecution(execId, errors === 0 ? "SUCESSO" : "PARCIAL", {
      qtdProcessada: processed,
      qtdErros: errors,
      detalhes: { alertsTriggered }
    });
    return { processed, alertsTriggered, errors };
  } catch (e) {
    await jobRepo.finishExecution(execId, "FALHA", {
      qtdProcessada: processed,
      qtdErros: errors + 1,
      detalhes: { error: e?.message ?? "unknown" }
    });
    throw e;
  }
}
__name(runPricePolling, "runPricePolling");

// src/jobs/news_collection.job.ts
init_modules_watch_stub();

// src/services/news.service.ts
init_modules_watch_stub();
var import_fast_xml_parser = __toESM(require_fxp(), 1);

// src/lib/crypto.ts
init_modules_watch_stub();
async function sha256Hex(input) {
  const enc = new TextEncoder();
  const data = enc.encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  const bytes = Array.from(new Uint8Array(buf));
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(sha256Hex, "sha256Hex");

// src/services/news.service.ts
var NewsService = class {
  constructor(env, assetRepo, newsRepo) {
    this.env = env;
    this.assetRepo = assetRepo;
    this.newsRepo = newsRepo;
  }
  static {
    __name(this, "NewsService");
  }
  async collectForTickers(tickers, opts) {
    const hours = opts?.hours ?? 24;
    const uniq = Array.from(new Set(tickers.map((t) => t.trim().toUpperCase()).filter(Boolean)));
    let inserted = 0;
    let linked = 0;
    const parser = new import_fast_xml_parser.XMLParser({ ignoreAttributes: false });
    for (const ticker of uniq) {
      const asset = await this.ensureAssetExists(ticker);
      if (!asset) continue;
      const url = this.buildGoogleNewsRssUrl(ticker, hours);
      const res = await fetch(url.toString(), { headers: { "user-agent": "FinancialSecretaryBot/1.0" } });
      if (!res.ok) continue;
      const xml = await res.text();
      const parsed = parser.parse(xml);
      const items = parsed?.rss?.channel?.item;
      const list = Array.isArray(items) ? items : items ? [items] : [];
      for (const it of list) {
        const title = it?.title || "";
        const link = it?.link || "";
        const pubDate = it?.pubDate;
        if (!title || !link) continue;
        const { titulo, fonte } = splitTitle(title);
        const hash = await sha256Hex(`${titulo}||${fonte || ""}`.toLowerCase());
        const insertedRow = await this.newsRepo.insertNews({
          url: link,
          fonte,
          titulo,
          trecho: it?.description ? String(it.description).slice(0, 500) : null,
          publicado_em: pubDate ? new Date(pubDate).toISOString() : null,
          hash_dedupe: hash
        });
        if (insertedRow.created) inserted++;
        await this.newsRepo.linkNewsToAsset(asset.id, insertedRow.id);
        linked++;
      }
    }
    return { tickers: uniq.length, inserted, linked };
  }
  async listNewsForTicker(ticker, limit = 20) {
    const asset = await this.assetRepo.getByTicker(ticker.trim().toUpperCase());
    if (!asset) return [];
    return await this.newsRepo.listNewsForAsset(asset.id, limit);
  }
  buildGoogleNewsRssUrl(ticker, hours) {
    const query = `${ticker} when:${Math.max(1, Math.floor(hours / 24))}d`;
    const url = new URL("https://news.google.com/rss/search");
    url.searchParams.set("q", query);
    url.searchParams.set("hl", "pt-BR");
    url.searchParams.set("gl", "BR");
    url.searchParams.set("ceid", "BR:pt-419");
    return url;
  }
  async ensureAssetExists(ticker) {
    const existing = await this.assetRepo.getByTicker(ticker);
    if (existing) return existing;
    await this.assetRepo.upsertAsset({
      ticker,
      nome_curto: null,
      tipo: ["BTC", "ETH", "SOL"].includes(ticker) ? "CRIPTO" : ticker.endsWith("11") ? "FII" : "ACAO",
      bolsa: ["BTC", "ETH", "SOL"].includes(ticker) ? "GLOBAL" : "B3"
    });
    return await this.assetRepo.getByTicker(ticker);
  }
};
function splitTitle(title) {
  const idx = title.lastIndexOf(" - ");
  if (idx > 0) {
    return { titulo: title.slice(0, idx).trim(), fonte: title.slice(idx + 3).trim() };
  }
  return { titulo: title.trim(), fonte: null };
}
__name(splitTitle, "splitTitle");

// src/jobs/news_collection.job.ts
async function runNewsCollection(env, meta) {
  const jobRepo = new JobRepository(env.DB);
  const execId = await jobRepo.startExecution("COLETA_NOTICIAS", { cron: meta?.cron ?? null, sinceHours: meta?.sinceHours ?? null });
  const watchRepo = new WatchlistRepository(env.DB);
  const assetRepo = new AssetRepository(env.DB);
  const newsRepo = new NewsRepository(env.DB);
  const service = new NewsService(env, newsRepo);
  let errors = 0;
  let saved = 0;
  try {
    const assetIds = await watchRepo.listDistinctActiveAssetIds();
    const tickers = [];
    for (const id of assetIds) {
      const a = await assetRepo.getById(id);
      if (a?.ticker) tickers.push(a.ticker);
    }
    if (tickers.length === 0) {
      await jobRepo.finishExecution(execId, "SUCESSO", { qtdProcessada: 0, qtdErros: 0, detalhes: { note: "no-tickers" } });
      return { tickers: 0, saved: 0, errors: 0 };
    }
    try {
      const { saved: s } = await service.collectForTickers(tickers, { hours: meta?.sinceHours ?? 24 });
      saved = s;
    } catch (e) {
      errors += 1;
      await jobRepo.logError({ tipo_job: "COLETA_NOTICIAS", mensagem: e?.message ?? "Erro coletando not\xEDcias", stack: e?.stack });
    }
    await jobRepo.finishExecution(execId, errors === 0 ? "SUCESSO" : "PARCIAL", {
      qtdProcessada: tickers.length,
      qtdErros: errors,
      detalhes: { saved }
    });
    return { tickers: tickers.length, saved, errors };
  } catch (e) {
    await jobRepo.finishExecution(execId, "FALHA", { qtdProcessada: 0, qtdErros: errors + 1, detalhes: { error: e?.message ?? "unknown" } });
    throw e;
  }
}
__name(runNewsCollection, "runNewsCollection");

// src/jobs/digest_generation.job.ts
init_modules_watch_stub();

// src/services/openai.service.ts
init_modules_watch_stub();
var OpenAIService = class {
  constructor(env) {
    this.env = env;
  }
  static {
    __name(this, "OpenAIService");
  }
  hasKey() {
    return !!this.env.OPENAI_API_KEY;
  }
  async summarizeDailyDigest(input) {
    if (!this.env.OPENAI_API_KEY) {
      const bullets = input.items.slice(0, 8).map((x) => x.titulo);
      const summary = bullets.slice(0, 5).join("\n");
      return { summary, bullets };
    }
    const model = this.env.OPENAI_MODEL || "gpt-4o-mini";
    const system = input.language === "en" ? "You are a helpful assistant that summarizes financial news for retail investors. Be concise and factual." : "Voc\xEA \xE9 um assistente que resume not\xEDcias financeiras para investidores pessoa f\xEDsica. Seja conciso e factual.";
    const prompt = {
      tickers: input.tickers,
      items: input.items.slice(0, 12)
    };
    const body = {
      model,
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: (input.language === "en" ? "Summarize the following news into 3-10 headlines and bullet points. Return JSON with fields: summary (string) and bullets (array of strings)." : "Resuma as not\xEDcias abaixo em 3-10 manchetes e bullets de pontos principais. Retorne JSON com os campos: summary (string) e bullets (array de strings).") + "\n\n" + JSON.stringify(prompt)
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    };
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${this.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const t = await res.text();
      const bullets = input.items.slice(0, 8).map((x) => x.titulo);
      return { summary: (t || "").slice(0, 400), bullets };
    }
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    try {
      const parsed = JSON.parse(content);
      const summary = typeof parsed.summary === "string" ? parsed.summary : "";
      const bullets = Array.isArray(parsed.bullets) ? parsed.bullets.filter((x) => typeof x === "string").slice(0, 12) : [];
      return { summary, bullets };
    } catch {
      const bullets = input.items.slice(0, 8).map((x) => x.titulo);
      return { summary: String(content || "").slice(0, 600), bullets };
    }
  }
};

// src/jobs/digest_generation.job.ts
function formatLocalDate(timeZone, now) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(now);
}
__name(formatLocalDate, "formatLocalDate");
function formatLocalTime(timeZone, now) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit"
  }).format(now);
  return parts;
}
__name(formatLocalTime, "formatLocalTime");
async function runDigestGeneration(env, meta) {
  const jobRepo = new JobRepository(env.DB);
  const execId = await jobRepo.startExecution("GERAR_RESUMO", { cron: meta?.cron ?? null, force: meta?.force ?? false });
  const prefsRepo = new PreferencesRepository(env.DB);
  const watchRepo = new WatchlistRepository(env.DB);
  const newsRepo = new NewsRepository(env.DB);
  const digestRepo = new DigestRepository(env.DB);
  const notifRepo = new NotificationRepository(env.DB);
  const openai = new OpenAIService(env);
  const now = /* @__PURE__ */ new Date();
  let usersChecked = 0;
  let digestsCreated = 0;
  let errors = 0;
  try {
    const users = await prefsRepo.listDailyDigestUsers();
    for (const u of users) {
      usersChecked += 1;
      try {
        const tz = u.fuso_horario || "America/Sao_Paulo";
        const localDate = formatLocalDate(tz, now);
        const localTime = formatLocalTime(tz, now);
        const prefTime = (u.horario_resumo || "08:00").trim();
        if (!meta?.force) {
          if (prefTime.length >= 4 && localTime !== prefTime) continue;
        }
        const existing = await digestRepo.getDigestByUserAndDate(u.usuario_id, localDate);
        if (existing && existing.enviado_em) continue;
        const watchItems = await watchRepo.listByUser(u.usuario_id);
        const tickers = watchItems.map((w) => w.ticker).filter(Boolean);
        if (tickers.length === 0) continue;
        const news = await newsRepo.listNewsForUserWatchlist(u.usuario_id, 24, 30);
        let texto_resumo = "";
        let provedor_modelo = null;
        let nome_modelo = null;
        if (env.OPENAI_API_KEY && news.length > 0) {
          provedor_modelo = "openai";
          nome_modelo = env.OPENAI_MODEL ?? "unknown";
          const inputNews = news.slice(0, 12).map((n) => ({
            titulo: n.titulo,
            fonte: n.fonte,
            publicado_em: n.publicado_em,
            url: n.url
          }));
          const summary = await openai.summarizeDailyDigest({
            tickers,
            news: inputNews
          });
          const bullets = summary.bullets?.length ? summary.bullets.map((b) => `\u2022 ${b}`).join("\n") : "";
          texto_resumo = `${summary.summary}

${bullets}`.trim();
        } else {
          const top = news.slice(0, 8);
          if (top.length === 0) {
            texto_resumo = `Sem not\xEDcias relevantes nas \xFAltimas 24h para: ${tickers.join(", ")}.`;
          } else {
            const lines = top.map((n) => `\u2022 ${n.titulo}${n.fonte ? ` (${n.fonte})` : ""}`);
            texto_resumo = `Principais not\xEDcias (\xFAltimas 24h) para: ${tickers.join(", ")}

${lines.join("\n")}`;
          }
        }
        const digestId = existing?.id ?? crypto.randomUUID();
        await digestRepo.upsertDigest({
          id: digestId,
          usuario_id: u.usuario_id,
          data_resumo: localDate,
          provedor_modelo,
          nome_modelo,
          texto_resumo
        });
        const digestItems = news.slice(0, 10).map((n, idx) => ({
          id: crypto.randomUUID(),
          resumo_id: digestId,
          noticia_id: n.id,
          ativo_id: n.ativo_id ?? null,
          bullets: null,
          ordem: idx
        }));
        await digestRepo.replaceDigestItems(digestId, digestItems);
        const title = `Resumo di\xE1rio (${localDate})`;
        const deepLink = `digest:${digestId}`;
        const canal = (u.canal_padrao_noticias || "PUSH").toUpperCase();
        if (canal === "EMAIL") {
          await notifRepo.createMessage({
            id: crypto.randomUUID(),
            usuario_id: u.usuario_id,
            tipo: "RESUMO_DIARIO",
            canal: "EMAIL",
            titulo: title,
            corpo: texto_resumo,
            deep_link: deepLink
          });
        } else if (canal === "AMBOS") {
          await notifRepo.createMessage({
            id: crypto.randomUUID(),
            usuario_id: u.usuario_id,
            tipo: "RESUMO_DIARIO",
            canal: "PUSH",
            titulo: title,
            corpo: texto_resumo,
            deep_link: deepLink
          });
          await notifRepo.createMessage({
            id: crypto.randomUUID(),
            usuario_id: u.usuario_id,
            tipo: "RESUMO_DIARIO",
            canal: "EMAIL",
            titulo: title,
            corpo: texto_resumo,
            deep_link: deepLink
          });
        } else {
          await notifRepo.createMessage({
            id: crypto.randomUUID(),
            usuario_id: u.usuario_id,
            tipo: "RESUMO_DIARIO",
            canal: "PUSH",
            titulo: title,
            corpo: texto_resumo,
            deep_link: deepLink
          });
        }
        digestsCreated += 1;
      } catch (e) {
        errors += 1;
        await jobRepo.logError({
          tipo_job: "GERAR_RESUMO",
          usuario_id: u.usuario_id,
          mensagem: e?.message ?? "Erro gerando resumo",
          stack: e?.stack
        });
      }
    }
    await jobRepo.finishExecution(execId, errors === 0 ? "SUCESSO" : "PARCIAL", {
      qtdProcessada: digestsCreated,
      qtdErros: errors,
      detalhes: { usersChecked }
    });
    return { usersChecked, digestsCreated, errors };
  } catch (e) {
    await jobRepo.finishExecution(execId, "FALHA", {
      qtdProcessada: digestsCreated,
      qtdErros: errors + 1,
      detalhes: { error: e?.message ?? "unknown" }
    });
    throw e;
  }
}
__name(runDigestGeneration, "runDigestGeneration");

// src/jobs/dispatch_notifications.job.ts
init_modules_watch_stub();

// src/services/push.service.ts
init_modules_watch_stub();

// node_modules/@pushforge/builder/dist/lib/main.js
init_modules_watch_stub();

// node_modules/@pushforge/builder/dist/lib/request.js
init_modules_watch_stub();

// node_modules/@pushforge/builder/dist/lib/crypto.js
init_modules_watch_stub();
if (!globalThis.crypto?.subtle) {
  throw new Error("Web Crypto API not available. Ensure you are using Node.js 20+ or a modern runtime with globalThis.crypto support.");
}
var isomorphicCrypto = globalThis.crypto;
var crypto2 = {
  /**
   * Fills the given typed array with cryptographically secure random values.
   *
   * @param {T} array - The typed array to fill with random values.
   * @returns {T} The filled typed array.
   * @template T - The type of the typed array (e.g., Uint8Array).
   */
  getRandomValues(array) {
    return isomorphicCrypto.getRandomValues(array);
  },
  /**
   * Provides access to subtle cryptographic operations.
   *
   * @type {SubtleCrypto} The subtle cryptographic interface.
   */
  subtle: isomorphicCrypto.subtle
};

// node_modules/@pushforge/builder/dist/lib/payload.js
init_modules_watch_stub();

// node_modules/@pushforge/builder/dist/lib/base64.js
init_modules_watch_stub();

// node_modules/@pushforge/builder/dist/lib/utils.js
init_modules_watch_stub();
var stringFromArrayBuffer = /* @__PURE__ */ __name((s) => {
  let result = "";
  for (const code of new Uint8Array(s))
    result += String.fromCharCode(code);
  return result;
}, "stringFromArrayBuffer");
var base64Decode = /* @__PURE__ */ __name((base64String) => {
  const paddedBase64 = base64String.padEnd(base64String.length + (4 - (base64String.length % 4 || 4)) % 4, "=");
  if (typeof Buffer !== "undefined") {
    return Buffer.from(paddedBase64, "base64").toString("binary");
  }
  if (typeof atob === "function") {
    return atob(paddedBase64);
  }
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let result = "";
  let i = 0;
  while (i < paddedBase64.length) {
    const enc1 = characters.indexOf(paddedBase64.charAt(i++));
    const enc2 = characters.indexOf(paddedBase64.charAt(i++));
    const enc3 = characters.indexOf(paddedBase64.charAt(i++));
    const enc4 = characters.indexOf(paddedBase64.charAt(i++));
    const char1 = enc1 << 2 | enc2 >> 4;
    const char2 = (enc2 & 15) << 4 | enc3 >> 2;
    const char3 = (enc3 & 3) << 6 | enc4;
    result += String.fromCharCode(char1);
    if (enc3 !== 64)
      result += String.fromCharCode(char2);
    if (enc4 !== 64)
      result += String.fromCharCode(char3);
  }
  return result;
}, "base64Decode");
var getPublicKeyFromJwk = /* @__PURE__ */ __name((jwk) => base64UrlEncode(`${base64Decode(base64UrlDecodeString(jwk.x))}${base64Decode(base64UrlDecodeString(jwk.y))}`), "getPublicKeyFromJwk");
var concatTypedArrays = /* @__PURE__ */ __name((arrays) => {
  const length = arrays.reduce((accumulator, current) => accumulator + current.byteLength, 0);
  let index = 0;
  const targetArray = new Uint8Array(length);
  for (const array of arrays) {
    targetArray.set(array, index);
    index += array.byteLength;
  }
  return targetArray;
}, "concatTypedArrays");

// node_modules/@pushforge/builder/dist/lib/base64.js
var base64UrlEncode = /* @__PURE__ */ __name((input) => {
  const text = typeof input === "string" ? input : stringFromArrayBuffer(input);
  let base64;
  if (typeof globalThis !== "undefined" && "btoa" in globalThis) {
    base64 = globalThis.btoa(text);
  } else {
    base64 = Buffer.from(text, "binary").toString("base64");
  }
  return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}, "base64UrlEncode");
var base64UrlDecodeString = /* @__PURE__ */ __name((s) => {
  if (!s)
    throw new Error("Invalid input");
  return s.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - s.length % 4) % 4);
}, "base64UrlDecodeString");
var base64UrlDecode = /* @__PURE__ */ __name((input) => {
  const base64 = base64UrlDecodeString(input);
  if (typeof globalThis !== "undefined" && "atob" in globalThis) {
    const binaryString = globalThis.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
  return Buffer.from(base64, "base64").buffer;
}, "base64UrlDecode");

// node_modules/@pushforge/builder/dist/lib/shared-secret.js
init_modules_watch_stub();
var deriveSharedSecret = /* @__PURE__ */ __name(async (clientPublicKey, localPrivateKey) => {
  const sharedSecretBytes = await crypto2.subtle.deriveBits({ name: "ECDH", public: clientPublicKey }, localPrivateKey, 256);
  return crypto2.subtle.importKey("raw", sharedSecretBytes, { name: "HKDF" }, false, ["deriveBits", "deriveKey"]);
}, "deriveSharedSecret");

// node_modules/@pushforge/builder/dist/lib/payload.js
var importClientKeys = /* @__PURE__ */ __name(async (keys) => {
  const auth = base64UrlDecode(keys.auth);
  if (auth.byteLength !== 16) {
    throw new Error(`Incorrect auth length, expected 16 bytes but got ${auth.byteLength}`);
  }
  let decodedKey;
  const base64Key = base64UrlDecodeString(keys.p256dh);
  if (typeof globalThis !== "undefined" && "atob" in globalThis) {
    const binaryStr = globalThis.atob(base64Key);
    decodedKey = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      decodedKey[i] = binaryStr.charCodeAt(i);
    }
  } else {
    decodedKey = new Uint8Array(Buffer.from(base64Key, "base64"));
  }
  if (decodedKey.byteLength !== 65) {
    throw new Error(`Invalid p256dh key: expected 65 bytes but got ${decodedKey.byteLength} bytes`);
  }
  if (decodedKey[0] !== 4) {
    throw new Error(`Invalid p256dh key: expected uncompressed point format (0x04 prefix) but got 0x${decodedKey[0].toString(16).padStart(2, "0")}`);
  }
  const p256 = await crypto2.subtle.importKey("jwk", {
    kty: "EC",
    crv: "P-256",
    x: base64UrlEncode(decodedKey.slice(1, 33)),
    y: base64UrlEncode(decodedKey.slice(33, 65)),
    ext: true
  }, { name: "ECDH", namedCurve: "P-256" }, true, []);
  return { auth, p256 };
}, "importClientKeys");
var derivePseudoRandomKey = /* @__PURE__ */ __name(async (auth, sharedSecret) => {
  const pseudoRandomKeyBytes = await crypto2.subtle.deriveBits({
    name: "HKDF",
    hash: "SHA-256",
    salt: auth,
    // Adding Content-Encoding data info here is required by the Web Push API
    info: new TextEncoder().encode("Content-Encoding: auth\0")
  }, sharedSecret, 256);
  return crypto2.subtle.importKey("raw", pseudoRandomKeyBytes, "HKDF", false, [
    "deriveBits"
  ]);
}, "derivePseudoRandomKey");
var createContext = /* @__PURE__ */ __name(async (clientPublicKey, localPublicKey) => {
  const [clientKeyBytes, localKeyBytes] = await Promise.all([
    crypto2.subtle.exportKey("raw", clientPublicKey),
    crypto2.subtle.exportKey("raw", localPublicKey)
  ]);
  return concatTypedArrays([
    new TextEncoder().encode("P-256\0"),
    new Uint8Array([0, clientKeyBytes.byteLength]),
    new Uint8Array(clientKeyBytes),
    new Uint8Array([0, localKeyBytes.byteLength]),
    new Uint8Array(localKeyBytes)
  ]);
}, "createContext");
var deriveNonce = /* @__PURE__ */ __name(async (pseudoRandomKey, salt, context) => {
  const nonceInfo = concatTypedArrays([
    new TextEncoder().encode("Content-Encoding: nonce\0"),
    context
  ]);
  return crypto2.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt, info: nonceInfo }, pseudoRandomKey, 12 * 8);
}, "deriveNonce");
var deriveContentEncryptionKey = /* @__PURE__ */ __name(async (pseudoRandomKey, salt, context) => {
  const info = concatTypedArrays([
    new TextEncoder().encode("Content-Encoding: aesgcm\0"),
    context
  ]);
  const bits = await crypto2.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt, info }, pseudoRandomKey, 16 * 8);
  return crypto2.subtle.importKey("raw", bits, "AES-GCM", false, ["encrypt"]);
}, "deriveContentEncryptionKey");
var MAX_PAYLOAD_SIZE = 4078;
var PADDING_LENGTH_PREFIX_SIZE = 2;
var padPayload = /* @__PURE__ */ __name((payload) => {
  const maxPayloadContentSize = MAX_PAYLOAD_SIZE - PADDING_LENGTH_PREFIX_SIZE;
  if (payload.byteLength > maxPayloadContentSize) {
    throw new Error(`Payload too large. Maximum size is ${maxPayloadContentSize} bytes, but received ${payload.byteLength} bytes`);
  }
  const availableSpace = MAX_PAYLOAD_SIZE - PADDING_LENGTH_PREFIX_SIZE - payload.byteLength;
  const maxRandomPadding = Math.min(100, availableSpace);
  const paddingSize = maxRandomPadding > 0 ? Math.floor(Math.random() * (maxRandomPadding + 1)) : 0;
  const paddingArray = new ArrayBuffer(PADDING_LENGTH_PREFIX_SIZE + paddingSize);
  new DataView(paddingArray).setUint16(0, paddingSize);
  return concatTypedArrays([new Uint8Array(paddingArray), payload]);
}, "padPayload");
var encryptPayload = /* @__PURE__ */ __name(async (localKeys, salt, payload, target) => {
  const clientKeys = await importClientKeys(target.keys);
  const sharedSecret = await deriveSharedSecret(clientKeys.p256, localKeys.privateKey);
  const pseudoRandomKey = await derivePseudoRandomKey(clientKeys.auth, sharedSecret);
  const context = await createContext(clientKeys.p256, localKeys.publicKey);
  const nonce = await deriveNonce(pseudoRandomKey, salt, context);
  const contentEncryptionKey = await deriveContentEncryptionKey(pseudoRandomKey, salt, context);
  const encodedPayload = new TextEncoder().encode(payload);
  const paddedPayload = padPayload(encodedPayload);
  return crypto2.subtle.encrypt({ name: "AES-GCM", iv: nonce }, contentEncryptionKey, paddedPayload);
}, "encryptPayload");

// node_modules/@pushforge/builder/dist/lib/vapid.js
init_modules_watch_stub();

// node_modules/@pushforge/builder/dist/lib/jwt.js
init_modules_watch_stub();
var createJwt = /* @__PURE__ */ __name(async (jwk, jwtData) => {
  const jwtInfo = {
    typ: "JWT",
    // Type of the token
    alg: "ES256"
    // Algorithm used for signing
  };
  const base64JwtInfo = base64UrlEncode(JSON.stringify(jwtInfo));
  const base64JwtData = base64UrlEncode(JSON.stringify(jwtData));
  const unsignedToken = `${base64JwtInfo}.${base64JwtData}`;
  const privateKey = await crypto2.subtle.importKey("jwk", jwk, { name: "ECDSA", namedCurve: "P-256" }, true, ["sign"]);
  const signature = await crypto2.subtle.sign({ name: "ECDSA", hash: { name: "SHA-256" } }, privateKey, new TextEncoder().encode(unsignedToken)).then((token) => base64UrlEncode(token));
  return `${base64JwtInfo}.${base64JwtData}.${signature}`;
}, "createJwt");

// node_modules/@pushforge/builder/dist/lib/vapid.js
var vapidHeaders = /* @__PURE__ */ __name(async (options, payloadLength, salt, localPublicKey) => {
  const localPublicKeyBase64 = await crypto2.subtle.exportKey("raw", localPublicKey).then((bytes) => base64UrlEncode(bytes));
  const serverPublicKey = getPublicKeyFromJwk(options.jwk);
  const jwt = await createJwt(options.jwk, options.jwt);
  const headerValues = {
    Encryption: `salt=${base64UrlEncode(salt)}`,
    "Crypto-Key": `dh=${localPublicKeyBase64}`,
    "Content-Length": payloadLength.toString(),
    "Content-Type": "application/octet-stream",
    "Content-Encoding": "aesgcm",
    Authorization: `vapid t=${jwt}, k=${serverPublicKey}`
  };
  let headers;
  if (options.ttl !== void 0)
    headerValues.TTL = options.ttl.toString();
  if (options.topic !== void 0)
    headerValues.Topic = options.topic;
  if (options.urgency !== void 0)
    headerValues.Urgency = options.urgency;
  if (typeof Headers !== "undefined") {
    headers = new Headers(headerValues);
  } else {
    headers = headerValues;
  }
  return headers;
}, "vapidHeaders");

// node_modules/@pushforge/builder/dist/lib/request.js
var validatePrivateJWK = /* @__PURE__ */ __name((jwk) => {
  if (jwk.kty !== "EC") {
    throw new Error(`Invalid JWK: 'kty' must be 'EC', received '${jwk.kty ?? "undefined"}'`);
  }
  if (jwk.crv !== "P-256") {
    throw new Error(`Invalid JWK: 'crv' must be 'P-256', received '${jwk.crv ?? "undefined"}'`);
  }
  if (!jwk.x || typeof jwk.x !== "string") {
    throw new Error("Invalid JWK: missing or invalid 'x' coordinate");
  }
  if (!jwk.y || typeof jwk.y !== "string") {
    throw new Error("Invalid JWK: missing or invalid 'y' coordinate");
  }
  if (!jwk.d || typeof jwk.d !== "string") {
    throw new Error("Invalid JWK: missing or invalid 'd' (private key)");
  }
}, "validatePrivateJWK");
var validateEndpoint = /* @__PURE__ */ __name((endpoint) => {
  let url;
  try {
    url = new URL(endpoint);
  } catch {
    throw new Error(`Invalid subscription endpoint: '${endpoint}' is not a valid URL`);
  }
  if (url.protocol !== "https:") {
    throw new Error(`Invalid subscription endpoint: push endpoints must use HTTPS, received '${url.protocol}'`);
  }
}, "validateEndpoint");
async function buildPushHTTPRequest({ privateJWK, message: message2, subscription }) {
  let jwk;
  try {
    jwk = typeof privateJWK === "string" ? JSON.parse(privateJWK) : privateJWK;
  } catch {
    throw new Error("Invalid privateJWK: failed to parse JSON string");
  }
  validatePrivateJWK(jwk);
  validateEndpoint(subscription.endpoint);
  const MAX_TTL = 24 * 60 * 60;
  if (message2.options?.ttl && message2.options.ttl > MAX_TTL) {
    throw new Error("TTL must be less than 24 hours");
  }
  const ttl = message2.options?.ttl && message2.options.ttl > 0 ? message2.options.ttl : MAX_TTL;
  const jwt = {
    aud: new URL(subscription.endpoint).origin,
    exp: Math.floor(Date.now() / 1e3) + ttl,
    sub: message2.adminContact
  };
  const options = {
    jwk,
    jwt,
    payload: JSON.stringify(message2.payload),
    ttl,
    ...message2.options?.urgency && {
      urgency: message2.options.urgency
    },
    ...message2.options?.topic && {
      topic: message2.options.topic
    }
  };
  const salt = crypto2.getRandomValues(new Uint8Array(16));
  const localKeys = await crypto2.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
  const body = await encryptPayload(localKeys, salt, options.payload, subscription);
  const headers = await vapidHeaders(options, body.byteLength, salt, localKeys.publicKey);
  return { endpoint: subscription.endpoint, body, headers };
}
__name(buildPushHTTPRequest, "buildPushHTTPRequest");

// src/services/push.service.ts
var PushService = class {
  constructor(env) {
    this.env = env;
  }
  static {
    __name(this, "PushService");
  }
  getAdminContact() {
    const c = this.env.PUSH_SUBJECT || this.env.CONTACT_EMAIL || "";
    if (!c) return "mailto:admin@example.com";
    if (c.startsWith("mailto:") || c.startsWith("https://") || c.startsWith("http://")) return c;
    if (c.includes("@")) return `mailto:${c}`;
    return c;
  }
  parsePrivateJwk() {
    if (!this.env.VAPID_PRIVATE_KEY) throw new Error("VAPID_PRIVATE_KEY not configured");
    try {
      return JSON.parse(this.env.VAPID_PRIVATE_KEY);
    } catch {
      throw new Error("VAPID_PRIVATE_KEY must be a JSON JWK string");
    }
  }
  async send(params) {
    const privateJWK = this.parsePrivateJwk();
    const subscription = {
      endpoint: params.subscription.endpoint,
      keys: {
        p256dh: params.subscription.p256dh,
        auth: params.subscription.auth
      }
    };
    const { endpoint, headers, body } = await buildPushHTTPRequest({
      privateJWK,
      subscription,
      message: {
        payload: params.payload,
        adminContact: this.getAdminContact(),
        ttl: params.ttlSeconds ?? 900
      }
    });
    const res = await fetch(endpoint, { method: "POST", headers, body });
    const text = await res.text().catch(() => void 0);
    return { ok: res.ok, status: res.status, responseText: text };
  }
};

// src/jobs/dispatch_notifications.job.ts
function extractDigestId(deepLink) {
  if (!deepLink) return null;
  if (!deepLink.startsWith("digest:")) return null;
  return deepLink.slice("digest:".length) || null;
}
__name(extractDigestId, "extractDigestId");
function toEmailHtml(title, body) {
  const safeBody = (body ?? "").replace(/\n/g, "<br/>");
  return `<h2>${title}</h2><p>${safeBody}</p>`;
}
__name(toEmailHtml, "toEmailHtml");
async function trySendPush(push, notifRepo, msg) {
  const subs = await notifRepo.listValidSubscriptionsByUser(msg.usuario_id);
  if (subs.length === 0) return { sent: false, reason: "no_push_subscription" };
  let ok = 0;
  for (const s of subs) {
    try {
      await push.sendNotification(
        {
          endpoint: s.endpoint,
          keys: { p256dh: s.p256dh, auth: s.auth }
        },
        {
          title: msg.titulo,
          body: msg.corpo ?? void 0,
          url: msg.deep_link ?? void 0
        }
      );
      ok += 1;
    } catch (e) {
      const status = e?.statusCode ?? e?.status;
      if (status === 404 || status === 410) {
        await notifRepo.invalidateSubscription(s.id);
      }
    }
  }
  if (ok > 0) return { sent: true };
  return { sent: false, reason: "push_failed" };
}
__name(trySendPush, "trySendPush");
async function trySendEmail(env, emailSvc, userRepo, msg) {
  const u = await userRepo.getById(msg.usuario_id);
  if (!u?.email) return { sent: false, reason: "no_email" };
  try {
    const res = await emailSvc.sendNotificationEmail({
      to: u.email,
      subject: msg.titulo,
      html: toEmailHtml(msg.titulo, msg.corpo),
      text: msg.corpo ?? void 0
    });
    if (res?.skipped) return { sent: false, reason: "email_not_configured" };
    return { sent: true };
  } catch (e) {
    return { sent: false, reason: "email_failed" };
  }
}
__name(trySendEmail, "trySendEmail");
async function runDispatchNotifications(env, meta) {
  const jobRepo = new JobRepository(env.DB);
  const execId = await jobRepo.startExecution("DISPARO_NOTIFICACOES", { cron: meta?.cron ?? null, limit: meta?.limit ?? null });
  const notifRepo = new NotificationRepository(env.DB);
  const userRepo = new UserRepository(env.DB);
  const digestRepo = new DigestRepository(env.DB);
  const push = new PushService(env);
  const emailSvc = new EmailService(env);
  const limit = meta?.limit ?? 100;
  const pending = await notifRepo.listPendingMessages(limit);
  let processed = 0;
  let sent = 0;
  let failed = 0;
  let ignored = 0;
  for (const msg of pending) {
    processed += 1;
    try {
      if (msg.canal === "PUSH") {
        const r = await trySendPush(push, notifRepo, msg);
        if (r.sent) {
          await notifRepo.markMessageSent(msg.id);
          sent += 1;
          const d = extractDigestId(msg.deep_link);
          if (d) await digestRepo.markDigestSent(d);
        } else {
          await notifRepo.markMessageIgnored(msg.id, r.reason ?? "push_not_sent");
          ignored += 1;
          const fallbackId = crypto.randomUUID();
          await notifRepo.createMessage({
            id: fallbackId,
            usuario_id: msg.usuario_id,
            tipo: msg.tipo,
            canal: "EMAIL",
            titulo: msg.titulo,
            corpo: msg.corpo,
            deep_link: msg.deep_link
          });
        }
      } else {
        const r = await trySendEmail(env, emailSvc, userRepo, msg);
        if (r.sent) {
          await notifRepo.markMessageSent(msg.id);
          sent += 1;
          const d = extractDigestId(msg.deep_link);
          if (d) await digestRepo.markDigestSent(d);
        } else if (r.reason === "email_not_configured") {
          await notifRepo.markMessageIgnored(msg.id, "email_not_configured");
          ignored += 1;
        } else {
          await notifRepo.markMessageFailed(msg.id, r.reason ?? "email_failed");
          failed += 1;
        }
      }
    } catch (e) {
      failed += 1;
      await notifRepo.markMessageFailed(msg.id, e?.message ?? "dispatch_failed");
      await jobRepo.logError({ tipo_job: "DISPARO_NOTIFICACOES", usuario_id: msg.usuario_id, mensagem: e?.message ?? "Erro disparando", stack: e?.stack });
    }
  }
  await jobRepo.finishExecution(execId, failed === 0 ? "SUCESSO" : "PARCIAL", {
    qtdProcessada: processed,
    qtdErros: failed,
    detalhes: { sent, ignored }
  });
  return { processed, sent, failed, ignored };
}
__name(runDispatchNotifications, "runDispatchNotifications");

// src/jobs/scheduler.ts
async function flagEnabled(flags, key) {
  try {
    return await flags.isEnabled(key);
  } catch {
    return true;
  }
}
__name(flagEnabled, "flagEnabled");
async function handleScheduled(event, env) {
  const cron = event.cron ?? "";
  const flags = new FeatureFlagsRepository(env.DB);
  const runPolling = cron.includes("*/15") || cron.startsWith("*/15");
  const runHourly = cron === "0 * * * *";
  const runDaily = cron === "10 11 * * * *";
  if (runPolling && await flagEnabled(flags, "JOB_POLLING_PRECO")) {
    await runPricePolling(env, { cron });
  }
  if (runHourly && await flagEnabled(flags, "JOB_COLETA_NOTICIAS")) {
    await runNewsCollection(env, { cron, windowHours: 2 });
  }
  if (runHourly && await flagEnabled(flags, "JOB_GERAR_RESUMO")) {
    await runDigestGeneration(env, { cron, force: false });
  }
  if (runDaily && await flagEnabled(flags, "JOB_GERAR_RESUMO")) {
    await runDigestGeneration(env, { cron, force: true });
  }
  if (await flagEnabled(flags, "JOB_DISPARO_PUSH") || await flagEnabled(flags, "JOB_DISPARO_EMAIL")) {
    await runDispatchNotifications(env, { cron, limit: 150 });
  }
}
__name(handleScheduled, "handleScheduled");

// src/index.ts
function buildRouter(env) {
  const router = new Router();
  router.use(errorMiddleware);
  router.use(corsMiddleware);
  router.use(authMiddleware);
  router.use(requireAuthMiddleware);
  registerDocsController(router);
  registerAuthController(router);
  registerAccountController(router);
  registerPreferencesController(router);
  registerAssetsController(router);
  registerWatchlistController(router);
  registerAlertsController(router);
  registerCryptoController(router);
  registerNewsController(router);
  registerDigestController(router);
  registerNotificationsController(router);
  registerDashboardController(router);
  registerAdminController(router);
  router.get("/", async () => new Response("FinancialSecretary Worker API"));
  return router;
}
__name(buildRouter, "buildRouter");
var src_default = {
  async fetch(request, env, ctx) {
    const router = buildRouter(env);
    return router.handle(request, env);
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil(handleScheduled(event, env));
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_modules_watch_stub();
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_modules_watch_stub();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-Dq0ngM/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
init_modules_watch_stub();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-Dq0ngM/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
