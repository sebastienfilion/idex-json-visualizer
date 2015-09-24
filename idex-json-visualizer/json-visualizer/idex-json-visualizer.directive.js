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
