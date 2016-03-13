var stackathon = angular.module('stackathon', ['firebase', 'ngMaterial', 'ui.bootstrap']);

stackathon.controller('AppCtrl', function($scope, $timeout, $mdSidenav, $log, $http, $firebaseArray) {
        $scope.toggleLeft = function(info) {
            $scope.name = info.data.name;
            $scope.address = info.data.vicinity;
            getPics(info.data.igid)
            $mdSidenav('left').toggle()
        }

        $scope.isOpenLeft = function() {
            return $mdSidenav('left').isOpen();
        };

        $scope.active = 0;
        $scope.slides = [];
        var currIndex = 0;

        var getPics = function(igId){
            $http.jsonp('https://api.instagram.com/v1/locations/'+igId+'/media/recent?access_token=455318476.fdade96.174d9ee056fc47c2a1958cf177596b27&callback=JSON_CALLBACK')
                .success(function(res) {
                    $scope.slides = [];
                    currIndex = 0;
                    res.data.forEach(function(pic) {
                        $scope.slides.push({
                            image: pic.images.standard_resolution.url,
                            text: pic.caption.text,
                            id: currIndex++
                        })
                    })
                })
        }





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
            // zoom: 14,
            zoom: 3,
            center: new google.maps.LatLng(40.725189, -74.009999),
            // center: new google.maps.LatLng(-33.8688, 151.2195),
            // center: {lat: -34.397, lng: 150.644},
            streetViewControl: false,
            zoomControl: false,
            mapTypeControl: false
        };

        var input = document.getElementById('locationInput');

        var autocomplete = new google.maps.places.Autocomplete(input);

        autocomplete.addListener('place_changed', function() {
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                window.alert("Autocomplete's returned place contains no geometry");
                return;
            }

            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17); // Why 17? Because it looks good.
            }
        });

        var map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);

        var clubLocations = [];
        var clubMarkers = [];
        var clubsVisible = false;

        var barLocations = [];
        var barMarkers = [];
        var barsVisible = false;

        var loungeLocations = [];
        var loungeMarkers = [];
        var loungesVisible = false;



        function showClubs() {
            clubLocations.forEach(function(club) {
                var icon;
                if (club.popularity === '1') { icon = './images/club.png'; }
                if (club.popularity === '2') icon = './images/club.gif';
                if (club.popularity === '3') icon = './images/club2.gif';
                drawClubs({
                    lat: club.geometry.location.lat,
                    lng: club.geometry.location.lng
                }, {
                    icon: icon,
                    optimized: false,
                    data: club
                })
            })
            clubsVisible = true;
        }

        function showBars() {
            barLocations.forEach(function(bar) {
                var icon;
                if (bar.popularity === '1') { icon = './images/bar.png'; }
                if (bar.popularity === '2') icon = './images/bar.gif';
                if (bar.popularity === '3') icon = './images/bar2.gif';
                drawBars({
                    lat: bar.geometry.location.lat,
                    lng: bar.geometry.location.lng
                }, {
                    icon: icon,
                    optimized: false,
                    data: bar
                })
            })
            barsVisible = true;
        }

        function showLounges() {
            loungeLocations.forEach(function(lounge) {
                var icon;
                if (lounge.popularity === '1') { icon = './images/lounge.png'; }
                if (lounge.popularity === '2') icon = './images/lounge.gif';
                if (lounge.popularity === '3') icon = './images/lounge2.gif';
                drawLounges({
                    lat: lounge.geometry.location.lat,
                    lng: lounge.geometry.location.lng
                }, {
                    icon: icon,
                    optimized: false,
                    data: lounge
                })
            })
            loungesVisible = true;
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

        function hideLounges() {
            loungeMarkers.forEach(function(index) {
                index.setMap(null);
            })
            loungesVisible = false;
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

        $('#loungeButton').on('click', function() {
            if (loungesVisible) {
                hideLounges();
            } else {
                showLounges();
            }
        })


        function drawClubs(location, opts) {
            if (typeof opts !== 'object') {
                opts = {};
            }
            opts.position = new google.maps.LatLng(location.lat, location.lng);
            opts.map = map;
            opts.animation = google.maps.Animation.DROP;
            opts.mydata = opts.data;
            var marker = new google.maps.Marker(opts);
            marker.addListener('click', openInfo);
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
            marker.addListener('click', openInfo);
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

        function drawLounges(location, opts) {
            if (typeof opts !== 'object') {
                opts = {};
            }
            opts.position = new google.maps.LatLng(location.lat, location.lng);
            opts.map = map;
            opts.animation = google.maps.Animation.DROP;
            opts.mydata = opts.data;
            var marker = new google.maps.Marker(opts);
            marker.addListener('click', openInfo);
            loungeMarkers.push(marker);
        }

        var openInfo = function() {
            $scope.toggleLeft(this);
        }

        //Associate the styled map with the MapTypeId and set it to display.
        map.mapTypes.set('map_style', styledMap);
        map.setMapTypeId('map_style');
        // }

        var refclubs = new Firebase("https://stackathon.firebaseio.com/clubs");
        var refbars = new Firebase("https://stackathon.firebaseio.com/bars");
        var reflounges = new Firebase("https://stackathon.firebaseio.com/lounges");

        var dataClubs = $firebaseArray(refclubs);
        var dataBars = $firebaseArray(refbars);
        var dataLounges = $firebaseArray(reflounges);

        // $.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=40.7050758,-74.0113544&radius=10000&type=night_club&key=AIzaSyD7fSCbORa-dWRvAlUvAsd4-KrE_-ujCRA', function(data) {
        dataClubs.$loaded()
            .then(function(clubs) {
                clubs.forEach(function(club) {
                    clubLocations.push(club);
                })
            })


        // $.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=40.7050758,-74.0113544&radius=10000&type=bar&key=AIzaSyD7fSCbORa-dWRvAlUvAsd4-KrE_-ujCRA', function(data) {
        dataBars.$loaded()
            .then(function(bars) {
                bars.forEach(function(bar) {
                    barLocations.push(bar);
                })
            })

        // $.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=40.7050758,-74.0113544&radius=10000&type=restaurant&key=AIzaSyD7fSCbORa-dWRvAlUvAsd4-KrE_-ujCRA', function(data) {
        dataLounges.$loaded()
            .then(function(lounges) {
                lounges.forEach(function(lounge) {
                    loungeLocations.push(lounge);
                })
            })


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