(function () {
    "use strict";

    angular.module("abApp").factory("ContactsService", function ($http, $q) {
        function parseXMLToContacts(xmlText) {
            console.log("Raw XML:", xmlText);

            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(xmlText, "application/xml");

            var parseError = xmlDoc.getElementsByTagName("parsererror")[0];
            if (parseError) {
                return $q.reject(new Error("Invalid XML"));
            }

            var nodes = Array.from(xmlDoc.getElementsByTagName("Contact"));
            if (
                !nodes.length &&
                xmlDoc.documentElement &&
                xmlDoc.documentElement.tagName === "Contact"
            ) {
                nodes = [xmlDoc.documentElement];
            }

            function txt(parent, tag) {
                var el = parent.getElementsByTagName(tag)[0];
                return el && el.textContent ? el.textContent.trim() : "";
            }

            var contacts = nodes.map(function (n, i) {
                var fullName = txt(n, "ContactName");
                var parts = fullName ? fullName.split(/\s+/) : [];
                var first = parts[0] || "";
                var last = parts.slice(1).join(" ") || "";

                return {
                    id: txt(n, "CustomerID") || String(i + 1),
                    firstName: first,
                    lastName: last,
                    email: txt(n, "Email"),
                    phone: txt(n, "Phone"),
                    company: txt(n, "CompanyName"),
                    title: txt(n, "ContactTitle"),
                    address: txt(n, "Address"),
                    city: txt(n, "City"),
                    zip: txt(n, "PostalCode"),
                    country: txt(n, "Country"),
                    fax: txt(n, "Fax"),
                };
            });

            console.log(
                "Parsed contacts:",
                contacts.length,
                contacts[0] || null
            );
            return contacts;
        }

        function load() {
            return $http
                .get("ab.xml", { responseType: "text" })
                .then(function (res) {
                    return parseXMLToContacts(res.data);
                })
                .catch(function (err) {
                    console.error("Error loading XML:", err);
                    return $q.reject(err);
                });
        }

        return { load: load };
    });
})();