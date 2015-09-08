# IDEX JSON Visualizer

The IDEX JSON Visualizer is a tool that generates editable or non-editable UI from a JSON document.
This is very useful to output a very simple CMS to edit database content.

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
        widgetType: 'checkbox', // would display a normal grouped checkbox
        widgetOptions: [{ label: 'View', value: 'read' }, { label: 'Edit', value: 'write' }],
        weight: -500, // let's try to display it toward the end
        required: true // default to false
    },
    meta: {
        weight: -900,
        children: {
            createdOn: {
                widgetType: 'text', // would make the content un-editable
                label: "Date of creation" // modify the label from "Created On" to "Date of creation"
            },
            modifiedOn: {
                widgetType: 'text', // would make the content un-editable
                label: "Date of modification" // modify the label from "Modified On" to "Date of modification"
            }
        }
    },
    attributes: {
        label: "Personal information",
        children: {
            firstName: {
                label: "First name",
                required: true
            },
            fullName: {
                label: "Full name",
                required: true
            },
            email: {}, // let's not change anything
            city: {
                widgetType: 'custom',
                widgetTemplateUrl: 'google-place-autocomplete.html' // 
            }
        }
    }
};
```

Which should now look like that:

![IDEX JSON Visualizer - With blueprint rendering](https://cldup.com/_94Ta8w8oA.png)

Isn't that great? And with a little styles and creativity you could make it look awesome:

![IDEX JSON Visualizer - With blueprint rendering and styling](https://cldup.com/2UUXRJlLKr.png)
