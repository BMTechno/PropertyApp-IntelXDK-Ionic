angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
    .state('propertyListing', {
    url: '/listing',
    templateUrl: 'templates/propertyListing.html',
    controller: 'propertyListingCtrl'
  })

  .state('addNew', {
    url: '/add',
    templateUrl: 'templates/addNew.html',
    controller: 'addNewCtrl'
  })

  .state('propertyDetails', {
    url: '/details/:id',
    templateUrl: 'templates/propertyDetails.html',
    controller: 'propertyDetailsCtrl'
  })

$urlRouterProvider.otherwise('/listing')

  

});