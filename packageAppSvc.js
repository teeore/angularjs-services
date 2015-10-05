'use strict';

angular.module('packageApp')
    .factory('packageSvc', ['appSettings', '$http', 'jwtAuthenticationSvc', 'Base64', function(appSettings, $http, jwtAuthenticationSvc, Base64) {
        return {
            draftList: [],
            getFilter: 'all',

            addFilter: function(filter) {
                this.setFilter.push(filter);
                this.getFilter = this.setFilter.toString();
            },

            getPkgItem: function(item) {
                var title = (item._embedded['https://what.msiops.com/rel/notification'].subject);
                if (!title) {
                    title = 'StudioCDN Delivery';
                }
                var link = this.createLink(item._links.self.href, item._embedded['https://what.msiops.com/rel/status'].state);
                var status = (item._embedded['https://what.msiops.com/rel/status'].state).toLowerCase();
                if (status === 'scheduled' || status === 'complete') {
                    status = 'active';
                }
                return {
                    'title': title,
                    'notificationURL': item._embedded['https://what.msiops.com/rel/notification']._links.self.href,
                    'artistName': item._embedded['https://what.msiops.com/rel/metadata'].artistName,
                    'pkgStatusHref': item._embedded['https://what.msiops.com/rel/status']._links.self.href,
                    'pkgStatus': status,
                    'options': item._embedded['https://what.msiops.com/rel/options']._links.self.href,
                    'self': item._links.self.href,
                    'link': link
                };
            },
            mapPackageDetails: function(item) {
                var status = (item._embedded['https://what.msiops.com/rel/status'].state).toLowerCase();
                if (status === 'scheduled' || status === 'complete') {
                    status = 'active';
                }
                if (this.getFilter === 'all') {
                    return this.getPkgItem(item);
                } else if (this.setFilter.length > 0) {
                    for (var i = 0; i < this.setFilter.length; i++) {
                        if (status === this.setFilter[i]) {
                            return this.getPkgItem(item);
                        }
                    }
                }
            },
            getSubject: function(data) {
                return data.subject;
            }
        };
    }]);
