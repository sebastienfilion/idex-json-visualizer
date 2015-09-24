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
