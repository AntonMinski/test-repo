# Full stack challenge

Let’s assume we have a user that can administer buildings' tenants.
A user has a name & password.
A tenant has a name, phone number, address, and a financial debt (Or no debt).
Let’s assume a user is not a tenant.

Your Mission, Should You Choose To Accept It :-) is to...
Design a server app and complete a given web app.

A user should be able to sign-in & out.
Once signed in, the app should enable the user to perform CRUD operations on such tenant/s.

The web app should enable the user to filter the table for showing:
* All tenants
* Only those that have debts
* Only those that do not have any debt.

Note: Filter can be applied by any UI of your choice.

The web app should enable the user to search by name (text input should be fine)

The web app should log each event of user sign-in & sign-out (user, event, time stamp).
There’s no need to display the log in the client.

You should use:
* A middleware (such as jwt or other) to handle user authentication
* async calls
* ref mongoose (Find the usage within this assignment)

Notes:
* Please use nodejs, mongoose and mongoDB.
* Keep your code organized and commented.
* Create feature branch from this repo 'master' branch, and finally, create a pull-request to the 'master' branch for us to review.
* Make sure the code is reusable and as abstract as possible.
* Make sure to take advantage of UI functionality and consider client-server load.


Good luck,
OXS R&D
