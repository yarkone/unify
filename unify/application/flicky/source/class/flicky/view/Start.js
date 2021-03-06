/* ************************************************************************

   Flicky

   Copyright:
     2010-2011 Deutsche Telekom AG, Germany, http://telekom.com

************************************************************************ */

/**
 * Start View
 */
qx.Class.define("flicky.view.Start",
{
  extend : unify.view.StaticView,
  type : "singleton",

  members :
  {
    __content : null,


    // overridden
    getTitle : function(type) {
      return "Flicky";
    },


    // overridden
    _createView : function()
    {
      var layer = new unify.ui.Layer(this);
      var navigationBar = new unify.ui.NavigationBar(this);
      layer.add(navigationBar);

      var content = this.__content = new unify.ui.Content;
      layer.add(content);

      var html = "<ul>"
      html += "<li goto='interesting'><label>Interesting</label><hr/></li>";
      html += "<li goto='recent'><label>Recent</label><hr/></li>";
      html += "</ul>";

      content.add(html);

      return layer;
    }
  }
});
