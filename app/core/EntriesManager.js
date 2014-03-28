define(function(require, exports, module) {

  "use strict";

  var SchemaManager      = require('./../schema/SchemaManager'),
      EntriesCollection  = require('./entries/EntriesCollection'),
      UsersCollection    = require('modules/users/UsersCollection'),
      MediaCollection    = require('modules/media/MediaCollection');

  // Contains collections that should be persistent
  var usersInstance;
  var mediaInstance;
  var groupsInstance;
  var activityInstance;
  var messagesInstance;

  var apiURL = '',
      rowsPerPage = 100;

  function setup(options) {
    apiURL = options.apiURL;
    rowsPerPage = options.rowsPerPage;

    // Setup Directus Users
    usersInstance = new UsersCollection([], _.extend({
      rowsPerPage: 3000,
      url: apiURL + 'tables/directus_users/rows',
      filters: {columns_visible: ['active', 'avatar', 'first_name', 'last_name', 'group', 'email', 'position', 'address', 'phone', 'last_access'], active:1}
    }, SchemaManager.getFullSchema('directus_users')));

    mediaInstance = new MediaCollection([], _.extend({
      rowsPerPage: rowsPerPage,
      url: apiURL + 'media',
      filters: {columns_visible: ['name','title','size', 'type', 'user','date_uploaded', 'storage_adapter', 'width', 'height']}
    }, SchemaManager.getFullSchema('directus_media')));

    activityInstance = new EntriesCollection([], _.extend({
      rowsPerPage: rowsPerPage,
      url: apiURL + 'activity/',
      filters: {columns_visible: ['activity','datetime','user'], sort_order: 'DESC'}
    }, SchemaManager.getFullSchema('directus_activity')));

    groupsInstance = new EntriesCollection([], _.extend({
      rowsPerPage: rowsPerPage,
      url: apiURL + 'groups/'
    }, SchemaManager.getFullSchema('directus_groups')));
  }

  function getInstance(tableName, options) {
    switch (tableName) {
      case 'directus_users':
        return usersInstance;

      case 'directus_media':
        return mediaInstance;

      case 'directus_groups':
        return groupsInstance;

      case 'directus_activity':
        return activityInstance;
    }

    options = options || {};

    var defaultOptions = _.extend(SchemaManager.getFullSchema(tableName), options);

    if (defaultOptions.privileges === undefined) {
      throw "You lack privileges for `"+ tableName +"`";
    }

    var entries = new EntriesCollection([], _.extend({
      rowsPerPage: rowsPerPage
    }, defaultOptions));

    return entries;

  }

  module.exports.getInstance = getInstance;
  module.exports.setup = setup;

});