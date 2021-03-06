define(['views/index', 'views/register', 'views/login', 'views/forgotpassword'],
        function(IndexView, RegisterView, LoginView, ForgotPasswordView) {
  var SocialRouter = Backbone.Router.extend({
    currentview: null,

    routes:{
      'index': 'index',
      'register': 'register',
      'login': 'login',
      'forgotpassword': 'forgotpassword'
    },

    changeView: function(view) {
      if(this.curentView != null) {
        this.currentView.undelegateEvents();
      }
      this.currentView = view;
      this.currentView.render();
    },

    index: function() {
      this.changeView(new IndexView());
    },

    login: function() {
      this.changeView(new LoginView());
    },

    register: function() {
      this.changeView(new RegisterView());
    },

    forgotpassword: function() {
      this.changeView(new ForgotPasswordView());
    }
  });

  return new SocialRouter();
});