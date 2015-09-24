(function (window, angular) {

  angular.module('idex-json-visualizer', [
    'ngSanitize'
  ]);

})(window, window.angular);
(function (window, angular) {

  angular.module('idex-json-visualizer')

    .directive('idexBind', idexBindDirective);

  idexBindDirective.$inject = ['$compile', '$parse'];

  function idexBindDirective ($compile, $parse) {
    var directive = {};

    directive.link = link;

    return directive;

    function link (_scope, _element, _attributes) {
      var splitAttribute = _attributes.idexBind.trim().replace(/^\(/, '').replace(/\)$/, '').split('|'), value, filter;

      value = splitAttribute[0].trim();
      filter = splitAttribute[1].trim();

      _element[0].removeAttribute('idex-bind');
      _element[0].setAttribute('ng-bind', '(' + $parse(value)(_scope) + ' | ' + filter + ')');
      $compile(_element[0])(_scope);
    }
  }

})(window, window.angular);
(function (window, angular) {

  angular.module('idex-json-visualizer')

    .directive('idexCheckbox', idexJsonVisualizerDirective);

  idexJsonVisualizerDirective.$inject = ['$compile', '$parse', '$templateCache', '$window', 'jsonVisualizer', 'recursionHelper'];

  function idexJsonVisualizerDirective ($compile, $parse, $templateCache, $window, jsonVisualizer, recursionHelper) {
    var directive = {};

    directive.templateUrl = 'checkbox/idex-checkbox.directive.html';
    directive.scope = true;
    directive.compile = compile;

    return directive;

    function compile (_templateElement) {

      return {
        post: postLink
      };

      function postLink (_scope, _element, _attributes) {
        var modelAttributeName = $parse(_attributes.idexCheckbox)(_scope);

        _scope.modelName = (typeof modelAttributeName === 'string') ? modelAttributeName : _attributes.idexCheckbox;
        _scope.model = (typeof modelAttributeName === 'string') ? $parse(modelAttributeName)(_scope) : modelAttributeName;
        _scope.dummy = angular.copy(_scope.model);
        // At the moment, the blueprint is expected to have been normalized.
        _scope.blueprint = ((_attributes.hasOwnProperty('idexBlueprint')) ? $parse(_attributes.idexBlueprint)(_scope) : jsonVisualizer.converToBlueprint(angular.copy(_scope.model)));

        _scope.change = changeModel;
        _scope.contains = modelContains;

        function changeModel (model, value) {
          var index = model.indexOf(value);

          if (typeof model === 'string') model = $parse(model)(_scope);

          if (!~index) model.push(value);
          else model.splice(index, 1);
        }

        function modelContains (model, value) {

          return !~model.indexOf(value);
        }

      }
    }
  }

})(window, window.angular);

