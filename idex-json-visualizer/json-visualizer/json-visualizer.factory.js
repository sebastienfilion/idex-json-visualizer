(function (window, angular) {

  angular.module('idex-json-visualizer')

    .factory('jsonVisualizer', jsonVisualizerFactory);

  jsonVisualizerFactory.$inject = ['$window'];

  function jsonVisualizerFactory ($window) {
    var factory = {};

    factory.converToBlueprint = convertJSONToBlueprint;
    factory.convertToHTML = convertJSONToHTML;

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

                return parse(key, widgetOption);
              })
          }
        }

        return currentModel;
      }
    }

    function convertJSONToHTML (blueprint, modelName, formName) {
      var formElement = $window.document.createElement('form');

      if (!!formName) formElement.name = formName;

      return execute(blueprint, formElement);

      function execute (currentBlueprint, currentElement) {

        return Object.keys(currentBlueprint)
          .sort(function (keyA, keyB) {
            var blueprintSettingsA = currentBlueprint[keyA],
              blueprintBSettingsB = currentBlueprint[keyB];

            blueprintSettingsA.weight = blueprintSettingsA.weight || 0;
            blueprintBSettingsB.weight = blueprintBSettingsB.weight || 0;

            if (blueprintSettingsA.weight > blueprintBSettingsB.weight) return -1;
            else if (blueprintSettingsA.weight < blueprintBSettingsB.weight) return 1;
            else return 0;
          })
          .reduce(function (accumulator, key) {
            var blueprintSettings = currentBlueprint[key];

            blueprintSettings.visible =  (blueprintSettings.hasOwnProperty('visible')) ? blueprintSettings.visible : true;
            blueprintSettings.editable =  (blueprintSettings.hasOwnProperty('editable')) ? blueprintSettings.editable : true;

            if (!!blueprintSettings.visible) {
              if (blueprintSettings.type === 'string') {
                if (blueprintSettings.editable) {
                  accumulator.appendChild(generateTemplateForString(key, blueprintSettings));
                } else {
                  accumulator.appendChild(generateTemplateNonEditableForString(key, blueprintSettings));
                }
              }
              if (blueprintSettings.type === 'array') accumulator.appendChild(generateTemplateForArray(key, blueprintSettings));
              if (blueprintSettings.type === 'object') accumulator.appendChild(generateTemplateForObject(key, blueprintSettings));
            }

            return accumulator;
          }, currentElement);
      }

      /**
       * Generates a template for a property which the value is of instance of String.
       *
       * @param {String} key
       * @param {Object} blueprintSettings
       *
       * @returns {Element}
       */
      function generateTemplateForString (key, blueprintSettings) {
        var labelElement = $window.document.createElement('label'),
          divLabelElement = $window.document.createElement('div'),
          inputElement = $window.document.createElement('input');

        labelElement.for = key;

        divLabelElement.className = 'label';
        divLabelElement.innerText = blueprintSettings.label || key.cleanUpLabel();

        inputElement.id = key;
        inputElement.name = key;
        inputElement.setAttribute('ng-model', modelName + '.' + key);

        if (blueprintSettings.hasOwnProperty('regexp')) inputElement.setAttribute('ng-pattern', new RegExp(blueprintSettings.regexp));

        if (blueprintSettings.hasOwnProperty('required') && blueprintSettings.required) inputElement.required = true;

        labelElement.appendChild(divLabelElement);
        labelElement.appendChild(inputElement);

        return labelElement;
      }

      function generateTemplateNonEditableForString (key, blueprintSettings) {
        var labelElement = $window.document.createElement('label'),
          divLabelElement = $window.document.createElement('div'),
          textElement = $window.document.createElement('p');

        labelElement.for = key;

        divLabelElement.className = 'label';
        divLabelElement.innerText = blueprintSettings.label || key.cleanUpLabel();

        textElement.className = 'body';
        textElement.innerText = '{{ ' + modelName + '.' + key + ((blueprintSettings.hasOwnProperty('filter')) ? ' | ' + blueprintSettings.filter : '') +  ' }}';

        labelElement.appendChild(divLabelElement);
        labelElement.appendChild(textElement);

        return labelElement;
      }

      /**
       * Generates a template for a property which the value is of instance of Array.
       *
       * @param {String} key
       * @param {Object} blueprintSettings
       *
       * @returns {Element}
       */
      function generateTemplateForArray (key, blueprintSettings) {
        var labelElement = $window.document.createElement('label'),
          divLabelElement = $window.document.createElement('div'),
          divNgRepeat = $window.document.createElement('div'),
          inputElement = $window.document.createElement('input');

        divLabelElement.className = 'label';
        divLabelElement.innerText = blueprintSettings.label || key.cleanUpLabel();

        divNgRepeat.setAttribute('ng-repeat', 'model in ' + modelName + '.' + key);

        inputElement.id = key;
        inputElement.name = key;
        inputElement.setAttribute('ng-model', 'model');

        divNgRepeat.appendChild(inputElement);

        labelElement.appendChild(divLabelElement);
        labelElement.appendChild(divNgRepeat);

        return labelElement;
      }

      /**
       * Generates a template for a property which the value is of instance of Object.
       * The generator will expect the blueprint to have a property of children. It will throw an error if not.
       * The children will be processed recursively.
       *
       * @param {String} key
       * @param {Object} blueprintSettings
       *
       * @returns {*}
       */
      function generateTemplateForObject (key, blueprintSettings) {
        var fieldsetElement = $window.document.createElement('fieldset'),
          legendElement = $window.document.createElement('legend');

        if (!blueprintSettings.hasOwnProperty('children')) throw new Error("[idex-json-visualizer convertJSONToHTML] A blueprint of instance of Object must have a property of children.");

        fieldsetElement.className = 'fieldset';

        legendElement.className = 'legend';
        legendElement.innerText = blueprintSettings.label || key.cleanUpLabel();

        fieldsetElement.appendChild(legendElement);

        Object.keys(blueprintSettings.children)
          .forEach(function (childrenKey) {
            var value = blueprintSettings.children[childrenKey];

            value.label = value.label || childrenKey.cleanUpLabel();

            blueprintSettings.children[key + '.' + childrenKey] = value;
            delete blueprintSettings.children[childrenKey];
          });

        return execute(blueprintSettings.children, fieldsetElement, key);
      }

    }
  }

  String.prototype.cleanUpLabel = function () {
    var value = this;

    value = value.trim();

    if (this.length > 3) {
      value = value.replace(/([A-Z])/g, ' $1').toLowerCase();

      value = value.slice(0, 1).replace(/^./, function(str){ return str.toUpperCase(); }) + value.slice(1);
    }

    return value;
  };

})(window, window.angular);