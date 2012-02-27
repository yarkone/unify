/* ************************************************************************

  coretest

  Copyright:
    2009 Deutsche Telekom AG, Germany, http://telekom.com

 ************************************************************************ */

/**
 * Start View
 */
core.Class("coretest.view.Start", {
  include : [unify.view.StaticView],

  construct : function() {
    unify.view.StaticView.call(this);
  },

  members : 
  {
    // overridden
    getTitle : function(type, param) {
      return "World Clock";
    },

    /**
     * #asset(coretest/clock.png)
     */
    // overridden
    getIcon : function(type, param) {
      return "coretest/clock.png";
    },
    
    // overridden
    _createView : function() 
    {
      var content = new unify.ui.basic.Label("Hello World");
      this.add(content);
    }
  }
});

unify.core.Singleton.annotate(coretest.view.Start);