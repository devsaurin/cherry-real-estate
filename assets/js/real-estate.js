/* global CherryREData */
(function( $ ) {
	'use strict';

	CherryJsCore.utilites.namespace( 'cherryRealEstate' );

	CherryJsCore.cherryRealEstate = {

		magnificPopup: null,

		start: function() {
			var self = this;

			if ( CherryJsCore.status.is_ready ) {
				self.documentReady( self );
			} else {
				CherryJsCore.variable.$document.on( 'ready', self.documentReady( self ) );
			}
		},

		documentReady: function( self ) {
			self.gallery( self );
			self.popup( self );
			self.submissionForm( self );
			self.loginForm( self );
			self.registerForm( self );
		},

		gallery: function( self ) {
			$( '.tm-property-gallery-js' ).each( function() {
				var $gallery = $( this ),
					params = $gallery.data( 'atts' );

				if ( ! $.isFunction( jQuery.fn.swiper ) || ! $gallery.length ) {
					return !1;
				}

				if ( params.hasOwnProperty( 'group' ) ) {
					var obj = params.group,
						key,
						saved = {};

					for ( key in obj ) {
						saved[ key ] = init( $( obj[ key ] ) );
					}

					saved.top.params.control = saved.thumbs;
					saved.thumbs.params.control = saved.top;

				} else {
					init( $gallery, params );
				}

			} );

			function init( $selector, args ) {
				var galleryId = $selector.data( 'id' );

				args = args || $selector.data( 'atts' );

				return new Swiper( '#' + galleryId, args );
			};
		},

		submissionForm: function( self ) {
			var $form = $( '#tm-re-submissionform' );

			if ( ! $.isFunction( jQuery.fn.validate ) || ! $form.length ) {
				return !1;
			}

			$form.validate({
				debug: true, // disabled submit event
				messages: {
					property_title: CherryREData.messages,
					property_description: CherryREData.messages,
					property_price: CherryREData.messages,
					property_status: CherryREData.messages,
					property_type: CherryREData.messages,
					property_address: CherryREData.messages,
					property_bedrooms: CherryREData.messages,
					property_bathrooms: CherryREData.messages,
					property_area: CherryREData.messages,
					property_parking_places: CherryREData.messages,
					property_address: CherryREData.messages
				},
				rules: {
					property_price: {
						number: true
					},
					property_area: {
						number: true
					},
					property_bedrooms: {
						digits: true
					},
					property_bathrooms: {
						digits: true
					},
					property_parking_places: {
						digits: true
					}
				},
				errorElement: 'span',
				highlight: function( element, errorClass, validClass ) {
					$( element ).fadeOut( function() {
						$( element ).fadeIn().addClass( errorClass ).removeClass( validClass );
					} );
				},
				unhighlight: function( element, errorClass, validClass ) {
					$( element ).removeClass( errorClass ).addClass( validClass );
				},
				submitHandler: function( form ) {
					ajaxSubmit( $( form ) );
				}
			});

			function ajaxSubmit( $form ) {
				var formData   = $form.serializeArray(),
					nonce      = $form.find( 'input[name="tm-re-submissionform-nonce"]' ).val(),
					$error     = $form.find( '.tm-re-submission-form__error' ),
					$success   = $form.find( '.tm-re-submission-form__success' ),
					processing = 'processing',
					hidden     = 'tm-re-hidden';

				if ( $form.hasClass( processing ) ) {
					return !1;
				}

				$form.addClass( processing );
				$error.empty();

				if ( ! $error.hasClass( hidden ) ) {
					$error.addClass( hidden );
				}

				if ( ! $success.hasClass( hidden ) ) {
					$success.addClass( hidden );
				}

				$.ajax({
					url: CherryREData.ajaxurl,
					type: 'post',
					dataType: 'json',
					data: {
						action: 'submission_form',
						nonce: nonce,
						property: formData
					},
					error: function() {
						$form.removeClass( processing );
					}
				}).done( function( response ) {
					console.log( response );

					$form.removeClass( processing );

					if ( true === response.success ) {
						$success.removeClass( hidden );
						return 1;
					}

					$error.removeClass( hidden ).html( response.data.message );
					return !1;
				});
			}
		},

		loginForm: function( self ) {
			CherryJsCore.variable.$document.on( 'click', '.tm-re-login-form__btn', init );

			function init( event ) {
				event.preventDefault();

				var $this       = $( this ),
					$form       = $this.parents( 'form' ),
					$error      = $form.find( '.tm-re-login-form__error' ),
					$success    = $form.find( '.tm-re-login-form__success' ),
					login_input = $form.find( 'input[name="tm-re-user-login"]' ),
					pass_input  = $form.find( 'input[name="tm-re-user-pass"]' ),
					login       = login_input.val(),
					pass        = pass_input.val(),
					nonce       = $form.find( 'input[name="tm-re-loginform-nonce"]' ).val(),
					processing  = 'processing',
					hidden      = 'tm-re-hidden';

				if ( $form.hasClass( processing ) ) {
					return !1;
				}

				if ( '' == login ) {
					login_input.addClass( 'error' );
					return !1;
				} else {
					login_input.removeClass( 'error' );
				}

				if ( '' == pass ) {
					pass_input.addClass( 'error' );
					return !1;
				} else {
					pass_input.removeClass( 'error' );
				}

				$form.addClass( processing );
				$error.empty();

				if ( ! $error.hasClass( hidden ) ) {
					$error.addClass( hidden );
				}

				if ( ! $success.hasClass( hidden ) ) {
					$success.addClass( hidden );
				}

				$.ajax({
					url: CherryREData.ajaxurl,
					type: 'post',
					dataType: 'json',
					data: {
						action: 'login_form',
						nonce: nonce,
						access: {
							login : login,
							pass: pass
						}
					},
					error: function() {
						$form.removeClass( processing );
					}
				}).done( function( response ) {
					console.log( response );

					$form.removeClass( processing );

					if ( true === response.success ) {
						$success.removeClass( hidden );

						if ( $.isFunction( jQuery.fn.magnificPopup ) && null !== self.magnificPopup ) {
							self.magnificPopup.close();
						}

						$form[0].reset();
						$( '.tm-re-submission-form__btn' ).prop( 'disabled', false );
						$( '.tm-re-auth-message' ).hide();

						return 1;
					}

					$error.removeClass( hidden ).html( response.data.message );
					return !1;
				});

			};
		},

		registerForm: function( self ) {
			CherryJsCore.variable.$document.on( 'click', '.tm-re-register-form__btn', init );

			function init( event ) {
				event.preventDefault();

				var $this       = $( this ),
					$form       = $this.parents( 'form' ),
					$error      = $form.find( '.tm-re-register-form__error' ),
					$success    = $form.find( '.tm-re-register-form__success' ),
					login_input = $form.find( 'input[name="tm-re-user-login"]' ),
					email_input = $form.find( 'input[name="tm-re-user-email"]' ),
					pass_input  = $form.find( 'input[name="tm-re-user-pass"]' ),
					cpass_input = $form.find( 'input[name="tm-re-user-confirm-pass"]' ),
					login       = login_input.val(),
					email       = email_input.val(),
					pass        = pass_input.val(),
					cpass       = cpass_input.val(),
					nonce       = $form.find( 'input[name="tm-re-registerform-nonce"]' ).val(),
					processing  = 'processing',
					hidden      = 'tm-re-hidden';

				if ( $form.hasClass( processing ) ) {
					return !1;
				}

				if ( '' == login ) {
					login_input.addClass( 'error' ).focus();
					return !1;
				} else {
					login_input.removeClass( 'error' );
				}

				if ( '' == email ) {
					email_input.addClass( 'error' ).focus();
					return !1;
				} else {
					email_input.removeClass( 'error' );
				}

				if ( '' == pass ) {
					pass_input.addClass( 'error' ).focus();
					return !1;
				} else {
					pass_input.removeClass( 'error' );
				}

				if ( '' == cpass ) {
					cpass_input.addClass( 'error' ).focus();
					return !1;
				} else {
					cpass_input.removeClass( 'error' );
				}

				$form.addClass( processing );
				$error.empty();

				if ( ! $error.hasClass( hidden ) ) {
					$error.addClass( hidden );
				}

				if ( ! $success.hasClass( hidden ) ) {
					$success.addClass( hidden );
				}

				$.ajax({
					url: CherryREData.ajaxurl,
					type: 'post',
					dataType: 'json',
					data: {
						action: 'register_form',
						nonce: nonce,
						access: {
							login: login,
							email: email,
							pass: pass,
							cpass: cpass
						}
					},
					error: function() {
						$form.removeClass( processing );
					}
				}).done( function( response ) {
					console.log( response );

					$form.removeClass( processing );

					if ( true === response.success ) {
						// $success.removeClass( hidden );

						if ( $.isFunction( jQuery.fn.magnificPopup ) && null !== self.magnificPopup ) {
							self.magnificPopup.close();
						}

						$form[0].reset();

						return 1;
					}

					$error.removeClass( hidden ).html( response.data.message );
					return !1;
				});

			};
		},

		popup: function( self ) {
			var link = '.tm-re-popup',
				src  = '#' + CherryREData.popupid;

			if ( ! $( src ).length ) {
				return !1;
			}

			if ( ! $.isFunction( jQuery.fn.magnificPopup ) || ! $( link ).length ) {
				return !1;
			}

			self.magnificPopup = $.magnificPopup.instance;

			CherryJsCore.variable.$document.on( 'click', link, init );

			function init( event ) {
				event.preventDefault();

				var tab    = $( this ).data( 'tab' ),
					effect = $( src ).data( 'anim-effect' );

				self.magnificPopup.open({
					items: {
						src: src
					},
					type: 'inline',
					focus: '#tm-re-user-login',
					preloader: false,
					removalDelay: 500,
					mainClass: effect,
					callbacks: {
						beforeOpen: function() {

							if ( $( window ).width() < 700 ) {
								this.st.focus = false;
							} else {
								this.st.focus = '#tm-re-user-login';
							}

							self.tabs( self, tab );
						}
					}
				});
			}
		},

		tabs: function( self, activeTab ) {
			var $target = $( '#' + CherryREData.popupid );

			if ( ! $.isFunction( jQuery.fn.tabs ) || ! $target.length ) {
				return !1;
			}

			$target.tabs({
				collapsible: false,
				active: activeTab
			});
		}

	};

	CherryJsCore.cherryRealEstate.start();

})( jQuery );