# Enabling Role based Authorization

Inside the auth0 dashboard you are able to assign `app_metadata` to users. This starter uses the following structure to support role based authorization:

```js
{
  roles: {
    author: false,
    admin: true,
    superadmin: false,
    ...etc
  }
}
```

To enable this feature you must create a [rule](https://manage.auth0.com/#/rules) that targets your app's namespace. An example of which is seen below:

```js
function (user, context, callback) {
  user.app_metadata = user.app_metadata || {};

  var addRolesToUser = function(user, cb) {
    if (user.app_metadata.roles) {
      cb(null, user.app_metadata.roles);
    } else {
      cb(null, { 'user': true });
    }
  };

  addRolesToUser(user, function(err, roles) {
    if (err) {
      callback(err);
    } else {
      user.app_metadata.roles = roles;
      auth0.users.updateAppMetadata(user.user_id, user.app_metadata)
        .then(function(){
          // notice https://fusing-angular.com/roles
          context.idToken['https://fusing-angular.com/roles'] = user.app_metadata.roles;
          callback(null, user, context);
        })
        .catch(function(err){
          callback(err);
        });
    }
  });
}
```

The environment variable `AUTH0_ROLES_KEY` represents this value. This is a manual mapping you must configure
