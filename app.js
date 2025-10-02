(function () {
    "use strict";

    angular
        .module("abApp", ["ngRoute"])
        .config(function ($routeProvider, $locationProvider) {
            $locationProvider.hashPrefix("!");
            $routeProvider
                .when("/", {
                    templateUrl: "views/table.view.html",
                    controller: "ContactsController",
                    controllerAs: "vm",
                })
                .when("/cards", {
                    templateUrl: "views/cards.view.html",
                    controller: "ContactsController",
                    controllAs: "vm",
                })
                .otherwise({ redirectTo: "/" });
        })
        .run(function () {
            console.log("🚀 Angular boot OK");
        });
})();
