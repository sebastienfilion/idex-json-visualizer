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