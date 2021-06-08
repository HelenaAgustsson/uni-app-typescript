import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM, { render } from 'react-dom';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { Student, studentService } from './services';
import { Program, programService } from './services';
import { Alert, Card, Row, Column, NavBar, Button, Form } from './widgets';
import { createHashHistory } from 'history';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

class Menu extends Component {
  render() {
    return (
      <NavBar brand="StudAdm">
        <NavBar.Link to="/students">Students</NavBar.Link>
        <NavBar.Link to="/programs">Programs</NavBar.Link>
      </NavBar>
    );
  }
}

class Home extends Component {
  render() {
    return <Card title="Welcome">Welcome to StudAdm</Card>;
  }
}

class StudentList extends Component {
  students: Student[] = [];

  render() {
    return (
      <Card title="Students">
        {this.students.map((student) => (
          <Row key={student.id}>
            <Column>
              <NavLink to={'/students/' + student.id}>{student.name}</NavLink>
            </Column>
          </Row>
        ))}
      </Card>
    );
  }

  mounted() {
    studentService.getStudents((students) => {
      this.students = students;
    });
  }
}

class StudentDetails extends Component<{ match: { params: { id: string } } }> {
  student = new Student();

  render() {
    return (
      <div>
        <Card title="Student details">
          <Row>
            <Column width={2}>Name:</Column>
            <Column>{this.student.name}</Column>
          </Row>
          <Row>
            <Column width={2}>Email:</Column>
            <Column>{this.student.email}</Column>
          </Row>
        </Card>
        <Button.Light onClick={this.edit}>Edit</Button.Light>
      </div>
    );
  }

  mounted() {
    studentService.getStudent(Number(this.props.match.params.id), (student) => {
      this.student = student;
    });
  }

  edit() {
    history.push('/students/' + this.student.id + '/edit');
  }
}

class StudentEdit extends Component<{ match: { params: { id: string } } }> {
  student = new Student();

  render() {
    return (
      <div>
        <Card title="Edit student">
          <Form.Label>Name:</Form.Label>
          <Form.Input
            type="text"
            value={this.student.name}
            onChange={(event) => (this.student.name = event.currentTarget.value)}
          />
          <Form.Label>Email:</Form.Label>
          <Form.Input
            type="text"
            value={this.student.email}
            onChange={(event) => (this.student.email = event.currentTarget.value)}
          />
        </Card>
        <Row>
          <Column>
            <Button.Success onClick={this.save}>Save</Button.Success>
          </Column>
          <Column right>
            <Button.Light onClick={this.cancel}>Cancel</Button.Light>
          </Column>
        </Row>
      </div>
    );
  }

  mounted() {
    studentService.getStudent(Number(this.props.match.params.id), (student) => {
      this.student = student;
    });
  }

  save() {
    studentService.updateStudent(this.student, () => {
      history.push('/students/' + this.props.match.params.id);
    });
  }

  cancel() {
    history.push('/students/' + this.props.match.params.id);
  }
}

class ProgramList extends Component {
  programs: Program[] = [];

  render() {
    return (
      <Card title="Programs">
        {this.programs.map((program) => (
          <Row key={program.id}>
            <Column>
              <NavLink to={'/programs/' + program.id}>{program.name}</NavLink>
            </Column>
          </Row>
        ))}
      </Card>
    );
  }
  mounted() {
    programService.getPrograms((programs) => {
      this.programs = programs;
    });
  }
}

class ProgramDetails extends Component<{ match: { params: { id: string } } }> {
  program = new Program();

  render() {
    return (
      <div>
        <Card title="Program details">
          <Row>
            <Column width={2}>Name:</Column>
            <Column>{this.program.name}</Column>
          </Row>
        </Card>
        <Button.Light onClick={this.edit}>Edit</Button.Light>
      </div>
    );
  }

  mounted() {
    programService.getProgram(Number(this.props.match.params.id), (program) => {
      this.program = program;
    });
  }

  edit() {
    history.push('/programs/' + this.program.id + '/edit');
  }
}

class ProgramEdit extends Component<{ match: { params: { id: string } } }> {
  program = new Program();

  render() {
    return (
      <div>
        <Card title="Edit Program">
          <Form.Label>Name:</Form.Label>
          <Form.Input
            type="text"
            value={this.program.name}
            onChange={(event) => (this.program.name = event.currentTarget.value)}
          />
        </Card>
        <Row>
          <Column>
            <Button.Success onClick={this.save}>Save</Button.Success>
          </Column>
          <Column right>
            <Button.Light onClick={this.cancel}>Cancel</Button.Light>
          </Column>
        </Row>
      </div>
    );
  }
  mounted() {
    programService.getProgram(Number(this.props.match.params.id), (program) => {
      this.program = program;
    });
  }
  save() {
    programService.updateProgram(this.program, () => {
      history.push('/programs');
    });
  }
  cancel() {}
}

ReactDOM.render(
  <div>
    <Alert />
    <HashRouter>
      <div>
        <Menu />
        <Route exact path="/" component={Home} />
        <Route exact path="/students" component={StudentList} />
        <Route exact path="/students/:id" component={StudentDetails} />
        <Route exact path="/students/:id/edit" component={StudentEdit} />
        <Route exact path="/programs" component={ProgramList} />
        <Route exact path="/programs/:id" component={ProgramDetails} />
        <Route exact path="/programs/:id/edit" component={ProgramEdit} />
      </div>
    </HashRouter>
  </div>,
  document.getElementById('root')
);