(function (window, angular) {

  angular.module('idex-json-visualizer')

    .directive('idexInput', idexInputDirective);

  idexInputDirective.$inject = ['$interpolate', '$parse', '$templateCache'];

  function idexInputDirective ($interpolate, $parse, $templateCache) {
    var directive = {};

    directive.templateUrl = 'json-visualizer/idex-input.directive.html';
    directive.compile = compile;

    return directive;

    function compile (_templateElement, templateAttributes) {

      return {
        pre: function (_scope, _element, attributes) {
          console.log($parse(attributes.idexInput)(_scope));
        }
      }
    }
  }

})(window, window.angular);
(function (window, angular) {

  angular.module('idex-json-visualizer')

    .filter('orderByWeight', orderByWeightFactory)

    .factory('recursionHelper', recursionHelperFactory)

    .directive('idexJsonVisualizer', idexJsonVisualizerDirective);

  function orderByWeightFactory () {

    return function (input) {

      return Object.keys(input)
        .map(function (key) {

          return input[key];
        })
        .sort(function (valueA, valueB) {
          if (valueA.weight > valueB.weight) return -1;
          else if (valueA.weight < valueB.weight) return 1;
          else return 0;
        });
    };
  }

  recursionHelperFactory.$inject = ['$compile'];

  function recursionHelperFactory ($compile) {

    return {
      compile: compile
    };

    function compile (_templateElement, link) {
      var contents = _templateElement.contents().remove(),
        compiledContents;

      if (angular.isFunction(link)) link = { post: link };

      return {
        pre: (link && link.hasOwnProperty('pre')) ? link.pre : null,
        post: function (_scope, _element) {
          if (!compiledContents) compiledContents = $compile(contents);

          compiledContents(_scope, function (_clonedElement) {
            _element.append(_clonedElement);
          });

          if (link && link.hasOwnProperty('post')) link.post.apply(null, arguments);
        }
      }
    }
  }

  idexJsonVisualizerDirective.$inject = ['$parse', '$templateCache','jsonVisualizer', 'recursionHelper'];

  function idexJsonVisualizerDirective ($parse, $templateCache, jsonVisualizer, recursionHelper) {
    var directive = {};

    directive.template = template;
    directive.scope = true;
    directive.compile = compile;

    return directive;

    function template (_element, _attributes) {
      var template = $templateCache.get('json-visualizer/idex-json-visualizer.directive.html');


      // Wrapping the whole thing in a form, I check if there is any other similar form before in hope to catch a recursive directive.
      if (_attributes.hasOwnProperty('idexFormName')) {

        return '<form id="' + _attributes.idexFormName + '" name="' + _attributes.idexFormName + '">' + template + '</form>';
      }

      return template;
    }

    function compile (_templateElement) {

      return recursionHelper.compile(_templateElement, {
        post: postLink
      });

      function postLink (_scope, _element, _attributes) {
        var modelAttributeName = $parse(_attributes.idexJsonVisualizer)(_scope);


        _scope.formName = _attributes.idexFormName;
        _scope.modelName = (typeof modelAttributeName === 'string') ? modelAttributeName : _attributes.idexJsonVisualizer;
        _scope.model = (typeof modelAttributeName === 'string') ? $parse(modelAttributeName)(_scope) : modelAttributeName;
        _scope.blueprint = jsonVisualizer.normalizeBlueprint(((_attributes.hasOwnProperty('idexBlueprint')) ? $parse(_attributes.idexBlueprint)(_scope) : jsonVisualizer.converToBlueprint(angular.copy(_scope.model))));
      }
    }
  }

})(window, window.angular);

(function (window, angular) {

  angular.module('idex-json-visualizer')

    .directive('idexModel', idexModelDirective);

  idexModelDirective.$inject = ['$compile', '$parse'];

  function idexModelDirective ($compile, $parse) {
    var directive = {};

    directive.link = link;

    return directive;

    function link (_scope, _element, _attributes) {
      _element[0].removeAttribute('idex-model');
      _element[0].setAttribute('ng-model', $parse(_attributes.idexModel)(_scope));
      $compile(_element[0])(_scope);
    }
  }

})(window, window.angular);
(function (window, angular) {

  angular.module('idex-json-visualizer')

    .directive('idexMultiChoice', idexJsonVisualizerDirective);

  idexJsonVisualizerDirective.$inject = ['$compile', '$parse', '$templateCache', '$window', 'jsonVisualizer', 'recursionHelper'];

  function idexJsonVisualizerDirective ($compile, $parse, $templateCache, $window, jsonVisualizer, recursionHelper) {
    var directive = {};

    directive.templateUrl = 'multi-choice/idex-multi-choice.directive.html';
    directive.scope = true;
    directive.compile = compile;

    return directive;

    function compile (_templateElement) {

      return {
        post: postLink
      };

      function postLink (_scope, _element, _attributes) {
        var modelAttributeName = $parse(_attributes.idexMultiChoice)(_scope);

        _scope.modelName = (typeof modelAttributeName === 'string') ? modelAttributeName : _attributes.idexMultiChoice;
        _scope.model = (typeof modelAttributeName === 'string') ? $parse(modelAttributeName)(_scope) : modelAttributeName;
        // At the moment, the blueprint is expected to have been normalized.
        _scope.blueprint = ((_attributes.hasOwnProperty('idexBlueprint')) ? $parse(_attributes.idexBlueprint)(_scope) : jsonVisualizer.converToBlueprint(angular.copy(_scope.model)));

        _scope.add = addValue;
        _scope.remove = removeValue;

        function addValue (model, value) {
          if (typeof model === 'string') model = $parse(model)(_scope);

          value = (value || '').trim();

          if (value !== '') model.push(value);
        }

        function removeValue (model, index) {
          if (typeof model === 'string') model = $parse(model)(_scope);

          model.splice(index, 1);
        }
      }
    }
  }

})(window, window.angular);

