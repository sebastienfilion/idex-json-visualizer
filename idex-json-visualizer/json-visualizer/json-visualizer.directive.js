(function (window, angular) {

  angular.module('idex-json-visualizer')

    .directive('idexJsonVisualizer', idexJsonVisualizerDirective);

  idexJsonVisualizerDirective.$inject = ['$compile', '$parse', 'jsonVisualizer'];

  function idexJsonVisualizerDirective ($compile, $parse, jsonVisualizer) {
    var directive = {};

    directive.link = link;

    return directive;

    function link (_scope, _element, attributes) {
      // Check if there is a blueprint.
      // If there is no blueprint, make the object the blueprint using the default values.
      // Go over each element and write the template.
      // Compile the result and return.
      var formName, modelName, model, blueprint, template;

      formName = attributes.idexFormName;
      modelName = attributes.idexJsonVisualizer;
      model = $parse(attributes.idexJsonVisualizer)(_scope) || {};
      blueprint = (attributes.hasOwnProperty('idexBlueprint')) ? $parse(attributes.idexBlueprint)(_scope) : jsonVisualizer.converToBlueprint(angular.copy(model));

      template = jsonVisualizer.convertToHTML(blueprint, modelName, formName);

      _element.append($compile(template)(_scope));
    }
  }

})(window, window.angular);