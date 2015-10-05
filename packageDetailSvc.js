'use strict';

angular.module('packageDetailApp')
    .factory('packageDetailSvc', ['$http', 'jwtAuthenticationSvc', '$q', '$location', 'Base64', 'mailboxSvc', 'userSvc',
        function($http, jwtAuthenticationSvc, $q, $location, Base64, mailboxSvc, userSvc) {
            return {

                distribution: null,
                distResource: null,
                recipResource: null,
                currentToken: null,

                fetchData: function(resource) {
                    if (resource) {
                        return $http.get(resource);
                    }
                },

                getAssetResourceUrl: function(dist) {
                    if (dist && dist.data && dist.data._links) {
                        return dist.data._links['https://what.msiops.com/rel/assets'].href;
                    }
                },

                getRecipientResourceUrl: function(dist) {
                    if (dist && dist.data && dist.data._links) {
                        return dist.data._links['https://what.msiops.com/rel/recipients'].href;
                    }
                },

                processDistribution: function(dist) {
                    if (dist && dist.data && dist.data._embedded) {
                        var d = {};

                        d.status = dist.data._embedded['https://what.msiops.com/rel/status'];
                        d.metadata = dist.data._embedded['https://what.msiops.com/rel/metadata'];
                        d.options = dist.data._embedded['https://what.msiops.com/rel/options'];
                        d.notification = dist.data._embedded['https://what.msiops.com/rel/notification'];
                        d.resourceLocation = dist.data._links['self'].href;
                        d.expiryDate = dist.data.expiryDate;
                        d.sentDate = dist.data.sentDate;

                        if (dist.data.effectiveSender) {
                            d.sender = dist.data.effectiveSender;
                        } else if (userSvc.user && userSvc.user.mailbox) {
                            d.sender = userSvc.user.mailbox;
                        }
                        this.distribution = d;
                    }
                },


                processActivity: function(activity) {

                    if (activity && activity.data) {
                        this.distribution.activity = activity.data.elements;
                    }
                }

            };
        }
    ]);
