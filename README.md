# IDEX JSON Visualizer

The IDEX JSON Visualizer is a tool that generates editable or non-editable UI from a JSON document.
This is very useful to output a very simple admin to edit database content.

## Demo

I prepared a simple demo [here](http://idesignexperiences.com/demo/json-visualizer/example/index.html). (follow the link)

## Table of content

1. [Using the IDEX JSON Visualizer](#using-the-idex-json-visualizer)  
2. [Using the IDEX JSON Visualizer with a blueprint](#using-the-idex-json-visualizer-with-a-blueprint)  
3. [Installing the IDEX JSON Visualizer](#installing-the-idex-json-visualizer)  
    a. [With an Angular project](#with-an-angular-project)  
    b. [With a non Angular project](#with-a-non-angular-project)  
4. [Creating a blueprint](#creating-a-blueprint)  
5. [License](#license)  

## Using the IDEX JSON Visualizer

In its most simple form, the Visualizer is used as an Angular directive like follow:

```html
<div idex-json-visualizer="applicationController.payload"></div>
```

Assuming that the JSON document passed looks like this:

```json
{
    "ID": "1234567890",
    "permissions": ["read", "edit"],
    "meta": {
        "createdOn": "2015-07-07T07:07:07Z",
        "modifiedOn": "2015-08-08T08:08:08Z"
    },
    "attributes": {
        "firstName": "John",
        "fullName": "John Doe",
        "email": "john@gmail.com"
    }
}
```

Would render something like that:

![IDEX JSON Visualizer - Simple rendering](https://cldup.com/4zNmkrkbjQ.png)

This can easily be inserted in any form and be used to edit the resource.

## Using the IDEX JSON Visualizer with a blueprint

"OK," you are telling yourself, "But what if I want it in another order and with other input elements and I don't want the dates to be modified..."  
I know, I know. That's why I created the blueprint. The blueprint serves three purposes:  
    1. It validates the values passed;  
    2. It can modify the order in which the elements are rendered;  
    3. It can alter the type of widget is used to represent the element or make it un-editable.  
    
So if you pass a blueprint with your directive:

```html
<div idex-json-visualizer="applicationController.payload" idex-blueprint="applicationController.userModelBlueprint"></div>
```

And set it up like this:

```js
this.userModelBlueprint = {
    ID: {
        visible: false // default to true
    },
    permissions: {
        type: 'object',
        weight: -500, // let's try to display it toward the end
        required: true // default to false
        widgetType: 'checkbox', // would display a normal grouped checkbox
        widgetOptions: [
            {
                type: 'string',
                label: 'View',
                value: 'read'
            },
            { 
                type: 'string',
                label: 'Edit',
                value: 'write'
            }
        ],
    },
    meta: {
        type: 'object',
        weight: -900,
        children: {
            createdOn: {
                type: 'string',
                editable: false, // would make the content un-editable
                label: "Date of creation", // modify the label from "Created On" to "Date of creation"
                filter: 'date : fullDate'
            },
            modifiedOn: {
                type: 'string',
                editable: false, // would make the content un-editable
                label: "Date of modification", // modify the label from "Modified On" to "Date of modification"
                filter: 'date : fullDate'
            }
        }
    },
    attributes: {
        type: 'object',
        label: "Personal information",
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
                label: "E-mail",
                required: true,
                regexp: '[A-Za-z0-9\.\-\_\+]+\@[A-Za-z0-9\.\-\_]+\.[A-Za-z\.]{2,7}$'
            },
            city: {
                widgetType: 'custom',
                widgetDirective: 'google-place-autocomplete'
            }
        }
    }
};
```

It should now look like that:

![IDEX JSON Visualizer - With blueprint rendering](https://cldup.com/_94Ta8w8oA.png)

Isn't that great? And with a little styles and creativity you could make it look awesome:

![IDEX JSON Visualizer - With blueprint rendering and styling](https://cldup.com/2UUXRJlLKr.png)


## Installing the IDEX JSON Visualizer

You can simply install the IDEX JSON Visualizer using bower:

```sh
$ bower install idex-json-visualizer
```

### With an Angular project

If your project already uses Angular, you can add it as a dependency.

```js
angular.module('foo', [ 'idex-json-visualizer' ]);
```

The visualizer is always created with a new form; You can pass a reference to your controller for the model and the form:

```html
<div idex-json-visualizer="applicationController.simpleModel" idex-form-name="applicationController.Form"></div>

<button ng-disabled="applicationController.Form.$valid" ng-click="applicationController.save(applicationController.simpleModel);">Save</button>

```

```js
angular.module('foo', [ 'idex-json-visualizer' ])

    .controller('ApplicationController', ApplicationController);
    
function ApplicationController () {
    var view = this;
    
    view.save = saveMethod;
    
    function saveMethod (model) {
        // Handle the form submission
        console.log(model);
    }
}
```

I know you are going to tell me that having the button outside of the form is not very semantic but I wanted to make it as easy as possible to handle the form submission...

### With a non Angular project

Even though the IDEX JSON visualizer was created to be used on an Angular application, it is technically possible to use without it (while being slightly harder). You will have to add some Angular specific boiler plate code...  
First, you want to add the _visualizer_ with vendors in the head of your app.  
Secondly, you want to initialize Angular:  

```
angular.module('foo', [ 'idex-json-visualizer' ]);
```

Thirdly, you want to create an [Angular Controller](https://docs.angularjs.org/guide/controller) for your form:  

```
angular.module('foo', [ 'idex-json-visualizer' ])

    .controller('ApplicationController', ApplicationController);
    
ApplicationController.$inject = ['$window'];

function ApplicationController ($window) {
    var view = this;
    
    // Here you can bind your model;
    view.model = $window.myModel;
    
    // Here you can bind global function that you want to use on your form.
    view.save = $window.mySaveMethod;
}

// Declare the model once it is retrieved from your database or something...
window.model = {};

window.mySaveMethod = function (model) {
    // The variable model will contain the modified model.
    console.log(model);
}
```

Fourthly, you want to inject the _visualizer_ in your template while bootstraping Angular and the controller:  

```html
<div ng-app="foo" ng-controller="ApplicationController as applicationController">
    <div idex-json-visualizer="applicationController.model" idex-form-name="applicationController.Form"></div>
    
    <!-- Specify a button to handle the submission of your form, the ng-disabled will disable the button if the form is not valid, and the ng-click will handle the click on the button. -->
    <button ng-disabled="applicationController.Form.$invalid" ng-click="applicationController.save(applicationController.model);"></button>
</div>
```

## Creating a blueprint

It is really easy to create a blueprint. It is a simple JSON object that follows the same structure as the serviced resources,
they goes like this:

```
{
    Key: { // The key of the property for the resource
        type: {String},
        label: [{String}],
        value: [{String}],
        required: [{Boolean}],
        editable: [{Boolean}],
        visible: [{Boolean}],
        regexp: [{String}],
        filter: [{String}],
        weight: [{Number}],
        widgetType: [{String}],
        widgetOptions: [{ - Recursive - }[]],
        widgetDirective: [{String}]
    }
}
```

**type**: The type of the value expected. It should be one of the following: `string`, `array`, `boolean` and `object`.  

+ `string`: The most common type is `string`. It will, by default, display a simple text input. The default widget type is `text`.    
+ `array`: Used when resource property can have multiple value. It will, by default, use the simple `idex-multi-choice` UI element. The default widget type is `idex-multi-choice`.  
+ `boolean`: Appropriate when the value is either `true` or `false`. The default widget type is `radio`.
+ `object`: It creates a subgroup of data. It will, by default, display the children data in a fieldset. The default widget type is `fieldset`.  
    
**label**: By default, the label of any property uses a cleaned-up version of the key, use this option to replace it.

**value**: This option is only used for widget options, it will specifies the value to be recorded.  

**required**: A flag that specifies if the property must be filled for the resource the be valid. `false` is the default.  

**editable**: If set to `false` on a property with the type is `string`, this will display text instead of the expected input. `true` is the default.  

**regexp**: A valid regular expression that will be tested on the value.  

~~**filter**: A valid angular filter: [https://docs.angularjs.org/api/ng/filter](https://docs.angularjs.org/api/ng/filter).~~  

**weight**: This can help ordering the resources on the page, a high negative value will bring the resource down while a high positive value will bring it up. 0 is the default.  
  
**widgetType**: The type of the widget if it not one of the default one (as mentionned in the definition for the `type` property). The type shipped with this software are:  

+ `text`: Display a simple text input with the type of `text`. Only for resources of type `string`.  
~~+ `number`: Display a text input with the type of `number`. Only for resources of type `string`.~~  
~~+ `email`: Display a text input with the type of `email`. Only for resources of type `string`.~~  
~~+ `password`: Display a text input with the type of `password`. Only for resources of type `string`.~~  
~~+ `textarea`: Display a textarea. Only for resources of type `string`.~~  
+ `idex-multi-choice`: Display the multi-choice widget as presented in the intro. Only for resources of type `array`.  
+ `checkbox`: Display a checkbox for each options. Only for resources of type `array`.  
+ `radio`: Display a radio group the options. Commonly used for resources of type `boolean`.  
+ `fieldset`: Display a fieldset. Only for the resources of type `object`.  

## LICENSE

GNU General Public License v 2.0