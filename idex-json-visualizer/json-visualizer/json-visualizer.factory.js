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