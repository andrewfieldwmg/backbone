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
    
    $(document).bind('click', this.doEdit);

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
        "click .delete_search" : "doDelete",
        "click .list-item-text" : "activateInlineEdit",
        "click .inline-edit" : "doInlineEdit"
    },
    
    doDelete: function(event) {
        event.stopPropagation();
        var self = this;
        var clicked_id = $(event.currentTarget).data('id');

        var model = new SearchModel({
            id: clicked_id
        });
       
         model.destroy({
            success: function(model, response) {
                self.render();
        }});
    
    },
    
    activateInlineEdit: function(event) {
        
        event.stopPropagation();
     
        //var self = this;
        var clicked_id = $(event.currentTarget).data('id');
 
        var get_search = new SearchModel({id: clicked_id});
        
        var result = get_search.fetch({
       
            success: function (get_search, response) {
              
             var current_text = response.search;
             
             $('span.list-item-text[data-id="' + clicked_id + '"]')
             .html('<input type="text" class="form-control-inline inline-edit" data-id="' + clicked_id + '" value="' + current_text + '">');
            
             $('.inline-edit[data-id="' + clicked_id + '"]').focus();
             
             localStorage.setItem("last-data-id-edited", clicked_id);
            
           }
        
        }).done(function(get_search, response) {
 
        });
            
    },
    
      doInlineEdit: function(event) {
        event.stopPropagation();
        
    },
    
     doEdit: function(event) {
        //event.stopPropagation();
        
        var last_data_id_edited = localStorage["last-data-id-edited"];
        var search_term = $('.inline-edit[data-id="' + last_data_id_edited + '"]').val();
        
        var edit_search = new SearchModel();
        
        edit_search.save({id: last_data_id_edited, search : search_term}, {
        success: function (edit_search, response) {
     
            var search_list_view = new SearchListView();
            search_list_view.render();

            }
        })
        
        
    }
      
});


var SearchView = Backbone.View.extend({
    
    el: $("#search_container"),
    
    initialize: function(){
        
        this.model = new SearchModel();
        this.collection = new SearchCollection();

        this.render();
        
        var search_list_view = new SearchListView();
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
         
                var search_list_view = new SearchListView();
                search_list_view.render();
                
                $("#search_input").val('');

                }
            })

    }
    
     
});


new SearchView();