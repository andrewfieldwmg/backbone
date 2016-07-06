var SearchModel = Backbone.Model.extend({
    urlRoot: '../api/api.php/searches',

});


var SearchCollection = Backbone.Collection.extend({
    model: SearchModel,
    url: '../api/api.php/searches'
});


var SearchListView = Backbone.View.extend({

  el: $("#search_list_container"),

  tagName: "ul",
      
  initialize: function(){
  
    this.model = new SearchModel();
    this.collection = new SearchCollection();

    //this.listenTo(this.collection, "add", this.render);

  },
  render: function(){
    
    var compiledTemplate = _.template( $("#search-list-template").html());
        
    var self = this;    

    var results = [];  
    this.collection.fetch({
            
        success: function (collection, response, options) {
        
                for(var i in response)
                {
                    var id_res = response[i].id;
                    var search_res = response[i].search;
                    
                    var loaded_search = new SearchModel({id: id_res, search: search_res});
                    self.collection.add(loaded_search);
    
                }

        },
        error: function(collection, response, options) {
            alert(response.responseText);

        }
    
    }).done(function() {
        
            self.collection.each(function(search){
                  var html = compiledTemplate(search.toJSON());
                  results.push(html);
            });
    

            self.$el.html(results);
    });

        //return this;
    },
    
    events: {
        "click .delete_search" : "doDelete"
    },
    
    doDelete: function(event) {

        var self = this;
        var clicked_id = $(event.currentTarget).data('id');

        var model = new SearchModel({
            id: clicked_id
        });
       
        model.destroy();
        $('.list-group-item[data-id="' + clicked_id + '"').remove();
           
    }
      
});


var SearchView = Backbone.View.extend({
    
    el: $("#search_container"),
    
    initialize: function(){
        
        this.model = new SearchModel();
        this.collection = new SearchCollection();

        this.render();
        
        var search_list_view = new SearchListView({ el: $("#search_list_container") });
        search_list_view.render();

    },
    render: function(){
    
        var template = _.template( $("#search_template").html());
        this.$el.html( template );
    },
    
    events: {
        "submit #submit_search": "doSearch"
    },
    
    doSearch: function(event) {
        event.preventDefault();

            var search_term = $("#search_input").val();
            var self = this;
            
            this.model.save({search : search_term}, {
            success: function (search, response) {
                
                var new_search = new SearchModel({id: response, search: search_term});

                self.collection.add(new_search);
         
                var search_list_view = new SearchListView({ el: $("#search_list_container") });
                search_list_view.render();

                }
            })

    }
    
     
});


new SearchView();