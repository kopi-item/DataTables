

(/** @lends <global> */function() {

var _Api = DataTable.Api;

var _reload = function ( settings ) {
	if ( settings.oFeatures.bServerSide ) {
		_fnDraw( settings );
	}
	else {
		// Trigger xhr
		_fnBuildAjax( settings, [], function( json ) {
			// xxx can this be reduced?
			_fnClearTable( settings );

			var data = _fnAjaxDataSrc( settings, json );
			for ( i=0 ; i<data.length ; i++ ) {
				_fnAddData( settings, data[i] );
			}

			_fnReDraw( settings );
		} );
	}
};


/**
 * Get the JSON response from the last Ajax request that DataTables made to the
 * server. Note that this returns the JSON from the first table in the current
 * context.
 *
 * @return {object} JSON received from the server.
 */
_Api.register( 'ajax.json()', function () {
	var ctx = this.context;

	if ( ctx.length > 0 ) {
		var xhr = ctx[0].jqXHR;

		if ( xhr ) {
			return $.parseJSON( xhr.responseText );
		}
	}

	// else return undefined;
} );


/**
 * Reload tables from the Ajax data source.
 *
 * @returns {DataTables.Api} this
 */
_Api.register( 'ajax.reload()', function () {
	return this.tables( _reload );
} );


/**
 * Get the current Ajax URL. Note that this returns the URL from the first
 * table in the current context.
 *
 * @return {string} Current Ajax source URL
 *//**
 * Set the Ajax URL. Note that this will set the URL for all tables in the
 * current context.
 *
 * @param {string} url URL to set.
 * @returns {DataTables.Api} this
 */
_Api.register( 'ajax.url()', function ( url ) {
	var ctx = this.context;

	if ( url === undefined ) {
		// get
		if ( ctx.length === 0 ) {
			return undefined;
		}
		ctx = ctx[0];

		return ctx.ajax ?
			$.isPlainObject( ctx.ajax ) ?
				ctx.ajax.url :
				ctx.ajax :
			ctx.sAjaxSource;
	}

	// set
	return this.tables( function ( settings ) {
		if ( $.isPlainObject( settings.ajax ) ) {
			settings.ajax.url = url;
		}
		else {
			settings.ajax = url;
		}
		// No need to consider sAjaxSource here since DataTables gives priority
		// to `ajax` over `sAjaxSource`. So setting `ajax` here, renders any
		// value of `sAjaxSource` redundant.
	} );
} );


/**
 * Load data from the newly set Ajax URL. Note that this method is only
 * available when `ajax.url()` is used to set a URL. Additionally, this method
 * has the same effect as calling `ajax.reload()` but is provided for
 * convenience when setting a new URL.
 *
 * @returns {DataTables.Api} this
 */
_Api.register( 'ajax.url().load()', function () {
	// Same as a reload, but makes sense to present it for easy access after a
	// url change
	return this.tables( _reload );
} );


}());

