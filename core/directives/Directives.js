// app.directive('stopEvent', function () {
//     return {
//         restrict: 'A',
//         link: function (scope, element, attr) {
//             element.bind('click', function (e) {
//                 e.stopPropagation();
//             });
//         }
//     };
// });

// app.directive('ngRightClick', function($parse) {
//     return function(scope, element, attrs) {
//         var fn = $parse(attrs.ngRightClick);
//         element.bind('contextmenu', function(event) {
//             scope.$apply(function() {
//                 event.preventDefault();
//                 fn(scope, {$event:event});
//             });
//         });
//     };
// });

// app.directive('fileDrop', function ( $parse ) {
// 	return function (scope, element, attrs) {
//     	var fn = $parse(attrs.fileDrop);
// 		element.bind('drop', function(event){
//         	scope.$apply(function() {
// 				event.preventDefault();
// 				event.stopPropagation();
// 				var file = event.dataTransfer.files[0], reader = new FileReader();
// 				fn(scope, {$event:event, file: file});
// 			});
// 		});
// 		element.bind('dragover', function(event){
//         	scope.$apply(function() {
// 				element.addClass('file-drop-over');
// 			});
// 		});
// 		element.bind('dragleave', function(event){
//         	scope.$apply(function() {
// 				element.removeClass('file-drop-over');
// 			});
// 		});
// 	};
// });


app.directive('script', function() {
    return {
      restrict: 'E',
      scope: false,
      link: function(scope, elem, attr)
      {
        if (attr.type==='text/javascript-lazy')
        {
          var s = document.createElement("script");
          s.type = "text/javascript";
          var src = elem.attr('src');
          if(src!==undefined)
          {
              s.src = src;
          }
          else
          {
              var code = elem.text();
              s.text = code;
          }
          document.head.appendChild(s);
          elem.remove();
        }
      }
    };
  });