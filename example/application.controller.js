(function (window, angular) {

  angular.module('application', [
    'idex-json-visualizer'
  ])

    .controller('ApplicationController', ApplicationController);

  ApplicationController.$inject = [];

  function ApplicationController () {
    var view = this;

    view.simpleModel = {
      ID: '1234567890',
      permissions: ['read', 'edit'],
      meta: {
        'createdOn': '2015-07-07T07:07:07Z',
        'modifiedOn': '2015-08-08T08:08:08Z'
      },
      attributes: {
        firstName: 'John',
        fullName: 'John Doe',
        email: 'john@gmail.com'
      }
    };

    view.simpleModel2 = {
      ID: 'abcdefghijklmn',
      permissions: ['read'],
      meta: {
        'createdOn': '2015-07-07T07:07:07Z',
        'modifiedOn': '2015-08-08T08:08:08Z'
      },
      attributes: {
        firstName: 'John',
        fullName: 'John Doe',
        email: 'john@gmail.com'
      },
      active: true
    };

    view.simpleBlueprint = {
      ID: {
        type: 'string',
        visible: false
      },
      permissions: {
        type: 'array',
        required: true,
        weight: -500,
        widgetType: 'checkbox',
        widgetOptions: [
          {
            type: 'string',
            label: 'Edit',
            value: 'write'
          },
          {
            type: 'string',
            label: 'View',
            value: 'read'
          }
        ]
      },
      meta: {
        type: 'object',
        weight: -900,
        children: {
          createdOn: {
            type: 'string',
            editable: false,
            label: 'Date of creation',
            filter: 'date : fullDate'
          },
          modifiedOn: {
            type: 'string',
            editable: false,
            label: 'Date of modification',
            filter: 'date : fullDate'
          }
        }
      },
      attributes: {
        type: 'object',
        label: 'Personal information',
        children: {
          firstName: {
            type: 'string',
            required: true
          },
          fullName: {
            type: 'string',
            required: true
          },
          email: {
            type: 'string',
            label: 'E-mail',
            regexp: '[A-Za-z0-9\.\-\_\+]+\@[A-Za-z0-9\.\-\_]+\.[A-Za-z\.]{2,7}$',
            required: true,
            weight: -500
          },
          city: {
            type: 'string',
            label: 'City',
            weight: -900
          }
        }
      },
      active: {
        type: 'boolean',
        label: 'User is active',
        weight: -900,
        widgetType: 'radio',
        widgetOptions: [
          {
            type: 'boolean',
            label: 'Active',
            value: true
          },
          {
            type: 'boolean',
            label: 'Inactive',
            value: false
          }
        ]
      }
    };
  }

})(window, window.angular);