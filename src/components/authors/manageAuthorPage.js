'use strict';

var React = require('react');
var Router = require('react-router');
var AuthorForm = require('./authorForm');
var AuthorActions = require('../../actions/authorActions');
var AuthorStore = require('../../stores/authorStore');
var toastr = require('toastr');

var ManageAuthorPage = React.createClass({
  mixins: [
    Router.Navigation
  ],

  statics: {
    willTransitionFrom: function (transition, component) {
      if (component.state.dirty && !confirm('Are you sure you want to leave without saving?')) {
        transition.abort();
      }
    }
  },

  getInitialState: function () {
    return {
      author: { id: '', firstName: '', lastName: '' },
      errors: {},
      dirty: false
    };
  },

  // good place to set state as re-render won't happen if we set state
  componentWillMount: function () {
    var authorId = this.props.params.id;

    if (authorId) {
      this.setState({ author: AuthorStore.getAuthorById(authorId) });
    }
  },

  setAuthorState: function (event) {
    this.setState({ dirty: true });
    var field = event.target.name;
    var value = event.target.value;
    this.state.author[field] = value;
    return this.setState({author: this.state.author});
  },

  isAuthorFormValid: function () {
    var isFormValid = true;
    this.state.errors = {}; // clear any previous errors

    if (this.state.author.firstName.length < 3) {
      this.state.errors.firstName = "First name must be at least 3 characters.";
      isFormValid = false;
    }

    if (this.state.author.lastName.length < 3) {
      this.state.errors.lastName = "Last name must be at least 3 characters.";
      isFormValid = false;
    }

    this.setState({ errors: this.state.errors });
    return isFormValid;
  },

  saveAuthor: function (event) {
    event.preventDefault();

    if (!this.isAuthorFormValid()) {
      return;
    }
    
    if (this.state.author.id) {
      AuthorActions.updateAuthor(this.state.author);
    } else {
      AuthorActions.createAuthor(this.state.author);
    }

    this.setState({ dirty: false });
    toastr.success('Aye! Author saved.');
    this.transitionTo('authors');
  },

  render: function () {
    return (
      <AuthorForm
        author={this.state.author}
        onChange={this.setAuthorState}
        onSave={this.saveAuthor}
        errors={this.state.errors} />
    );
  }
});

module.exports = ManageAuthorPage;