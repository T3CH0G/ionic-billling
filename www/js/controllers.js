angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $timeout, $rootScope) {


  // $rootScope.currentUser == null;

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  // $scope.loginData = {};

  // // Create the login modal that we will use later
  // $ionicModal.fromTemplateUrl('templates/login.html', {
  //   scope: $scope
  // }).then(function(modal) {
  //   $scope.modal = modal;
  // });

  // // Triggered in the login modal to close it
  // $scope.closeLogin = function() {
  //   $scope.modal.hide();
  // };

  // // Open the login modal
  // $scope.login = function() {
  //   $scope.modal.show();
  // };

  // // Perform the login action when the user submits the login form
  // $scope.doLogin = function() {
  //   console.log('Doing login', $scope.loginData);

  //   // Simulate a login delay. Remove this and replace with your login
  //   // code if using a login system
  //   $timeout(function() {
  //     $scope.closeLogin();
  //   }, 1000);
  // };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})
.controller('AuthCtrl', function($scope, $location, $stateParams, $ionicHistory, $http, $state, $auth, $rootScope) {

        $scope.loginData = {}
        $scope.loginError = false;
        $scope.loginErrorText;

        $scope.login = function() {

            var credentials = {
                email: $scope.loginData.email,
                password: $scope.loginData.password
            }

            console.log(credentials);

            $auth.login(credentials).then(function() {
                // Return an $http request for the authenticated user
                $http.get('http://localhost:8000/api/authenticate/user').success(function(response){
                    // Stringify the retured data
                    var user = JSON.stringify(response.user);

                    // Set the stringified user data into local storage
                    localStorage.setItem('user', user);

                    // Getting current user data from local storage
                    $rootScope.currentUser = response.user;
                    // $rootScope.currentUser = localStorage.setItem('user');;
                    
                    $ionicHistory.nextViewOptions({
                      disableBack: true
                    });

                    $state.go('app.companies');
                })
                .error(function(){
                    $scope.loginError = true;
                    $scope.loginErrorText = error.data.error;
                    console.log($scope.loginErrorText);
                })
            });
        }

})

.controller('CompaniesCtrl', function($scope, $stateParams, $auth, $rootScope, $http, $ionicPopup, $timeout) {
  // $scope.companies = [
  //   { company: 'First company', id: 1 },
  //   { company: 'Second company', id: 2 },
  //   { company: 'Third company', id: 3 },
  //   { company: 'Fourth company', id: 4 },
  //   { company: 'Fifth company', id: 5 },
  //   { company: 'Sixth company', id: 6 }
  // ];

  // console.log($rootScope.currentUser);
  $scope.companies = [];
  $scope.error;
  $scope.company;

  $scope.listCanSwipe = true;

  // Update Popup
  $scope.updatePopup = function(company, label) {
    console.log(company,label);
  $scope.data = company;

  var myPopup = $ionicPopup.show({
    template: '<input type="text" ng-model="data.company">',
    title: 'Update company',
    // subTitle: 'Please use normal things',
    scope: $scope,
    buttons: [
      // { text: 'Cancel' },
      {
        text: '<b>'+label+'</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.data.company) {
            e.preventDefault();
          } else {
            return $scope.data;
          }
        }
      }
    ]
  });
  myPopup.then(function(res) {
    $scope.updateCompany(res);
    console.log(res);
  });
 };

        
  $scope.lastpage=1;
  $scope.init = function() {
                $scope.lastpage=1;
                $http({
                    url: 'http://localhost:8000/api/companies',
                    method: "GET",
                    params: {page: $scope.lastpage}
                }).success(function(companies, status, headers, config) {
                    $scope.companies = companies.data;
                    $scope.currentpage = companies.current_page;
                });
            };
  $scope.noMoreItemsAvailable = false;
  $scope.loadMore = function(limit) {
    console.log("Load More Called");
                if(!limit){
                  limit = 5;
                }

                $scope.lastpage +=1;
                $http({
                    url: 'http://localhost:8000/api/companies',
                    method: "GET",
                    params: {limit: limit, page:  $scope.lastpage}
                }).success(function (companies, status, headers, config) {
                    console.log(companies);

                    if (companies.next_page_url == null){
                         $scope.noMoreItemsAvailable = true;
                     }
 
                    $scope.companies = $scope.companies.concat(companies.data);

 
                });
                $scope.$broadcast('scroll.infiniteScrollComplete');
            };

  $scope.doRefresh = function(){
    $scope.init();
    $scope.loadMore();
    $scope.$broadcast('scroll.refreshComplete');
  }

    $scope.addCompany = function(company) {

      console.log("add company: ",company);

        $http.post('http://localhost:8000/api/companies', {
            name: company,
            user_id: $rootScope.currentUser.id
            // user_id: 1
        }).success(function(response) {
            // console.log($scope.companies);
            // $scope.companies.push(response.data);
            $scope.companies.unshift(response.data);
            console.log($scope.companies);
            $scope.company = '';
            // alert(data.message);
            // alert("company Created Successfully");
        }).error(function(){
          console.log("error");
        });
    };

    $scope.updateCompany = function(company){
      console.log(company);
      $http.put('http://localhost:8000/api/companies/' + company.company_id, {
            name: company.company,
            user_id: $rootScope.currentUser.id
            // user_id: 1
        }).success(function(response) {
            // alert("company Updated Successfully");
        }).error(function(){
          console.log("error");
        });
    }

  $scope.deleteCompany = function(index, companyId){
      console.log(index, companyId);

        $http.delete('http://localhost:8000/api/companies/' + companyId)
            .success(function() {
                $scope.companies.splice(index, 1);
            });;
    }

    $scope.init();
});
