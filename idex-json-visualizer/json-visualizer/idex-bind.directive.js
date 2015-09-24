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