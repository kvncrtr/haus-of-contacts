(function () {
    "use strict";

    angular
        .module("abApp")
        .controller("ContactsController", function ($scope, ContactsService) {
            var vm = this;

            vm.loading = true;
            vm.error = "";
            vm.contacts = [];
            vm.searchText = "";
            vm.letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
            vm.filters = {
                country: "",
                city: "",
                company: "",
                title: "",
                startsWith: "",
            };
            vm.facets = {
                countries: [],
                cities: [],
                companies: [],
                titles: [],
            };

            vm.onCountryChange = function () {
                vm.filters.city = "";
                vm.filters.company = "";
                vm.filters.title = "";
                updateFacets();
            };

            vm.onCityChange = function () {
                vm.filters.company = "";
                vm.filters.title = "";
                buildCompanyFacet();
                buildTitleFacet();
            };

            vm.onCompanyChange = function () {
                vm.filters.title = "";
                buildTitleFacet();
            };

            vm.onTitleChange = angular.noop;

            function norm(s) {
                return (s == null ? "" : String(s)).trim().toLowerCase();
            }

            vm.toggleStartsWith = function (L) {
                vm.filters.startsWith = vm.filters.startsWith === L ? "" : L;
            };

            vm.clearAll = function () {
                vm.searchText = "";
                vm.filters = {
                    country: "",
                    city: "",
                    company: "",
                    title: "",
                    startsWith: "",
                };
                updateFacets();
            };

            vm.search = function (c) {
                var q = norm(vm.searchText);

                var matchesText =
                    !q ||
                    [
                        c.firstName,
                        c.lastName,
                        c.company,
                        c.title,
                        c.email,
                        c.phone,
                        c.city,
                        c.country,
                        c.zip,
                    ].some(function (v) {
                        return norm(v).indexOf(q) !== -1;
                    });

                var chosenCountry = norm(vm.filters.country);
                var chosenCity = norm(vm.filters.city);
                var chosenCompany = norm(vm.filters.company);
                var chosenTitle = norm(vm.filters.title);

                var matchesCountry =
                    !chosenCountry || norm(c.country) === chosenCountry;
                var matchesCity = !chosenCity || norm(c.city) === chosenCity;
                var matchesCompany =
                    !chosenCompany || norm(c.company) === chosenCompany;
                var matchesTitle =
                    !chosenTitle || norm(c.title) === chosenTitle;

                var letter = norm(vm.filters.startsWith);
                var nameForAlpha = norm(c.lastName || c.firstName || "");
                var matchesAlpha = !letter || nameForAlpha.charAt(0) === letter;

                return (
                    matchesText &&
                    matchesCountry &&
                    matchesCity &&
                    matchesCompany &&
                    matchesTitle &&
                    matchesAlpha
                );
            };

            function buildCountryFacet() {
                var map = Object.create(null);
                (vm.contacts || []).forEach(function (c) {
                    var raw = (c.country || "").trim();
                    if (!raw) return;
                    var k = raw.toLowerCase();
                    if (!map[k]) map[k] = raw;
                });
                vm.facets.countries = Object.keys(map)
                    .map(function (k) {
                        return map[k];
                    })
                    .sort();
            }

            function buildCityFacet() {
                var map = Object.create(null);
                var chosenCountry = norm(vm.filters.country);
                (vm.contacts || []).forEach(function (c) {
                    if (chosenCountry && norm(c.country) !== chosenCountry)
                        return;
                    var raw = (c.city || "").trim();
                    if (!raw) return;
                    var k = raw.toLowerCase();
                    if (!map[k]) map[k] = raw;
                });
                vm.facets.cities = Object.keys(map)
                    .map(function (k) {
                        return map[k];
                    })
                    .sort();
            }

            function buildCompanyFacet() {
                var map = Object.create(null);
                var chosenCountry = norm(vm.filters.country);
                var chosenCity = norm(vm.filters.city);

                (vm.contacts || []).forEach(function (c) {
                    if (chosenCountry && norm(c.country) !== chosenCountry)
                        return;
                    if (chosenCity && norm(c.city) !== chosenCity) return;

                    var raw = (c.company || "").trim();
                    if (!raw) return;

                    var k = raw.toLowerCase();
                    if (!map[k]) map[k] = raw;
                });

                vm.facets.companies = Object.keys(map)
                    .map(function (k) {
                        return map[k];
                    })
                    .sort();
            }

            function buildTitleFacet() {
                var map = Object.create(null);
                var chosenCountry = norm(vm.filters.country);
                var chosenCity = norm(vm.filters.city);
                var chosenCompany = norm(vm.filters.company);

                (vm.contacts || []).forEach(function (c) {
                    if (chosenCountry && norm(c.country) !== chosenCountry)
                        return;
                    if (chosenCity && norm(c.city) !== chosenCity) return;
                    if (chosenCompany && norm(c.company) !== chosenCompany)
                        return;

                    var raw = (c.title || "").trim();
                    if (!raw) return;
                    var k = raw.toLowerCase();
                    if (!map[k]) map[k] = raw;
                });

                vm.facets.titles = Object.keys(map)
                    .map(function (k) {
                        return map[k];
                    })
                    .sort();
            }

            function updateFacets() {
                buildCountryFacet();
                buildCityFacet();
                buildCompanyFacet();
                buildTitleFacet();
            }

            ContactsService.load()
                .then(function (rows) {
                    vm.contacts = rows || [];
                    updateFacets();
                })
                .catch(function (err) {
                    vm.error =
                        (err && err.message) || "Failed to load contacts";
                })
                .finally(function () {
                    vm.loading = false;
                });
        });
})();
