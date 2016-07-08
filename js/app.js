var TaskModel = Backbone.Model.extend({
    urlRoot: '../api/api.php/tasks'

});


var TaskCollection = Backbone.Collection.extend({
    url: "../api/api.php/tasks/"
});


var TaskSelectorModel = Backbone.Model.extend({
    urlRoot: '../api/api.php/task_lists'
});


var TaskSelectorCollection = Backbone.Collection.extend({
    url: "../api/api.php/task_lists/"
});



var TaskListView = Backbone.View.extend({

  el: $("#task_list_container"),

  tagName: "tbody",
      
  initialize: function(){
  
    this.model = new TaskModel();
    this.collection = new TaskCollection();
    
    $(document).bind('click', this.doEdit);
    
            this.render = _.wrap(this.render, function(render) {
				this.beforeRender();
				render();						
				this.afterRender();
			});						
			
            this.collection.on('change', this.render, this);
            
            this.render();

    },
    
    render: function(){

        return this;
    
    },
    
    beforeRender: function () {
        
        this.undelegateEvents();
	this.$el.removeData().unbind();
        
    },
		
    afterRender: function () {
        
        var compiledTemplate = _.template( $("#task-list-template").html());
        var self = this;    
        var results = [];
        
            this.collection.fetch().done(function() {
                
                    self.collection.each(function(task){
        
                          var html = compiledTemplate(task.toJSON());
                        
                            if (task.toJSON().task_list == localStorage["selected_task_list"]) {              
                                results.push(html);             
                            }
                                           
                        });
            
                    self.$el.html(results);
            });
    
    },
  
    events: {
        "click .complete_task" : "doComplete",
        "click .delete_task" : "doDelete",
        "click .list-item-text" : "activateInlineEdit",
        "click .inline-edit" : "doInlineEdit"
    },
    
      doComplete: function(event) {
        
        event.stopPropagation();
        var self = this;
        var clicked_id = $(event.currentTarget).data('id');

        $('span.list-item-text[data-id="' + clicked_id + '"]').wrap("<strike>")
        .fadeTo('slow', 0.4);
 
        var complete_task = new TaskModel();
        
        complete_task.save({id: clicked_id, status: 1}, {
        success: function (complete_task, response) {
     
                new TaskListView();

            }
        })
    
    },
    
    doDelete: function(event) {
        
        event.stopPropagation();
        var self = this;
        var clicked_id = $(event.currentTarget).data('id');

        var model = new TaskModel({
            id: clicked_id
        });
       
         model.destroy({
            success: function(model, response) {
                new TaskListView();
        }});
    
    },
    
    activateInlineEdit: function(event) {
        
        event.stopPropagation();
        var clicked_id = $(event.currentTarget).data('id');
        var get_task = new TaskModel({id: clicked_id});
        
        var result = get_task.fetch({
       
            success: function (get_task, response) {
              
             var current_text = response.task;
             
             $('span.list-item-text[data-id="' + clicked_id + '"]')
             .html('<input type="text" class="form-control-inline inline-edit" data-id="' + clicked_id + '" value="' + current_text + '">');
             $('.inline-edit[data-id="' + clicked_id + '"]').focus();
             
             localStorage.setItem("last-task-edited", clicked_id);
            
           }
        
        }).done(function(get_task, response) {
 
        });
            
    },
    
      doInlineEdit: function(event) {
        event.stopPropagation();
        
    },
    
     doEdit: function(event) {
        //event.stopPropagation();

        var last_data_id_edited = localStorage["last-task-edited"];
        
        if (last_data_id_edited) {
                
            console.log('do edit');
        
            var task_term = $('.inline-edit[data-id="' + last_data_id_edited + '"]').val();
            
            var edit_task = new TaskModel();
            
            edit_task.save({id: last_data_id_edited, task : task_term}, {
            success: function (edit_task, response) {
         
                new TaskListView();


                }
            })
        
        }
                
            localStorage.setItem("last-task-edited", "");
    }
      
});


var TaskView = Backbone.View.extend({
    
    el: $("#task_container"),
    
    initialize: function(options){

        this.model = new TaskModel();
        this.collection = new TaskCollection();
             
        var do_init = options.do_init;

        if (do_init == true) {

            this.$el.show();
            this.render = _.wrap(this.render, function(render) {
                                    this.beforeRender();
                                    render();						
                                    this.afterRender();
                            });						
                            
            this.render();
            
        } else {
            
            this.$el.hide();
        }


    },
    
    render: function(){

        return this;
    
    },
    
    beforeRender: function () {
        
        this.undelegateEvents();
	this.$el.removeData().unbind();
        
    },
		
    afterRender: function () {
	
        var template = _.template( $("#task_template").html());
        this.$el.html( template );
    
    },
     
    events: {
        "submit #submit_task": "addTask"
    },
    
    addTask: function(event) {
        
        event.preventDefault();
        
        console.log('add task fired');

            var new_task = $("#task_input").val();
            var self = this;
            
            this.model.save({
                task: new_task,
                status: 0,
                task_list: localStorage["selected_task_list"]}, {
                
            success: function (task, response) {
                
                //var new_task = new TaskModel({id: response,
                //                             task: new_task,
                //                             status: 0,
                //                             task_list: localStorage["selected_task_list"]
                //                             });
                //self.collection.add(new_task);
         
                new TaskListView();
               
                $("#task_input").val('');

                }
            })

    }
    
     
});

var TaskSelectorView = Backbone.View.extend({
    
    el: $("#task_selector_container"),
    
    template : _.template( $("#task_selector_template").html()),
        
    initialize: function(){
        
        this.collection = new TaskSelectorCollection();     
        this.render();

    },
    render: function(){
            
        var self = this;    
        this.collection.fetch({
                
            success: function (collection, response, options) {
 
                self.$el.html( self.template({collection: self.collection.toJSON() }));
            }
        
        });
    
    },
    
    events: {
        "change #task-list-select": "doChangeTaskList"
    },
    
    doChangeTaskList: function(event) {
        
        event.preventDefault();
        var selected_list = $(event.currentTarget).find(":selected").val();
        
        if (selected_list) {
            var do_init = true;
        } else {
            var do_init = false;
        }
        //console.log('change task list: ' + selected_list);
        localStorage.setItem("selected_task_list", selected_list);
         
        new TaskView({do_init: do_init});
        new TaskListView();

    }
    
     
});

new TaskSelectorView();
