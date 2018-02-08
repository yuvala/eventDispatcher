'use strict';

/**
 * @ngdoc object
 * @name EventsDispatcher
 * @description Provides a constructor function for creating an events dispatcher object.
 * The new object will have an `on` method for registering to events and a `dispatch` method for firing an event.
 *
 * @example
 * <pre>
 // The following example shows how a service can support event registration and dispatching using the `EventsDispatcher` object.
 //   * `DispatcherService` is the service firing the events.
 //   * `ListenerCtrl` is a controller registering to the events.
 //   * `ListenerService` is a service registering to the events.
 angular.module('myModule').service('DispatcherService', function(EventsDispatcher) {
     var eventsDispatcher = new EventsDispatcher();

     // add to the service a public method which enables clients to register to events
     this.on = eventsDispatcher.on;

     this.setPropertyValue = function(propertyName, propertyValue) {
         // change property value...

         // dispatch event
         eventsDispatcher.dispatch('propertyChanged', propertyName, propertyValue);
     };
 });

 angular.module('myModule').controller('ListenerCtrl', function($scope, DispatcherService) {

     function onPropertyChanged(event, propertyName, propertyValue) {
         // update state according to change...
     }

     // register to the `propertyChanged` event (pass the $scope so that the listener
     // will be automatically unregistered when the scope is destroyed)
     DispatcherService.on('propertyChanged', onPropertyChanged, $scope);
 });

 angular.module('myModule').service('ListenerService', function(DispatcherService) {

     function onPropertyChanged(event, propertyName, propertyValue) {
         // update state according to change...
     }

     // register to the `propertyChanged` event
     var unregisterFn = DispatcherService.on('propertyChanged', onPropertyChanged);

     this.destroy = function() {
         // when the object is destroyed we need to explicitly unregister from the events
         // (since we didn't pass any scope when registering)
         unregisterFn();
     };
 });
 * </pre>
 */
angular.module('udo.factories').factory('EventsDispatcher', ['$window', function ($window) {
    return $window.EventsDispatcher;
}]);