(function (window, angular) {

  angular.module('idex-json-visualizer')

    .factory('jsonVisualizer', jsonVisualizerFactory);

  jsonVisualizerFactory.$inject = ['$window'];

  function jsonVisualizerFactory ($window) {
    var factory = {};

    factory.converToBlueprint = convertJSONToBlueprint;
    factory.normalizeBlueprint = normalizeJSONBlueprint;
    //factory.convertToHTML = convertJSONToHTML;

    return factory;

    /**
     * Converts any object into a suitable blueprint.
     *  1. If a value is an object, nest it under the children property.
     *
     * @param {Object} model
     *
     * @returns {Object}
     */
    function convertJSONToBlueprint (model) {

      return execute(model);

      function execute (currentModel) {

        Object.keys(currentModel)
          .forEach(function (key) {
            var value = currentModel[key];

            currentModel[key] = parse(key, value);
          });

        function parse (key, value) {
          if (angular.isObject(value) && !angular.isArray(value)) return {
            type: 'object',
            children: execute(currentModel[key])
          };

          if (angular.isString(value)) return {
            type: 'string'
          };

          if (angular.isArray(value)) return {
            type: 'array',
            widgetOptions: value
              .map(function (widgetOption) {

                return {
                  type: 'string',
                  label: widgetOption.cleanUpLabel(),
                  value: widgetOption
                };
              })
          }
        }

        return currentModel;
      }
    }

    function normalizeJSONBlueprint (blueprint) {

      return normalize(blueprint);

      function normalize (currentBlueprint) {
        if (!currentBlueprint) return currentBlueprint;

        Object.keys(currentBlueprint)
          .forEach(function (currentBluePrintKey) {

            currentBlueprint[currentBluePrintKey] = execute(currentBluePrintKey, currentBlueprint[currentBluePrintKey]);
          });

        return currentBlueprint;

        function execute (key, settings) {
          var defaultSettings = {
            key: key,
            label: key.cleanUpLabel(),
            required: false,
            editable: true,
            weight: 0,
            widgetType: (function (type) {
              switch (type) {
                case 'string':

                  return 'text';
                case 'array':

                  return 'idex-multi-choice';
                case 'object':

                  return 'fieldset';
              }
            })(settings.type),
            visible: true
          };

          if (settings.hasOwnProperty('children')) settings.children = normalize(settings.children);

          return angular.extend(defaultSettings, settings);
        }
      }
    }
  }

  String.prototype.cleanUpLabel = function () {
    var value = this;

    value = value.trim();

    if (this.length > 3) {
      value = value.replace(/([A-Z])/g, ' $1').toLowerCase();

      value = value.replace('_', ' ');

      value = value.slice(0, 1).replace(/^./, function(str){ return str.toUpperCase(); }) + value.slice(1);
    }

    return value;
  };

})(window, window.angular);
angular.module("idex-json-visualizer").run(["$templateCache", function($templateCache) {$templateCache.put("checkbox/idex-checkbox.directive.html","<div class=\"checkbox\">\n    <div class=\"checkbox__elements\">\n        <div class=\"checkbox__element\" ng-repeat=\"option in settings.widgetOptions track by $index\">\n            <input id=\"{{ settings.key }}__{{ $index }}\" name=\"{{ settings.key }}__{{ $index }}\" type=\"checkbox\" class=\"checkbox\" ng-checked=\"model.indexOf(option.value) !== -1\" ng-click=\"change(model, option.value)\"/>&nbsp;<div class=\"label\">{{ option.label }}</div>\n        </div>\n    </div>\n</div>\n\n");
$templateCache.put("json-visualizer/idex-input.directive.html","<div>{{ abc }}</div>");
$templateCache.put("json-visualizer/idex-json-visualizer.directive.html","\n<div class=\"json-visualizer\">\n\n    <div class=\"json-visualizer__items\">\n\n        <div class=\"json-visualizer__items__item\" ng-repeat=\"settings in ::blueprint | orderByWeight\">\n\n            <div ng-switch=\"settings.widgetType\">\n\n                <div ng-switch-when=\"text\" ng-if=\"settings.visible\">\n\n                    <label for=\"{{ settings.key }}\">\n                        <div class=\"label\">{{ settings.label }}</div>\n                        <input id=\"{{ settings.key }}\"\n                               name=\"{{ settings.key }}\"\n                               type=\"text\" ng-if=\"settings.editable\"\n                               ng-required=\"settings.required\"\n                               ng-pattern=\"settings.regexp\"\n                               idex-model=\"modelName + \'.\' + settings.key\" />\n                        <div class=\"body\" ng-if=\"!settings.editable\"\n                             idex-bind=\"(modelName + \'.\' + settings.key | date : \'fullDate\')\"></div>\n                    </label>\n\n                </div>\n\n                <div ng-switch-when=\"fieldset\">\n\n                    <fieldset class=\"fieldset\">\n\n                        <legend class=\"legend\">{{ settings.label }}</legend>\n\n                        <div idex-json-visualizer=\"modelName + \'.\' + settings.key\" idex-blueprint=\"settings.children\"></div>\n\n                    </fieldset>\n                </div>\n\n                <div ng-switch-when=\"idex-multi-choice\">\n\n                    <label for=\"{{ settings.key }}\">\n                        <div class=\"label\">{{ settings.label }}</div>\n                        <div idex-multi-choice=\"modelName + \'.\' + settings.key\" idex-blueprint=\"settings\"></div>\n                    </label>\n\n                </div>\n\n                <div ng-switch-when=\"checkbox\">\n\n                    <label>\n                        <div class=\"label\">{{ settings.label }}</div>\n                        <div idex-checkbox=\"modelName + \'.\' + settings.key\" idex-blueprint=\"settings\"></div>\n                    </label>\n\n                </div>\n\n                <div ng-switch-when=\"radio\">\n\n                    <label>\n                        <div class=\"label\">{{ settings.label }}</div>\n\n                        <label for=\"{{ settings.key }}__{{ $index }}\" ng-repeat=\"option in settings.widgetOptions\">\n                            <input id=\"{{ settings.key }}__{{ $index }}\" name=\"{{ settings.key }}__{{ $index }}\" type=\"radio\" ng-value=\"option.value\" idex-model=\"modelName + \'.\' + settings.key\" />&nbsp;<div class=\"label\">{{ option.label }}</div>\n                        </label>\n                    </label>\n\n                </div>\n\n            </div>\n\n        </div>\n\n    </div>\n\n</div>");
$templateCache.put("multi-choice/idex-multi-choice.directive.html","<div class=\"multi-choice\">\n    <div class=\"multi-choice__elements\">\n        <div class=\"multi-choice__element\" ng-repeat=\"value in model track by $index\">\n            <input type=\"text\" class=\"input\" ng-required=\"blueprint.required\" ng-pattern=\"blueprint.regexp\" idex-model=\"modelName + \'[\' + $index + \']\'\"/>\n            <button class=\"button\" ng-click=\"remove(modelName, $index)\">Remove</button>\n        </div>\n    </div>\n    <div class=\"multi-choice__controls\">\n        <input type=\"text\" class=\"input\" ng-model=\"dummyValue\"/>\n        <button class=\"button\" ng-click=\"add(modelName, dummyValue); dummyValue = \'\'\">Add value</button>\n    </div>\n</div>\n\n");}]);