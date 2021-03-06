/*
===============================================================================================

		Unify Project

		Homepage: unify-project.org
		License: MIT + Apache (V2)
		Copyright: 2010, Sebastian Fastner, Mainz, Germany, http://unify-training.com

===============================================================================================
*/

/**
 * EXPERIMENTAL
 *
 * The label widget implements text representation in unify widget system
 */
core.Class("unify.ui.basic.Label", {
	include : [unify.ui.core.Widget],

	/*statics : {
		LINEHEIGHT : null,
		DEFAULTFONTSIZE : null
	},*/

	/**
	 * Creates a new instance of Label
	 * @param text {String} Text content to use
	 */
	construct : function(text) {
		unify.ui.core.Widget.call(this);

		var Static = this;
		var Style = unify.theme.Manager.get().resolveStyle("BODY");
		if (!Static.__LINEHEIGHT) {
			Static.__LINEHEIGHT = parseFloat(Style.lineHeight) || 1.4;
		}
		if (!Static.__DEFAULTFONTSIZE) {
			Static.__DEFAULTFONTSIZE = parseInt(Style.fontSize, 10) || 14;
		}

		if (text) {
			this.setValue(text);
		}

		this._applyEllipsis(this.getEllipsis());
		
		this.addNativeListener(window, "resize", function() {
			var oldSize = this.getSizeHint();
			this.invalidateLayoutCache();
			var newSize = this.getSizeHint();
			if (oldSize.width != newSize.width) {
				unify.ui.layout.queue.Layout.add(this);
				this._invalidateParentLayout();
			}
		}, this);
	},

	properties : {
		/** Contains the label content */
		value : {
			type: "String",
			apply: function(value) { this._applyValue(value); },
			fire: "changeValue",
			nullable: true
		},

		/** Wheter the content is HTML or plain text */
		html : {
			type: "Boolean",
			init: false,
			fire: "changeHtml",
			apply: function(value, old) { this._applyHtml(value, old); }
		},

		// overridden
		allowGrowX : {
			init : true
		},


		// overridden
		allowGrowY : {
			init : false
		},

		// overridden
		allowShrinkX : {
			init : true
		},
		
		// overridden
		allowShrinkY : {
			init : false
		},
		
		// overridden
		appearance : {
			init: "label"
		},

		/** Whether the label text overflow creates an ellipsis */
		ellipsis : {
			type: "Boolean",
			init: true,
			apply: function(value) { this._applyEllipsis(value); }
		},

		/** Whether the label text wraps to multi line or creates hidden overflow */
		wrap : {
			type: "Boolean",
			init: false,
			apply: function(value) { this._applyWrap(value); }
		},

		/** Wheter the label should calculate it's size */
		autoCalculateSize : {
			type: "Boolean",
			init: false
		}
	},

	members : {
		// overridden
		_createElement : function() {
			return lowland.bom.Label.create(this.getValue(), this.getHtml());
		},

		// overridden
		_getContentHint : function() {
			var contentSize = unify.ui.core.Widget.prototype._getContentHint.call(this);

			if (this.getAutoCalculateSize()) {
				contentSize = this.__computeContentSize();
			} else if (!this.getWrap()) {
				var lineHeight = this.getFont().lineHeight;
				if (!lineHeight) {
					// Get default line height from label appearance
					lineHeight = this.__LINEHEIGHT;
				}
				var fontSize = this.getFont().fontSize;
				if (!fontSize) {
					fontSize = this.__DEFAULTFONTSIZE;
				} else {
					fontSize = parseInt(fontSize, 10);
				}
				contentSize.height = Math.ceil(fontSize  * lineHeight);
			}
			
			return {
				width : contentSize.width,
				height : contentSize.height
			};
		},

		// overridden
		_hasHeightForWidth : function() {
			return this.getAutoCalculateSize();
		},

		/**
		 * Returns computed height for given width
		 *
		 * @param width {Integer} Width to match
		 * @return {Integer} Height matching given width
		 */
		_getContentHeightForWidth : function(width)
		{
			/*if (!this.getHtml() && !this.getWrap()) {
				return null;
			}*/
			return this.__computeContentSize(width).height;
		},

		/**
		 * Internal utility to compute the content dimensions.
		 *
		 * @param width {Integer} Width of label
		 * @return {Map} Content size
		 */
		__computeContentSize : function(width)
		{
			var Label = lowland.bom.Label;

			var styles = this.getFont();
			var content = this.getValue() || "A";

			var hint;
			if (this.getHtml()) {
				hint = Label.getHtmlSize(content, styles, width);
			} else {
				hint = Label.getTextSize(content, styles);
			}

			return hint;
		},

		/**
		 * Applies text to element
		 * @param value {String} New value to set
		 */
		_applyValue : function(value) {
			var parent = this.getParentBox();
			if (parent) {
				parent.invalidateLayoutChildren();
			}
			this.invalidateLayoutCache();
			lowland.bom.Label.setValue(this.getElement(), value, this.getHtml());
		},

		/**
		 * Applies ellipsis text overflow to element
		 * @param valuee {Boolean} Ellipsis overflow
		 */
		_applyEllipsis : function(value) {
			if (value) {
				this.addState("ellipsis");
			} else {
				this.removeState("ellipsis");
			}
		},

		/**
		 * Applies wrap to element
		 * @param valuee {Boolean} Ellipsis overflow
		 */
		_applyWrap : function(value) {
			if (value) {
				this.addState("wrap");
			} else {
				this.removeState("wrap");
			}
		},

		/**
		 * executed on change of the html property
		 * 
		 * reapplies element value if the element was already created
		 * to maintain internal consistency
		 * 
		 * @param value {Boolean} new value
		 */
		_applyHtml: function(value){
			var elem=this.getElement();
			if(elem){
				var val=this.getValue(); //cache 
				this._applyValue("");    //unset 
				elem.useHtml=!!value;    //change qooxdoo interhal flag (see qx.bom.Label)
				this._applyValue(val);   //apply cached 
			}
		}
	}
});
