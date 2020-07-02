'use strict';
angular.module('JSONedit', ['ui.sortable'])
.directive('ngModelOnblur', function() {
    // override the default input to update on blur
    // from http://jsfiddle.net/cn8VF/
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attr, ngModelCtrl) {
            if (attr.type === 'radio' || attr.type === 'checkbox') return;

            elm.unbind('input').unbind('keydown').unbind('change');
            elm.bind('blur', function() {
                scope.$apply(function() {
                    ngModelCtrl.$setViewValue(elm.val());
                });
            });
        }
    };
})
.directive('json', ["$compile", function($compile) {
  return {
    restrict: 'E',
    scope: {
      child: '=',
      type: '@',
      defaultCollapsed: '='
    },
    link: function(scope, element, attributes) {
        var stringName = "Text";
        var objectName = "Object";
        var arrayName = "Array";
        var refName = "Reference";
        var boolName = "Boolean"
        var numberName = "Number"

        scope.valueTypes = [stringName, objectName, arrayName, refName, boolName, numberName];
        scope.sortableOptions = {
            axis: 'y'
        };
        if (scope.$parent.defaultCollapsed === undefined) {
            scope.collapsed = false;
        } else {
            scope.collapsed = scope.defaultCollapsed;
        }
        if (scope.collapsed) {
            scope.chevron = "glyphicon-chevron-right";
        } else {
            scope.chevron = "glyphicon-chevron-down";
        }

        //////
        // Helper functions
        //////

        var getType = function(obj) {
            // console.log('getType: '+obj);
            var type = Object.prototype.toString.call(obj);
            if (type === "[object Object]") {
                return "Object";
            } else if(type === "[object Array]"){
                return "Array";
            } else if(type === "[object Boolean]"){
                return "Boolean";
            } else if(type === "[object Number]"){
                return "Number";
            } else {
                return "Literal";
            }
        };
        var isNumber = function(n) {
          return !isNaN(parseFloat(n)) && isFinite(n);
        };
        scope.test = function(obj) {
          console.log(obj);
        };
        scope.getType = function(obj) {
          return getType(obj);
        };
        scope.toggleCollapse = function() {
          if (scope.collapsed) {
            scope.collapsed = false;
            scope.chevron = "glyphicon-chevron-down";
          } else {
            scope.collapsed = true;
            scope.chevron = "glyphicon-chevron-right";
          }
        };
        scope.moveKey = function(obj, key, newkey) {
            //moves key to newkey in obj
            if (key !== newkey) {
                obj[newkey] = obj[key];
                delete obj[key];
            }
        };
        scope.deleteKey = function(obj, key) {
            if (getType(obj) == "Object") {
                if( confirm('Delete "'+key+'" and all it contains?') ) {
                    delete obj[key];
                }
            } else if (getType(obj) == "Array") {
                if( confirm('Delete "'+obj[key]+'"?') ) {
                    obj.splice(key, 1);
                }
            } else {
                console.error("object to delete from was " + obj);
            }
        };
        scope.addItem = function(obj) {
            if (getType(obj) == "Object") {

                // check input for key
                if (scope.keyName == undefined || scope.keyName.length == 0){
                    alert("Bitte gebe einen Command ein");
                } else if (scope.keyName.indexOf(" ") !== -1){
                    alert("Keine Leerzeichen im Command");
                } else if (scope.keyName.indexOf("$") == 0){
                    alert("The name may not start with $ (the dollar sign)");
                } else if (scope.keyName.indexOf("_") == 0){
                    alert("The name may not start with _ (the underscore)");
                } else {
                    if (obj[scope.keyName]) {
                        if( !confirm('An item with the name "'+scope.keyName
                            +'" exists already. Do you really want to replace it?') ) {
                            return;
                        }
                    }
                    if (scope.valueType == numberName && !isNumber(scope.valueName)){
                        alert("Please fill in a number");
                        return;
                    }

                    // add item to object
                    switch(scope.valueType) {
                        // case stringName: obj[scope.keyName] = scope.valueName ? scope.valueName : "";
                        case stringName: obj[scope.keyName] = scope.valueName ? {"permission": {viewer: true}, "text": scope.valueName} : "";
                                        break;
                        case numberName: obj[scope.keyName] = scope.possibleNumber(scope.valueName);
                                         break;
                        case objectName: obj[scope.keyName] = {};
                                        break;
                        case arrayName:  obj[scope.keyName] = [];
                                        break;
                        case refName: obj[scope.keyName] = {"Reference!!!!": "todo"};
                                        break;
                        case boolName: obj[scope.keyName] = false;
                                        break;
                    }

                    //clean-up
                    scope.keyName = "";
                    scope.valueName = "";
                    scope.showAddKey = false;
                }
            } else if (getType(obj) == "Array") {
                if (scope.valueType == numberName && !isNumber(scope.valueName)){
                    alert("Please fill in a number");
                    return;
                }
                // add item to array
                switch(scope.valueType) {
                    case stringName: obj.push(scope.valueName ? scope.valueName : "");
                                    break;
                    case numberName: obj.push(scope.possibleNumber(scope.valueName));
                                     break;
                    case objectName:  obj.push({});
                                    break;
                    case arrayName:   obj.push([]);
                                    break;
                    case boolName:   obj.push(false);
                                    break;
                    case refName: obj.push({"Reference!!!!": "todo"});
                                    break;
                }
                scope.valueName = "";
                scope.showAddKey = false;
            } else {
                console.error("object to add to was " + obj);
            }
        };
        scope.possibleNumber = function(val) {
            return isNumber(val) ? parseFloat(val) : val;
        };

        //////
        // Template Generation
        //////

        // Note:
        // sometimes having a different ng-model and then saving it on ng-change
        // into the object or array is necessary for all updates to work

        // recursion

          var switchPermission =
           '<span ng-if="val.permission">'
            +'<div class="switch"><label class="tooltipped" data-tooltip="Für Streamer erlauben">'
              +'<input style="padding: 20px" type="checkbox" ng-model="child[key].permission.host" ng-model-onblur>'
              +'<span class="lever"></span>'
            +'</label>'
            +'<label class="tooltipped" data-tooltip="Für Mods erlauben">'
              +'<input class="with-gap" style="padding: 20px" type="checkbox" ng-model="child[key].permission.mod" ng-model-onblur >'
              +'<span class="lever"></span>'
            +'</label>'
            +'<label class="tooltipped" data-tooltip="Für Subs erlauben">'
              +'<input style="padding: 20px" type="checkbox" ng-model="child[key].permission.subscriber" ng-model-onblur >'
              +'<span class="lever"></span>'
            +'</label>'
            +'<label class="tooltipped" data-tooltip="Für Turbo erlauben">'
              +'<input style="padding: 20px" type="checkbox" ng-model="child[key].permission.turbo" ng-model-onblur >'
              +'<span class="lever"></span>'
            +'</label>'
            +'<label class="tooltipped" data-tooltip="Für Alle erlauben">'
              +'<input style="padding: 20px" type="checkbox" ng-model="child[key].permission.viewer" ng-model-onblur >'
              +'<span class="lever"></span>'
            +'</label></div>'
          +'</span>';

          var switchTemplate =
              '<span ng-switch on="getType(val)" >'
                // +'{{key}}' // Text
                // +'{{child}}'
                  // + '<json ng-switch-when="Object" child="val" type="object" default-collapsed="defaultCollapsed"></json>'
                  // + '<json ng-switch-when="Array" child="val" type="array" default-collapsed="defaultCollapsed"></json>'
                  // + '<span ng-switch-when="Boolean" type="boolean">'
                  //     + '<input type="checkbox" ng-model="val" ng-model-onblur ng-change="child[key] = val">'
                  // + '</span>'
                  // + '<span ng-switch-when="Number" type="number"><input type="text" ng-model="val" '
                  //     + 'placeholder="0" ng-model-onblur ng-change="child[key] = possibleNumber(val)"/>'
                  // + '</span>'
                  //
                  // + '<span ng-switch-default class="jsonLiteral">'
                  // + '<input type="text" id="text" ng-model="val" length="498" ng-model-onblur ng-change="child[key] = val"/>'
                  // + '<label for="text">Text1</label>'
                  // + '</span>'

                  // Use checkboxes when looking for yes or no answers.
                  // The for attribute is necessary to bind our custom checkbox with the input.
                  // Add the input's id as the value of the for attribute of the label.

                  + '<span ng-switch-default class="jsonLiteral">'
                    + '<input ng-if="val.permission" type="text" id="text" ng-model="val.text" ng-model-onblur ng-change="child[key].text = val.text"/>'
                    + '<input ng-if="!val.permission" type="text" id="text" ng-model="val" ng-model-onblur ng-change="child[key] = val"/>' //  length="498"
                    + '<label for="text">Text</label>'
                  + '</span>'
              + '</span>';

        // display either "plus button" or "key-value inputs"
        var addItemTemplate =
        '<div ng-switch on="showAddKey" class="block" >'
            + '<span ng-switch-when="true">';
                if (scope.type == "object"){
                   // input key
                    addItemTemplate += '<input placeholder="Command" type="text" ui-keyup="{\'enter\':\'addItem(child)\'}" '
                        + 'class="form-control input-sm addItemKeyInput" ng-model="$parent.keyName" /> ';
                }

                  addItemTemplate +=
                  // value type dropdown
                  '<select ng-model="$parent.valueType" ng-options="option for option in valueTypes" class="form-control input-sm" ng-init="$parent.valueType=\''+stringName+'\'" ui-keydown="{\'enter\':\'addItem(child)\'}"></select>'

                  // input value
                  + '<span ng-show="$parent.valueType == \''+stringName+'\'"> <input type="text" placeholder="Text" '
                      + 'class="form-control input-sm addItemValueInput" ng-model="$parent.valueName" ui-keyup="{\'enter\':\'addItem(child)\'}"/></span> '
                  + '<span ng-show="$parent.valueType == \''+numberName+'\'"> <input type="text" placeholder="Value" '
                      + 'class="form-control input-sm addItemValueInput" ng-model="$parent.valueName" ui-keyup="{\'enter\':\'addItem(child)\'}"/></span> '
                  // Add button
                  + '<button class="btn btn-primary btn-sm" ng-click="addItem(child)">Add</button> '
                  + '<button class="btn btn-default btn-sm" ng-click="$parent.showAddKey=false">Cancel</button>'
              + '</span>'
              + '<span ng-switch-default>'
                  // plus button
                  //+ '<button class="addObjectItemBtn" ng-click="$parent.showAddKey = true"><i class="glyphicon glyphicon-plus"></i></button>'
                  + '<a ng-click="$parent.showAddKey = true" class="addObjectItemBtn  btn-floating btn-large waves-effect waves-light red"><i class="material-icons">add</i></a>'

              + '</span>'
          + '</div>';
                // }

        // start template
        if (scope.type == "object"){
            var template = '' //'<i ng-click="toggleCollapse()" class="material-icons">view_list</i>'
            //+ '<span class="jsonItemDesc">'+objectName+'</span>'
            + '<div class="jsonContents" ng-hide="collapsed">'
                // repeat
                + '<span class="block" ng-hide="key.indexOf(\'_\') == 0" ng-repeat="(key, val) in child">' // Default
                // + '<span class="block" ng-hide="key.indexOf(\'_\') == 0" ng-repeat="(key, val) in child | orderObjectBy">' // orderObjectBy
                // + '<span class="block" ng-hide="key.indexOf(\'_\') == 0" ng-repeat="(key, val) in child | orderBy:\'key\'">'
                +'<div class="row">'
                  +'<div class="input-field col" ng-class="val.permission ? \'s4\' : \'s6\'">'
                  // +'{{child}}'
                    +'<input id="command" type="text" ng-model="newkey" ng-init="newkey=key" ng-blur="moveKey(child, key, newkey)" style="text-transform: lowercase;">'
                    +'<label for="command">Command</label>'
                  +'</div>'

                  // + '<div class="input-field col s3">'
                  //   + '<p>'
                  //     + '<input type="checkbox" id="test5" />'
                  //     + '<label for="test5">Red</label>'
                  //   + '</p>'
                  // + '</div>'

                  + '<div class="col s2">'
                    + switchPermission
                  + '</div>'

                  + '<div class="input-field col s5 ">' + switchTemplate
                  //+'<i class="material-icons prefix" ng-click="deleteKey(child, key)">delete</i>'
                    +'<i class="fa fa-trash prefix" ng-click="deleteKey(child, key)"></i>'
                  + '</div>'

                +'</div>'

                + '</span>'

                + addItemTemplate
            + '</div>';
        } else if (scope.type == "array") {
            var template = '<i ng-click="toggleCollapse()" class="glyphicon"'
            + 'ng-class="chevron"></i>'
            + '<span class="jsonItemDesc">'+arrayName+'</span>'
            + '<div class="jsonContents" ng-hide="collapsed">'
                + '<ol class="arrayOl" ui-sortable="sortableOptions" ng-model="child">'
                    // repeat
                    + '<li class="arrayItem" ng-repeat="(key, val) in child track by $index">'
                        // delete button
                        + '<i class="deleteKeyBtn glyphicon glyphicon-trash" ng-click="deleteKey(child, $index)"></i>'
                        + '<i class="moveArrayItemBtn glyphicon glyphicon-align-justify"></i>'
                        + '<span>' + switchTemplate + '</span>'
                    + '</li>'
                    // repeat end
                + '</ol>'
                + addItemTemplate
            + '</div>';
        } else {
            console.error("scope.type was "+ scope.type);
        }

        var newElement = angular.element(template);
        $compile(newElement)(scope);
        element.replaceWith ( newElement );
    }
  };
}]);
