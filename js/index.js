var stackathon = angular.module('stackathon', ['ngMaterial', 'ui.bootstrap']);

stackathon.controller('AppCtrl', function($scope, $timeout, $mdSidenav, $log, $http) {
        $scope.toggleLeft = function(info) {
            $scope.name = info.data.name;
            $scope.address = info.data.vicinity;
            $mdSidenav('left').toggle()
        }

        $scope.isOpenLeft = function() {
            return $mdSidenav('left').isOpen();
        };

        $scope.active = 0;
        $scope.slides = [];
        var currIndex = 0;



        $http.jsonp('https://api.instagram.com/v1/locations/436022/media/recent?access_token=455318476.fdade96.174d9ee056fc47c2a1958cf177596b27&callback=JSON_CALLBACK')
            .success(function(res) {
                res.data.forEach(function(pic) {
                    $scope.slides.push({
                        image: pic.images.standard_resolution.url,
                        text: pic.caption.text,
                        id: currIndex++
                    })
                })
            })





        var styles = [{
            stylers: [{
                hue: "#f39022"
            }, {
                saturation: -20
            }]
        }, {
            featureType: "road",
            elementType: "geometry",
            stylers: [{
                lightness: 100
            }, {
                visibility: "simplified"
            }]
        }, {
            featureType: "road",
            elementType: "labels",
            stylers: [{
                visibility: "off"
            }]
        }];

        // Create a new StyledMapType object, passing it the array of styles,
        // as well as the name to be displayed on the map type control.
        var styledMap = new google.maps.StyledMapType(styles, {
            name: "Styled Map"
        });

        // Create a map object, and include the MapTypeId to add
        // to the map type control.
        var mapOptions = {
            zoom: 14,
            center: new google.maps.LatLng(40.725189, -74.009999),
            // center: {lat: -34.397, lng: 150.644},
            streetViewControl: false,
            zoomControl: false,
            mapTypeControl: false
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                infoWindow.setPosition(pos);
                infoWindow.setContent('Location found.');
                map.setCenter(pos);
            }, function() {
                handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }

        function handleLocationError(browserHasGeolocation, infoWindow, pos) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                'Error: Your browser doesn\'t support geolocation.');
        }

        var infoWindow = new google.maps.InfoWindow({ map: map });
        var map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);

        var clubLocations = [];
        var clubMarkers = [];
        var clubsVisible = false;

        var barLocations = [];
        var barMarkers = [];
        var barsVisible = false;



        function showClubs() {
            clubLocations.forEach(function(club) {
                drawClubs({
                    lat: club.geometry.location.lat,
                    lng: club.geometry.location.lng
                }, {
                    icon: './images/clubmarker.png'
                })
            })
            clubsVisible = true;
        }

        function showBars() {
            barLocations.forEach(function(bar) {
                drawBars({
                    lat: bar.geometry.location.lat,
                    lng: bar.geometry.location.lng
                }, {
                    icon: './images/barmarker.png',
                    data: bar
                })
            })
            barsVisible = true;
        }

        function hideClubs() {
            clubMarkers.forEach(function(index) {
                index.setMap(null);
            })
            clubsVisible = false;
        }

        function hideBars() {
            barMarkers.forEach(function(index) {
                index.setMap(null);
            })
            barsVisible = false;
        }



        $('#clubButton').on('click', function() {
            if (clubsVisible) {
                hideClubs();
            } else {
                showClubs();
            }
        })

        $('#barButton').on('click', function() {
            if (barsVisible) {
                hideBars();
            } else {
                showBars();
            }
        })


        function drawClubs(location, opts) {
            if (typeof opts !== 'object') {
                opts = {};
            }
            opts.position = new google.maps.LatLng(location.lat, location.lng);
            opts.map = map;
            opts.animation = google.maps.Animation.DROP;
            opts.mydata = 'random string';
            var marker = new google.maps.Marker(opts);
            clubMarkers.push(marker);
        }

        function drawBars(location, opts) {
            if (typeof opts !== 'object') {
                opts = {};
            }
            opts.position = new google.maps.LatLng(location.lat, location.lng);
            opts.map = map;
            opts.animation = google.maps.Animation.DROP;
            opts.mydata = opts.data;
            var marker = new google.maps.Marker(opts);
            marker.addListener('click', openInfoBar);
            // marker.addListener('click',toggleBounce);

            barMarkers.push(marker);

            // function toggleBounce() {
            //     if (marker.getAnimation() !== null) {
            //         marker.setAnimation(null);
            //     } else {
            //         marker.setAnimation(google.maps.Animation.BOUNCE);
            //     }
            // }
        }
        var openInfoBar = function() {
            $scope.toggleLeft(this);
        }

        //Associate the styled map with the MapTypeId and set it to display.
        map.mapTypes.set('map_style', styledMap);
        map.setMapTypeId('map_style');
        // }



        $.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=40.7050758,-74.0113544&radius=10000&type=night_club&key=AIzaSyD7fSCbORa-dWRvAlUvAsd4-KrE_-ujCRA', function(data) {
            data.results.forEach(function(club) {
                clubLocations.push(club.geometry.location);
            })
        });

        $.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=40.7050758,-74.0113544&radius=10000&type=bar&key=AIzaSyD7fSCbORa-dWRvAlUvAsd4-KrE_-ujCRA', function(data) {
            data.results.forEach(function(bar) {
                // console.log(bar)
                // barLocations.push(bar.geometry.location);
                barLocations.push(bar);
            })
        });


        $(document).ready(function() {
            // initialize_gmaps();
            $('#fsModal').show();

        });
        $('#startTrip').click(function() {
            $('#fsModal').hide();
            $('#leftStuff').css('visibility', 'visible');
            $('#spinner').css('visibility', 'visible');
        })

























    })
    .controller('LeftCtrl', function($scope, $timeout, $mdSidenav, $log) {
        $scope.close = function() {
            $mdSidenav('left').close()
                .then(function() {
                    $log.debug("close LEFT is done");
                });

        };
    })
