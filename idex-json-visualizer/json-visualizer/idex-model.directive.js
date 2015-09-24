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