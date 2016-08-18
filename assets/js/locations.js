(function( $ ) {

	$.fn.RELocations = function( options ) {
		var $this = $( this ),
			data  = {
				zoom : 5,
				infowindow : null,
				address : null
			},
			locations = {},
			positions = {};

		$.extend( data, options );
		initMap();

		/**
		 * Initialize map.
		 */
		function initMap() {
			var $source = [],
				map, geocoder, bounds;

			// console.log( locations[0] );

			if ( data.hasOwnProperty( 'sourceselector' ) ) {
				$source = $( '#' + data.sourceselector ).children();
			}

			if ( null === data.address && ! $source.length ) {
				return !1;
			}

			// Changed a control's position.
			setControlOptions();

			map      = new google.maps.Map( $this[0], data );
			geocoder = new google.maps.Geocoder();
			bounds   = new google.maps.LatLngBounds();

			map.addListener( 'click', function( e ) {
				mapPanTo( e.latLng, map );
			});

			if ( null !== data.infowindow ) {
				infowindow = new google.maps.InfoWindow( data.infowindow );
			}

			if ( null === data.address ) {

				$source.each( function( i, el ) {
					geocodeAddress( map, geocoder, bounds, $( el ) );
				} );

			} else {

				for ( key in data.address ) {
					geocodeAddress( map, geocoder, bounds, data.address[ key ] );
				}
			}
		};

		/**
		 * Geocoding.
		 *
		 * @param  object resultsMap
		 * @param  object geocoder
		 * @param  object bounds
		 * @param  string _data
		 * @return void
		 */
		function geocodeAddress( resultsMap, geocoder, bounds, _data ) {
			var location = _data,
				html     = '';

			if ( 'object' == typeof _data ) {
				location = _data.data( 'property-address' );
				html     = _data.html();
			}

			if ( undefined === location ) {
				return !1;
			}

			location = String( location );

			// console.log( locations );

			// for ( var id in menu ) {
			// 	console.log( menu[ id ] );
			// 	if ( location == locations[ id ] ) {
			// 		console.log( locations[ id ] );
			// 	} else {
			// 		console.log( 'no' );
			// 	}
			// }

			geocoder.geocode({
				'address': location
			}, function( results, status ) {

				if ( status === google.maps.GeocoderStatus.OK ) {
					var position      = results[0].geometry.location,
						key           = results[0].place_id,
						animationType = data.hasOwnProperty( 'animation' ) ? data.animation : '',
						marker;

					// console.log( results );

					// locations[ key ] = location;
					// positions[ key ] = position;

					// console.log( locations );

					bounds.extend( position );

					marker = new google.maps.Marker({
						map: resultsMap,
						draggable: false,
						animation: google.maps.Animation[ animationType ],
						position: position,
						icon: data.hasOwnProperty( 'icon' ) ? data.icon : '',
						html: html
					});

					if ( null !== data.infowindow ) {
						google.maps.event.addListener( marker, 'click', function () {
							infowindow.setContent( this.html );
							infowindow.open( resultsMap, this );
						});
					}

					// Automatically center the map fitting all markers on the screen.
					resultsMap.fitBounds( bounds );
					// resultsMap.setZoom( zoom );
				}
			});

			// console.log( locations );
		};

		/**
		 * Callback-function on `click` event.
		 *
		 * @param  object LatLng
		 * @param  ojject map
		 * @return void
		 */
		function mapPanTo( LatLng, map ) {
			map.panTo( LatLng );
		};

		/**
		 * Prepare options for Map Controls in javascript-format.
		 */
		function setControlOptions() {

			if ( data.hasOwnProperty( 'mapTypeControlOptions' ) ) {
				var mapTypeControlOptions = {
					style: google.maps.MapTypeControlStyle[ data.mapTypeControlOptions.style ],
					position: google.maps.ControlPosition[ data.mapTypeControlOptions.position ]
				};

				data.mapTypeControlOptions = mapTypeControlOptions;
			}

			if ( data.hasOwnProperty( 'zoomControlOptions' ) ) {
				var zoomControlOptions = {
					position: google.maps.ControlPosition[ data.zoomControlOptions.position ]
				};

				data.zoomControlOptions = zoomControlOptions;
			}

			if ( data.hasOwnProperty( 'streetViewControlOptions' ) ) {
				var streetViewControlOptions = {
					position: google.maps.ControlPosition[ data.streetViewControlOptions.position ]
				};

				data.streetViewControlOptions = streetViewControlOptions;
			}
		};
	}

})( jQuery );