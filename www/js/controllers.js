angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $timeout, $rootScope) {
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
                $http.get('http://localhost:8000/api/authenticate/user').success(function(response){
                    var user = JSON.stringify(response.user);
                    localStorage.setItem('user', user);
                    $rootScope.currentUser = response.user;
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
  $scope.companies = [];
  $scope.error;
  $scope.company;
  $scope.listCanSwipe = true;

  $scope.updatePopup = function(company, label) {
    console.log(company,label);
  $scope.data = company;

  var myPopup = $ionicPopup.show({
    template: '<input type="text" ng-model="data.company"><input type="text" ng-model="data.address1"><input type="text" ng-model="data.address2"><input type="text" ng-model="data.address3"><input type="text" ng-model="data.address4"><input type="text" ng-model="data.address5"><input type="text" ng-model="data.registration_number"><input type="text" ng-model="data.bank_account_MY"><input type="text" ng-model="data.bank_account_SG">',
    title: 'Update company',
    scope: $scope,
    buttons: [
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
            name: company.name,
            address1: company.address1,
            address2: company.address2,
            address3: company.address3,
            address4: company.address4,
            address5: company.address5,
            registration_number: company.registration_number,
            bank_account_MY: company.bmy,
            bank_account_SG: company.bsg,
            user_id: $rootScope.currentUser.id

        }).success(function(response) {
            $scope.companies.unshift(response.data);
            console.log($scope.companies);
            $scope.company = '';
        }).error(function(){
          console.log("error");
        });
    };

    $scope.updateCompany = function(company){
      console.log(company);
      $http.put('http://localhost:8000/api/companies/' + company.company_id, {
            name: company.company,
            user_id: $rootScope.currentUser.id
        }).success(function(response) {
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
})

.controller('CompanyCtrl', function($http, $scope, $stateParams,$auth) {
      $http.get("http://localhost:8000/api/companies/"+$stateParams.companyId)
                .success(function(company, status, headers, config) {
                  console.log(company);
                    $scope.company = company;
                }).error(function(){
                  console.log("error");
              });
})

.controller('ClientsCtrl', function($scope, $stateParams, $auth, $rootScope, $http, $ionicPopup, $timeout) {
  $scope.clients = [];
  $scope.error;
  $scope.client;
  $scope.listCanSwipe = true;

  $scope.updatePopup = function(client, label) {
    console.log(client,label);
  $scope.data = client;

  var myPopup = $ionicPopup.show({
    template: '<input type="text" ng-model="data.name"><input type="text" ng-model="data.company_name"><input type="text" ng-model="data.registration_number"><input type="text" ng-model="data.address"><input type="text" ng-model="data.country"><input type="text" ng-model="data.email"><input type="text" ng-model="data.contact_number">',
    title: 'Update client',
    scope: $scope,
    buttons: [
      {
        text: '<b>'+label+'</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.data.name) {
            e.preventDefault();
          } else {
            return $scope.data;
          }
        }
      }
    ]
  });
  myPopup.then(function(res) {
    $scope.updateClient(res);
    console.log(res);
  });
 };
        
  $scope.lastpage=1;
  $scope.init = function() {
                $scope.lastpage=1;
                $http({
                    url: 'http://localhost:8000/api/clients',
                    method: "GET",
                    params: {page: $scope.lastpage}
                }).success(function(clients, status, headers, config) {
                    $scope.clients = clients.data;
                    $scope.currentpage = clients.current_page;
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
                    url: 'http://localhost:8000/api/clients',
                    method: "GET",
                    params: {limit: limit, page:  $scope.lastpage}
                }).success(function (clients, status, headers, config) {
                    console.log(clients);
                    if (clients.next_page_url == null){
                         $scope.noMoreItemsAvailable = true;
                     }
                    $scope.clients = $scope.clients.concat(clients.data);
                });
                $scope.$broadcast('scroll.infiniteScrollComplete');
            };

  $scope.doRefresh = function(){
    $scope.init();
    $scope.loadMore();
    $scope.$broadcast('scroll.refreshComplete');
  }

    $scope.addClient = function(client) {

      console.log("add client:",client);

        $http.post('http://localhost:8000/api/clients', {
            name: client.name,
            company_name: client.company_name,
            registration_number: client.registration_number,
            address: client.address,
            country: client.country,
            email: client.email,
            contact_number: client.contact_number,
            user_id: $rootScope.currentUser.id
        }).success(function(response) {
            $scope.clients.unshift(response.data);
            console.log($scope.clients);
            $scope.client = '';
        }).error(function(){
          console.log("error");
        });
    };

    $scope.updateClient = function(client){
      console.log(client);
      $http.put('http://localhost:8000/api/clients/' + client.client_id, {
            name: client.name,
            company_name: client.company_name,
            registration_number: client.registration_number,
            address: client.address,
            country: client.country,
            email: client.email,
            contact_number: client.contact_number,
            user_id: $rootScope.currentUser.id
        }).success(function(response) {
        }).error(function(){
          console.log("error");
        });
    }

  $scope.deleteClient = function(index, clientId){
      console.log(index, clientId);
        $http.delete('http://localhost:8000/api/clients/' + clientId)
            .success(function() {
                $scope.clients.splice(index, 1);
            });;
    }
    $scope.init();
})

.controller('ClientCtrl', function($http, $scope, $stateParams,$auth) {
      $http.get("http://localhost:8000/api/clients/"+$stateParams.clientId)
                .success(function(client, status, headers, config) {
                  console.log(client);
                    $scope.client = client;
                }).error(function(){
                  console.log("error");
              });
})

.controller('QuotationsCtrl', function($scope, $stateParams, $auth, $rootScope, $http, $ionicPopup, $timeout) {
  $scope.quotations = [];
  $scope.error;
  $scope.quotation;
  $scope.listCanSwipe = true;

  $scope.updatePopup = function(quotation, label) {
    console.log(quotation,label);
  $scope.data = quotation;
  var myPopup = $ionicPopup.show({
    template: '<input type="text" ng-model="data.client_id"><input type="text" ng-model="data.subject"><input type="text" ng-model="data.item"><input type="text" ng-model="data.description"><input type="text" ng-model="data.cost"><input type="text" ng-model="data.quantity"><input type="text" ng-model="data.amount_paid"><input type="text" ng-model="data.company_id"><input type="text" ng-model="data.payment_type"><input type="text" ng-model="data.currency">',
    title: 'Update Quotation',
    scope: $scope,
    buttons: [
      {
        text: '<b>'+label+'</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.data.subject) {
            e.preventDefault();
          } else {
            return $scope.data;
          }
        }
      }
    ]
  });
  myPopup.then(function(res) {
    $scope.updatequotation(res);
    console.log(res);
  });
 };
        
  $scope.lastpage=1;
  $scope.init = function() {
                $scope.lastpage=1;
                $http({
                    url: 'http://localhost:8000/api/quotations',
                    method: "GET",
                    params: {page: $scope.lastpage}
                }).success(function(quotations, status, headers, config) {
                    $scope.quotations = quotations.data;
                    $scope.currentpage = quotations.current_page;
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
                    url: 'http://localhost:8000/api/quotations',
                    method: "GET",
                    params: {limit: limit, page:  $scope.lastpage}
                }).success(function (quotations, status, headers, config) {
                    console.log(quotations);
                    if (quotations.next_page_url == null){
                         $scope.noMoreItemsAvailable = true;
                     }
                    $scope.quotations = $scope.quotations.concat(quotations.data);
                });
                $scope.$broadcast('scroll.infiniteScrollComplete');
            };

  $scope.doRefresh = function(){
    $scope.init();
    $scope.loadMore();
    $scope.$broadcast('scroll.refreshComplete');
  }

    $scope.addQuotation = function(quotation) {

      console.log("add quotation:",quotation);

        $http.post('http://localhost:8000/api/quotations', {
            client_id: quotation.client_id,
            subject: quotation.subject,
            item: quotation.item,
            description: quotation.description,
            cost: quotation.cost,
            quantity: quotation.quantity,
            quotation_status: quotation.quotation_status,
            created_at: quotation.created_at,
            amount_paid: quotation.amount_paid,
            company_id: quotation.company_id,
            payment_type: quotation.payment_type,
            currency: quotation.currency,
            user_id: $rootScope.currentUser.id
        }).success(function(response) {
            $scope.quotations.unshift(response.data);
            console.log($scope.quotations);
            $scope.quotation = '';
        }).error(function(){
          console.log("error");
        });
    };

    $scope.updateQuotation = function(quotation){
      console.log(quotation);
      $http.put('http://localhost:8000/api/quotations/' + quotation.quotation_id, {
            client_id: quotation.client_id,
            subject: quotation.subject,
            item: quotation.item,
            description: quotation.description,
            cost: quotation.cost,
            quantity: quotation.quantity,
            quotation_status: quotation.quotation_status,
            amount_paid: quotation.amount_paid,
            company_id: quotation.company_id,
            payment_type: quotation.payment_type,
            currency: quotation.currency,
            user_id: $rootScope.currentUser.id
        }).success(function(response) {
        }).error(function(){
          console.log("error");
        });
    }

  $scope.deleteQuotation = function(index, quotationId){
      console.log(index, quotationId);
        $http.delete('http://localhost:8000/api/quotations/' + quotationId)
            .success(function() {
                $scope.quotations.splice(index, 1);
            });;
    }
    $scope.init();
})

.controller('QuotationCtrl', function($http, $scope, $stateParams,$auth) {
      $http.get("http://localhost:8000/api/quotations/"+$stateParams.quotationId)
                .success(function(quotation, status, headers, config) {
                  console.log(quotation);
                    $scope.quotation = quotation;
                }).error(function(){
                  console.log("error");
              });
});




