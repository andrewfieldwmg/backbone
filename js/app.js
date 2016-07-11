var TaskModel = Backbone.Model.extend({
    urlRoot: '../api/api.php/tasks'
});


var TaskCollection = Backbone.Collection.extend({
    model: TaskModel,
    url: "../api/api.php/tasks/"
});


var TaskSelectorModel = Backbone.Model.extend({
    urlRoot: '../api/api.php/task_lists'
});


var TaskSelectorCollection = Backbone.Collection.extend({
    model: TaskSelectorModel,
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
        
        this.collection.comparator = function( model ) {
          return model.get('priority');
        }
        
        this.collection.sort();

            this.collection.fetch().done(function() {
                
                    self.collection.each(function(task){
        
                          var html = compiledTemplate(task.toJSON());
                        
                            if (task.toJSON().task_list == localStorage["selected_task_list"]) {              
                                results.push(html);             
                            }
                                           
                        });
            
                    self.$el.html(results).sortable({
            
                            start: function(event, ui) {
                                var start_pos = ui.item.index();
                                ui.item.data('start_pos', start_pos);
           
                            },
                            update: function (event, ui) {
                             
                            var item_id = ui.item.data('id');
                            var start_pos = ui.item.data('start_pos');
                            var end_pos = ui.item.index();
                            
                            },
                            
                            stop: function(event, ui) {
                            
                                        $(ui.item).siblings().andSelf().each(function() {

                                        var item_id = $(this).attr('data-id');
                                        var end_pos = $(this).index();
                                            
                                                var task_model = new TaskModel();
                                        
                                                task_model.save({id: item_id, priority : end_pos + 1}, {
                                                success: function (task_model, response) {
                                                
                                                    //console.log(response);
                               
                                                    }
                                                });
                                        });
                                        
                                          
                                        new TaskListView();
                                 
                            }
                        
                        
                        });
                    
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
              
             var current_text = response.name;
             
             $('span.list-item-text[data-id="' + clicked_id + '"]')
             .html('<input type="text" class="form-control-inline inline-edit" data-id="' + clicked_id + '" value="' + current_text + '">');
             $('.inline-edit[data-id="' + clicked_id + '"]').focus();
             
             localStorage.setItem("last-task-edited", clicked_id);
            
           }
        
        });
            
    },
    
      doInlineEdit: function(event) {
        event.stopPropagation();
        
    },
    
     doEdit: function(event) {
        //event.stopPropagation();

        var last_data_id_edited = localStorage["last-task-edited"];
        
        if (last_data_id_edited) {
    
            var task_term = $('.inline-edit[data-id="' + last_data_id_edited + '"]').val();
            
            var edit_task = new TaskModel();
            
            edit_task.save({id: last_data_id_edited, name : task_term}, {
            success: function (edit_task, response) {
         
                new TaskListView();

                }
            });
        
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
        
            var new_task = $("#task_input").val();
            var self = this;
            
            var day_month = new Date().toDateString().substring(4);
            
            this.model.save({
                name: new_task,
                status: 0,
                task_list: localStorage["selected_task_list"],
                created: day_month},
                {
                
            success: function (name, response) {
            
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
        
        this.model = new TaskSelectorModel(); 
        this.collection = new TaskSelectorCollection();     
    
              this.render = _.wrap(this.render, function(render) {
                                    this.beforeRender();
                                    render();						
                                    this.afterRender();
                            });						
                            
            this.render();

    },
    
    render: function(){

        return this;
    
    },
    
    beforeRender: function(){
            
        var self = this;    
        this.collection.fetch({
                
            success: function (collection, response, options) {
 
                self.$el.html( self.template({collection: self.collection.toJSON() }));
            }
        
        }).done(function() {
            
                if (localStorage["new_task_list"]) {
                    
                    $('#task-list-select').val(localStorage["new_task_list"]).change()
                    .promise().done(function() {
                        localStorage.setItem("new_task_list", "");
                    });
    
                }
            
            });
           

    },
    
    afterRender: function(){
     
    },
    
    events: {
        "change #task-list-select": "doChangeTaskList",
        "click .open-create-list-input": "doCreateTaskListInput",
        "click .submit-new-list": "doCreateTaskList",
        "click .delete-list": "doDeleteTaskList"
    },
    
    doChangeTaskList: function(event) {
        
        event.preventDefault();
        var selected_list = $(event.currentTarget).find(":selected").val();
        var selected_list_id = $(event.currentTarget).find(":selected").data("id");
        
        if (selected_list == 'create_new_list') {
            var do_init = false;
        } else if (!selected_list) {  
            var do_init = false;
        } else {
            var do_init = true;
        }
 
        $('.delete-list').attr('data-id', selected_list_id);
        
        localStorage.setItem("selected_task_list", selected_list);
         
        new TaskView({do_init: do_init});
        new TaskListView();

    },
        
    doCreateTaskListInput: function(event) {
        
        event.preventDefault();
        event.stopPropagation();
        
        $(event.currentTarget)
        .replaceWith('<input type="text" class="form-control-inline new-list-name" placeholder="Enter name..."><input type="submit" class="submit-new-list pull-right form-inline" value="Submit">');
        
        $('.new-list-name').focus();
    
    },
    
    doCreateTaskList: function(event) {
        
        event.preventDefault();
        event.stopPropagation();
        
        var new_list_name = $(".new-list-name").val();
        
        var self = this;

           this.model.save({
                name: new_list_name}, {
                
            success: function (name, response) {
            
                localStorage.setItem("new_task_list", new_list_name);
                self.render();
        
                }
            });

    },
    
    doDeleteTaskList: function(event) {
        
        event.preventDefault();
        event.stopPropagation();
        
        var list_id = $(event.currentTarget).data('id');
        
        var self = this;
        
        var model = new TaskSelectorModel({
            id: list_id
        });
       
         model.destroy({
            success: function(model, response) {
                self.render();
                   new TaskView({do_init: false});
        }});

    }
    
     
});


new TaskSelectorView();
