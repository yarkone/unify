/* ************************************************************************

   Flicky

   Copyright:
     2010-2011 Deutsche Telekom AG, Germany, http://telekom.com

************************************************************************ */

/**
 * Placeholder View
 */
qx.Class.define("flicky.view.Info",
{
  extend : unify.view.StaticView,
  type : "singleton",

  members :
  {
    __content : null,


    // overridden
    getTitle : function(type) {
      return "Info";
    },


    // overridden
    _createView : function()
    {
      var layer = new unify.ui.Layer(this);
      var navigationBar = new unify.ui.NavigationBar(this);
      layer.add(navigationBar);

      var content = this.__content = new unify.ui.Content;
      content.add("<p>No photo selected!</p>");
      layer.add(content);

      return layer;
    }
  }
});
