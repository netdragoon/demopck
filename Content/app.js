var app = angular.module("app", ['ngRoute', 'ui.router']);

app.directive('onlyNum', function () {
    return function (scope, element, attrs) {
        var keyCode = [8, 9, 13, 37, 39, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 110];
        element.bind("keydown", function (event) {
            //console.log($.inArray(event.which,keyCode));
            if ($.inArray(event.which, keyCode) == -1) {
                scope.$apply(function () {
                    scope.$eval(attrs.onlyNum);
                    event.preventDefault();
                });
                event.preventDefault();
            }
        });
    };
});

app.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider
          .when('/', {
              templateUrl: '/view/home',
              controller: 'menu'
          })
          .when('/zipcode', {
              templateUrl: '/view/zipcode',
              controller: 'zipcode'
          })
          .otherwise({ redirectTo: '/' });
  }]);
app.controller('menu', function ($scope, $routeParams, $http) {



});
app.controller('zipcode', function ($scope, $routeParams, $http) {

    $scope.cep = '';
    $scope.data = {};

    $scope.clear = function ()
    {
        $scope.cep = '';
        $scope.data = { 'Zip': "", 'Address': "", 'District': "", 'City': "", 'Uf': "", 'Ibge': "", 'Erro': true, 'Complement': "", 'Gia': "" };
        $("#cep").focus();
    }

    $scope.submit = function ()
    {
        if ($scope.verify()) {
            $http.post('/operation/zipcode', { 'cep': $scope.cep })
                .success(function (data) {                    
                    if (data.Erro) {
                        $scope.clear();
                        alert('CEP inválido ou inexistente');
                    } else {
                        $scope.data = data;
                    }
                    console.log(data);
                })
                .error(function (data) {
                    $scope.clear();
                    console.log(data);
                });
        } else {
            $scope.clear();
            alert("Cep inválido ...");
        }
        
    }

    $scope.verify = function () {
        var tstCep = /^[0-9]{8}$/;
        return $scope.cep !== '' && $scope.cep.length === 8 && tstCep.test($scope.cep);
    }

    $scope.clear();

});