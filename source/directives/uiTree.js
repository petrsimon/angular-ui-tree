(function () {
  'use strict';

  angular.module('ui.tree')
  .directive('uiTree', [ 'treeConfig', '$window',
    function(treeConfig, $window) {
      return {
        restrict: 'A',
        scope: true,
        controller: 'TreeController',
        link: function(scope, element, attrs) {
          var callbacks = {
            accept: null,
            beforeDrag: null
          };

          var config = {};
          angular.extend(config, treeConfig);
          if (config.treeClass) {
            element.addClass(config.treeClass);
          }

          scope.$emptyElm = angular.element($window.document.createElement('div'));
          if (config.emptyTreeClass) {
            scope.$emptyElm.addClass(config.emptyTreeClass);
          }

          scope.$watch('$nodesScope.$modelValue.length', function() {
            if (scope.$nodesScope.$modelValue) {
              scope.resetEmptyElement();
            }
          }, true);

          scope.$watch(attrs.dragEnabled, function(val) {
            if((typeof val) == "boolean") {
              scope.dragEnabled = val;
            }
          });

          scope.$watch(attrs.emptyPlaceHolderEnabled, function(val) {
            if((typeof val) == "boolean") {
              scope.emptyPlaceHolderEnabled = val;
            }
          });

          scope.$watch(attrs.nodropEnabled, function(val) {
            if((typeof val) == "boolean") {
              scope.nodropEnabled = val;
            }
          });

          scope.$watch(attrs.cloneEnabled, function(val) {
            if((typeof val) == "boolean") {
              scope.cloneEnabled = val;
            }
          });

          scope.$watch(attrs.maxDepth, function(val) {
            if((typeof val) == "number") {
              scope.maxDepth = val;
            }
          });

          scope.$watch(attrs.dragDelay, function(val) {
            if((typeof val) == "number") {
              scope.dragDelay = val;
            }
          });

          /**
           * Types are defined by 'file_type' : [accepted children types]
           <pre>
           var types = {
                 'file': [],
                 'folder': ['file', 'folder']
                 };
           </pre>
           * @param src
           * @param dest
           * @returns {boolean}
           */
          function typeCheck(src, dest) {
            // turn off node type checking when no types defined
            if (!scope.types) return true;

            var res = false,
              st = src.$modelValue.type,
              parent = dest.$parent.$modelValue;

            // when we are at the root
            if (parent == undefined) {
              res = scope.types[st] !== undefined;
            } else {
              var pt = parent.type;
              res = scope.types[pt] && (scope.types[pt].indexOf(st) !== -1);
            }

            return res;
          }

          // check if the dest node can accept the dragging node
          // by default, we check the 'data-nodrop-enabled' attribute in `ui-tree-nodes`
          // and the 'max-depth' attribute in `ui-tree` or `ui-tree-nodes`.
          // the method can be overrided
          callbacks.accept = function(sourceNodeScope, destNodesScope, destIndex) {
            if (destNodesScope.nodropEnabled || destNodesScope.outOfDepth(sourceNodeScope)) {
              return false;
            }

            return typeCheck(sourceNodeScope, destNodesScope);
          };


          callbacks.beforeDrag = function(sourceNodeScope) {
            return true;
          };

          callbacks.removed = function(node){

          };

          callbacks.dropped = function(event) {

          };

          //
          callbacks.dragStart = function(event) {

          };

          callbacks.dragMove = function(event) {

          };

          callbacks.dragStop = function(event) {

          };

          callbacks.beforeDrop = function(event) {

          };

          callbacks.changed = function (nodeScope){

          };

          scope.$watch(attrs.uiTree, function(newVal, oldVal){
            angular.forEach(newVal, function(value, key){
              if (callbacks[key]) {
                if (typeof value === "function") {
                  callbacks[key] = value;
                }
              }
            });

            scope.$callbacks = callbacks;
          }, true);


        }
      };
    }
  ]);
})();
