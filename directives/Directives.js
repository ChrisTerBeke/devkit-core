app.directive('stopEvent', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind('click', function (e) {
                e.stopPropagation();
            });
        }
    };
});

app.directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                event.stopPropagation();
                fn(scope, {$event:event});
            });
        });
    };
});

app.directive('fileDrop', function ( $parse ) {
	return function (scope, element, attrs) {
    	var fn = $parse(attrs.fileDrop);
		element.bind('drop', function(event){
        	scope.$apply(function() {
				event.preventDefault();
				event.stopPropagation();
				var file = event.dataTransfer.files[0];
				fn(scope, {$event:event, file: file});
			});
		});
		element.bind('dragover', function(event){
        	scope.$apply(function() {
				element.addClass('file-drop-over');
			});
		});
		element.bind('dragleave', function(event){
        	scope.$apply(function() {
				element.removeClass('file-drop-over');
			});
		});
	};
});

app.directive('showFocus', function($timeout) {
  return function(scope, element, attrs) {
    scope.$watch(attrs.showFocus, 
      function (newValue) { 
        $timeout(function() {
            newValue && element[0].focus();
            element[0].select();
        });
      },true);
  };    
});

app.directive('clickOutside', ['$document', function($document) {
    return {
        restrict: 'A',
        scope: {
            clickOutside: '&'
        },
        link: function ($scope, elem, attr) {
            var classList = (attr.outsideIfNot !== undefined) ? attr.outsideIfNot.replace(', ', ',').split(',') : [];
            if (attr.id !== undefined) classList.push(attr.id);

            $document.on('click', function (e) {
                var i = 0,
                    element;

                if (!e.target) return;

                for (element = e.target; element; element = element.parentNode) {
                    var id = element.id;
                    var classNames = element.className;

                    if (id !== undefined) {
                        for (i = 0; i < classList.length; i++) {
                            if (id.indexOf(classList[i]) > -1 || classNames.indexOf(classList[i]) > -1) {
                                return;
                            }
                        }
                    }
                }

                $scope.$eval($scope.clickOutside);
            });
        }
    };
}]);

    