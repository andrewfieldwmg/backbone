var TaskModel = Backbone.Model.extend({
    urlRoot: '../api/api.php/tasks',

});


var TaskCollection = Backbone.Collection.extend({
    model: TaskModel,
    url: '../api/api.php/tasks'
});


var TaskListView = Backbone.View.extend({

  el: $("#task_list_container"),

  tagName: "tbody",
      
  initialize: function(){
  
    this.model = new TaskModel();
    this.collection = new TaskCollection();

    //this.listenTo(this.collection, "add", this.render);
    
    $(document).bind('click', this.doEdit);

  },
  render: function(){
    
    var compiledTemplate = _.template( $("#task-list-template").html());
    var self = this;    
    var results = [];  
    this.collection.fetch({
            
        success: function (collection, response, options) {
        
                for(var i in response) {
                    var id_res = response[i].id;
                    var task_res = response[i].task;
                    
                    var loaded_task = new TaskModel({id: id_res, task: task_res});
                    self.collection.add(loaded_task);
                }

        },
        error: function(collection, response, options) {
            alert('Error loading tasks!');
        }
    
    }).done(function() {
        
            self.collection.each(function(task){
                  var html = compiledTemplate(task.toJSON());
                  results.push(html);
            });
    
            self.$el.html(results);
    });

        //return this;
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
     
            var task_list_view = new TaskListView();
            task_list_view.render();

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
                self.render();
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
        var task_term = $('.inline-edit[data-id="' + last_data_id_edited + '"]').val();
        
        var edit_task = new TaskModel();
        
        edit_task.save({id: last_data_id_edited, task : task_term}, {
        success: function (edit_task, response) {
     
            var task_list_view = new TaskListView();
            task_list_view.render();

            }
        })
        
        
    }
      
});


var TaskView = Backbone.View.extend({
    
    el: $("#task_container"),
    
    initialize: function(){
        
        this.model = new TaskModel();
        this.collection = new TaskCollection();

        this.render();
        
        var task_list_view = new TaskListView();
        task_list_view.render();

    },
    render: function(){
    
        var template = _.template( $("#task_template").html());
        this.$el.html( template );
    },
    
    events: {
        "submit #submit_task": "doTask"
    },
    
    doTask: function(event) {
        
        event.preventDefault();

            var task_term = $("#task_input").val();
            var self = this;
            
            this.model.save({task : task_term}, {
            success: function (task, response) {
                
                var new_task = new TaskModel({id: response, task: task_term});

                self.collection.add(new_task);
         
                var task_list_view = new TaskListView();
                task_list_view.render();
                
                $("#task_input").val('');

                }
            })

    }
    
     
});


new TaskView();