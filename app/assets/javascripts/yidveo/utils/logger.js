/**
 * @fileOverview This file defines logger helper.
 * @author Vidyo Inc.
 * @version 1.0.0
 */
/*jslint browser: true, indent : 4, nomen : true, maxerr : 10, vars: true */
/*global requirejs: false, bootstrap: false, handlebars: false, define: false, jquery: false, jQuery: false, Handlebars: false */

var logger = function () {
    var self = this;
    self._levels = ["all", "log", "debug", "info", "warning", "error", "none"];
    self.levelsCategories = {all: true, none: false};
    self.enabledStackTrace = true;
    self.detectSlowBrowsers = true;
    self._slowBrowserDetected = false;

    /* Return padded string or original string if padding does not fit */
    var _padString = function(str, strPaddedLen, padChar) {
        var paddedLen = strPaddedLen - str.length;
        if (paddedLen > 0) {
           var padding = Array(paddedLen + 1).join(padChar);
           return padding + str;
        }
        return str;
    };

    var _getCurrentTime = function () {
        var currentdate = new Date();
        var datetime =  _padString((currentdate.getMonth() + 1).toString(), 2, '0') + "/"
                        + _padString(currentdate.getDate().toString(), 2, '0') + "/"
                        + currentdate.getFullYear() + " "
                        + _padString(currentdate.getHours().toString(), 2, '0') + ":"
                        + _padString(currentdate.getMinutes().toString(), 2, '0') + ":"
                        + _padString(currentdate.getSeconds().toString(), 2, '0') + "."
                        + _padString(currentdate.getMilliseconds().toString(), 3, '0');
        return datetime;
    };

    var _getStack = function () { // looked up at http://stackoverflow.com/questions/4671031/print-function-log-stack-trace-for-entire-program-using-firebug
        var callstack = [];
        var isCallstackPopulated = false;
        var lines, i, len;
        try {
            i.dont.exist += 0; //doesn't exist- that's the point
        } catch (e) {
            if (e.stack) { //Firefox / chrome
                lines = e.stack.split('\n');
                for (i = 0, len = lines.length; i < len; i++) {
                    callstack.push(lines[i]);
                }
                //Remove call to logStackTrace()
                callstack.shift();
                isCallstackPopulated = true;
            } else if (window.opera && e.message) { //Opera
                var entry;
                lines = e.message.split('\n');
                for (i = 0, len = lines.length; i < len; i++) {
                    if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
                        entry = lines[i];
                        //Append next line also since it has the file info
                        if (lines[i + 1]) {
                            entry += lines[i + 1];
                            i++;
                        }
                        callstack.push(entry);
                    }
                }
                //Remove call to logStackTrace()
                callstack.shift();
                isCallstackPopulated = true;
            }
        }
        if (!isCallstackPopulated) { //IE and Safari
            var currentFunction = arguments.callee.caller; // This is violation of strict mode of ES5, but the use case is valid
            var fn;
            var fname;
            while (currentFunction) {
                fn = currentFunction.toString();
                fname = fn.substring(fn.indexOf("function") + 8, fn.indexOf("(")) || "anonymous";
                callstack.push(fname);
                currentFunction = currentFunction.caller;
            }
        }
        return callstack;
    };

    var _getParams = function (args) {
        var params = [], i;
        params.push("" + _getCurrentTime() + " - ");
        params.push("[" + args[0] + "]");
        params.push("[" + args[1] + "]");
        if (args && (args.length > 2)) {
            for (i = 2; i < args.length; i++) {
                params.push(args[i]);
            }
        }
        try {
            if (self.enabledStackTrace) {
                params.push({
                    stacktrace: _getStack().slice(3)
                });
            }
        } catch (ignore) {}
        return params;
    };
    var _shouldLog = function (self, level, category) {

        if (self.levelsCategories["none"]) {
            return false;
        }

        if (self.levelsCategories["all"]) {
            return true;
        }

        var askLevel = self._levels.indexOf(level);
        var minLevel = self._levels.indexOf(self.levelsCategories[category]);

        if (askLevel == -1 || minLevel == -1) {
            return false;
        }

        if (askLevel >= minLevel) {
            return true;
        } else {
            return false;
        }
    };

    self._stringifyOnce = function(obj, replacer, indent){
        var printedObjects = [];
        var printedObjectKeys = [];

        function printOnceReplacer(key, value){
            var printedObjIndex = false;
            for (var i = 0; i < printedObjects.length; i++) {
                if(printedObjects[i] === value){
                    printedObjIndex = i;
                }

            }

            if(printedObjIndex && typeof(value)=="object"){
                return "[OBJECT]";
            }else{
                var qualifiedKey = key || "(empty key)";
                printedObjects.push(value);
                printedObjectKeys.push(qualifiedKey);
                if(replacer){
                    return replacer(key, value);
                }else{
                    return value;
                }
            }
        }
        return JSON.stringify(obj, printOnceReplacer, indent);
    };

    self.setLevelsCategories = function(levelsCategories) {
        self.levelsCategories = levelsCategories;
    };

    self.enable = function (enable) {
        self.levelsCategories["none"] = ! enable;
    };

    self.enableStackTrace = function (enable) {
        self.enabledStackTrace = enable;
    };
    self.log = function () {
        if (self.detectSlowBrowsers) {
            if (!console.log['apply'] && !self._slowBrowserDetected) {

                console.log("This browser is very slow with logs on. Disabling logging. You can change this behavior by setting 'logger.detectSlowBrowsers' to false.");
                self._slowBrowserDetected = true;
            }
        }

        if (self._slowBrowserDetected) {
            return;
        }

        if (_shouldLog(self, arguments[0], arguments[1])) {
            if (arguments[0] == "error") {
                self._error.apply(self, arguments);
            }
            else if (arguments[0] == "warning") {
                self._warn.apply(self, arguments);
            }
            else if (arguments[0] == "debug") {
                self._debug.apply(self, arguments);
            }
            else if (arguments[0] == "info") {
                self._info.apply(self, arguments);
            }
            else if (arguments[0] == "log") {
                self._log.apply(self, arguments);
            }
        }
    }

    self._jsonStringify = function(obj) {
            var jsonString = "";
            try {
                jsonString = JSON.stringify(arguments);
            }
            catch(err) {
                jsonString = "Failed to stringify. Debuging in this browser is not recommended";
            }
            return jsonString;
    };

    self._error = function () {
        if (console.error['apply']) {
            console.error.apply(console, _getParams(arguments));
        } else {
            console.error(self._jsonStringify(arguments));
        }
    };

    self._log = function () {
        if (console.log['apply']) {
            console.log.apply(console, _getParams(arguments));
        } else {
            console.log(self._jsonStringify(arguments));
        }
    };

    self._warn = function () {
        if (console.warn['apply']) {
            console.warn.apply(console, _getParams(arguments));
        } else {
            console.warn(self._jsonStringify(arguments));
        }
    };

    self._info = function () {
        if (!console.info)
            console.info = console.log;
        if (console.info['apply']) {
            console.info.apply(console, _getParams(arguments));
        } else {
            console.info(self._jsonStringify(arguments));
        }
    };

    self._debug = function () {
        if (!console.debug)
            console.debug = console.log;
        if (console.debug['apply']) {
            console.debug.apply(console, _getParams(arguments));
        } else {
            console.debug(self._jsonStringify(arguments));
        }
    };

    return self;
}();

