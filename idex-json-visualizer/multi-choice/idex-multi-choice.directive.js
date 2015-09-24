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
