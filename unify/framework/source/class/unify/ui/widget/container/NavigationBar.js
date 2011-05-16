/*
#asset(unify/*)
*/
qx.Class.define("unify.ui.widget.container.NavigationBar", {
  extend: unify.ui.widget.container.ToolBar,
  
  construct : function(view) {
    this.base(arguments);
    this._setLayout(new unify.ui.widget.layout.NavigationBar());
    
    if (!view || !(view instanceof unify.view.StaticView)) {
      throw new Error("Invalid view! NavigationBar must be attached to a view!")
    }
    
    this.__view = view;
    
    var title = this.__title = new unify.ui.widget.basic.Label();
    title.setStyle({
      font: "20px bold",
      color: "white",
      textShadow: "rgba(0, 0, 0, 0.4) 0px -1px 0",
      textOverflow: "ellipsis"
    });
    this._add(title, {
      position: "title"
    });
    
    this.setStyle({
      background: "url(" + qx.util.ResourceManager.getInstance().toUri("unify/iphoneos/navigation-bar/black/navigationbar.png") + ")"
    });
    
    // Finally listen for any changes occour after creation of the titlebar
    view.addListener("changeTitle", this.__onViewChangeTitle, this);
    view.addListener("changeParent", this.__onViewChangeParent, this);
    var master=view.getManager().getMaster();
    if(master){
      master.addListener("changeView",this.__onViewChangeMaster,this);
      master.addListener("changeDisplayMode",this.__onViewChangeMaster,this);
    }
    
    this.__onViewChangeTitle();
    this.__onViewChangeParent();
    this.__onViewChangeMaster();
  },
  
  properties : {
    minWidth: {
      refine: true,
      init: 200
    },
    height: {
      refine: true,
      init: 44
    },
    
    appearance : {
      refine : true,
      init: "toolbar.navigationbar"
    }
  },
  
  members : {
    __view : null,
    __title : null,
    __parentButton : null,
    __masterButton : null,

    /*
    ---------------------------------------------------------------------------
      EVENT LISTENER
    ---------------------------------------------------------------------------
    */

    /**
     * Event listener for parent changes
     *
     * @param e {qx.event.type.Data} Data event
     */
    __onViewChangeParent : function(e)
    {
      var parentElem = this.__parentButton;
      if (!parentElem) 
      {
        parentElem = this.__parentButton = this._createItemElement({rel:"parent",kind:"button"});
        parentElem.setStyle(unify.ui.widget.styling.StaticTheme.navigationBarButtonParent);
        parentElem.setHeight(28);
        parentElem.setAllowGrowY(false);
        parentElem.setAllowShrinkY(false);
        this._add(parentElem, {
          position: "left"
        });
      }
      
      var parent = this.__view.getParent();
      if(parent){
        parentElem.setValue(parent.getTitle("parent"));
        parentElem.setVisibility("visible");
      } else {
        parentElem.setVisibility("excluded");
        parentElem.setValue("");
      }
    },


    /**
     * Event listener for master changes
     *
     * @param e {qx.event.type.Data} Data event
     */
    __onViewChangeMaster : function(e)
    {
      var masterElem = this.__masterButton;
      if (!masterElem)
      {
        masterElem = this.__masterButton =this._createItemElement({rel:"master",kind:"button"});
        masterElem.setHeight(28);
        masterElem.setAllowGrowY(false);
        masterElem.setAllowShrinkY(false);
        masterElem.setStyle(unify.ui.widget.styling.StaticTheme.navigationBarButton);
        this._add(masterElem, {
          position: "left"
        });
      }
      var master = this.__view.getManager().getMaster();
      
      if(master && master.getDisplayMode()=='popover'){
        masterElem.setNavigation({
          show: master.getId()
        });
        var currentMasterView=master.getCurrentView();
        masterElem.setValue(currentMasterView?currentMasterView.getTitle("parent") : "missing title");
        masterElem.setVisibility("visible");
      } else {
        masterElem.setVisibility("excluded");
        masterElem.setValue("");
      }
    },


    /**
     * Event listner for <code>changeTitle</code> event of attached view.
     *
     * @param e {qx.event.type.Data} Property change event
     */
    __onViewChangeTitle : function(e) {
      this.__title.setValue(this.__view.getTitle());
    }
  },
  
  destruct : function() {
    var view = this.__view;
    view.removeListener("changeTitle", this.__onViewChangeTitle, this);
    view.removeListener("changeParent", this.__onViewChangeParent, this);
    view.removeListener("changeMaster", this.__onViewChangeMaster, this);
    view = this.__view = null;
    this.__navigationBar = null;
  }
});