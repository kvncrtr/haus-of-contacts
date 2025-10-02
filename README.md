# ADS Front End Developer Test – Address Book (AngularJS 1.8.3)

## View Live
- [Link to the application live](https://haus-of-contacts.netlify.app/)

## Run locally
- Node: `http-server -p 5173 .` → http://localhost:5173

> Note: `ab.xml` is fetched via XHR, so you must use a local server.

## Features
- XML → normalized contacts via `ContactsService`.
- Views: Table + filters UI.
- Filters: Search, Country → City cascade, Company, Title, A–Z.
- Accessible, responsive, modern UI (sticky header, focus rings).

## Files of interest
- `services/contacts.service.js` – XML parsing to:
  `{ id, firstName, lastName, email, phone, company, title, address, city, zip, country, fax }`
- `controllers/contacts.controller.js` – Facets & filter logic.
- `views/table.view.html` – Template.
- `assets/styles.css` – Styles and CSS variables.

## Known limits / next steps
- Optional: client-side sorting, pagination, and saved filters.
