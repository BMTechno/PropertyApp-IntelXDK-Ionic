angular.module('app.controllers', [])

.run(function($rootScope, $ionicLoading){
    
    $rootScope.properties = [];
    
    /* $rootScope.properties = [
        {id: 1, name: "Kajang Kondo", price: "120,000"},
        {id: 2, name: "Subang Apartment", price: "300,000"},
        {id: 3, name: "Bangi Semi-D", price: "500,000"}
    ]; */
    
//    $ionicLoading.show({
//      content: 'Loading...',
//        animation: 'fade-in',
//        showBackdrop: true,
//        maxWidth: 200,
//        showDelay: 200
//    });
//    
   $rootScope.loading = $ionicLoading.show({
        delay: 100
      });

    
    //get data from firebase
    firebase.database().ref('/propertyListing/').once('value').then(function(snapshot){
        
        $rootScope.$apply(function(){
            snapshot.forEach(function(propertySnapshot){
                
                $rootScope.properties.push({
                    id: $rootScope.properties.length+1,
                    name: propertySnapshot.child('name').val(),
                    price: propertySnapshot.child('price').val(),
                    latitude: propertySnapshot.child('latitude').val(),
                    longitude: propertySnapshot.child('longitude').val(),
                    image: propertySnapshot.child('image').val()  
                }); // end of properties.push
            });// end of for each
        });// end of apply  
        $rootScope.loading.hide();
    }); //end of .once function
    
    //console.log($rootScope.properties);  
     //$rootScope.loading.hide();
})
  
.controller('propertyListingCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('addNewCtrl', ['$scope', '$stateParams', '$state', '$cordovaCamera', '$cordovaGeolocation', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state, $cordovaCamera, $cordovaGeolocation) {
    
    $scope.image = "";
    
      var posOptions = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          $scope.latitude  = position.coords.latitude;
          $scope.longitude = position.coords.longitude;
          $scope.latlong = $scope.latitude + ", " + $scope.longitude;
        }, function(err) {
          // error
        });
    
    $scope.saveProperty = function(){
        
        $scope.properties.push({
            id: $scope.properties.length + 1,
            name: $scope.name,
            price: $scope.price,
            image: $scope.image,
            latitude: $scope.latitude,
            longitude: $scope.longitude
        });
        
        //save data to Firebase
        
        var postData = {
            name: $scope.name, 
            price: $scope.price, 
            latitude: $scope.latitude, 
            longitude: $scope.longitude, 
            image: $scope.image
        };
        
        var newPostKey = firebase.database().ref().child('propertyListing').push().key;
        
        var updates = {};
        updates['/propertyListing/' + newPostKey] = postData;
        
        firebase.database().ref().update(updates);
        
        navigator.notification.alert("New property submitted!");
        
        console.log($scope.properties);
        
        $state.go('propertyListing');  
    }
    
    $scope.takePicture = function(){
        
        document.addEventListener("deviceready", function () {

        var options = {
          quality: 50,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: false,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 240,
          targetHeight: 160,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false,
          correctOrientation:true
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
          var image = document.getElementById('myImage');
          image.src = "data:image/jpeg;base64," + imageData;
          $scope.image = imageData;
        }, function(err) {
          // error
        });

      }, false);
        
    }

}])
   
.controller('propertyDetailsCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {
    
    $scope.property = $scope.properties.filter(function(property){
        return property.id == $stateParams.id;
    }).pop();
    
    
    function initMap(){
        
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 18
        });
        
        var infoWindow = new google.maps.InfoWindow({map: map});
        
        var pos = {
              lat: $scope.property.latitude,
              lng: $scope.property.longitude
        };

        infoWindow.setPosition(pos);
        infoWindow.setContent($scope.property.name);
        map.setCenter(pos);
    } // end of initMap
    
    initMap()
    
}])
 