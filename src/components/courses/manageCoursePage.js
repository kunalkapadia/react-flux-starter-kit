'use strict';

var React = require('react');
var Router = require('react-router');
var CourseForm = require('./courseForm');
var CourseStore = require('../../stores/courseStore');
var CourseActions = require('../../actions/courseActions');
var toastr = require('toastr');

var ManageCourse = React.createClass({
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
      course: { id: '', title: '', author: {}, length: '', category: '' },
      errors: {},
      dirty: false
    };
  },

  // good place to set state as re-render won't happen if we set state
  componentWillMount: function () {
    var courseId = this.props.params.id;

    if (courseId) {
      this.setState({ course: CourseStore.getCourseById(courseId) });
    }
  },

  setCourseState: function () {
    this.setState({ dirty: true });
    var field = event.target.name;
    var value = event.target.value;
    this.state.course[field] = value;
    return this.setState({course: this.state.course});
  },

  isCourseFormValid: function () {
    var isFormValid = true;
    this.state.errors = {};

    if (this.state.course.title.length < 3) {
      this.state.errors.title = "Title must be at least 3 characters.";
      isFormValid = false;
    }

    if (this.state.course.category.length < 3) {
      this.state.errors.category = "Title must be at least 3 characters.";
      isFormValid = false;
    }

    this.setState({ errors: this.state.errors });
    return isFormValid;
  },

  saveCourse: function (event) {
    event.preventDefault();

    if (!this.isCourseFormValid()) {
      return;
    }

    if (this.state.course.id) {
      CourseActions.updateCourse(this.state.course);      
    } else {
      CourseActions.createCourse(this.state.course);
    }
    
    this.setState({ dirty: false });
    toastr.success('Aye! Course saved.');
    this.transitionTo('courses');
  },

  render: function () {
    return (
      <CourseForm
        course={this.state.course}
        onChange={this.setCourseState}
        onSave={this.saveCourse}
        errors={this.state.errors} />
    );
  }
});

module.exports = ManageCourse;