import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';



class Student {
  constructor(carnet, name, lastname/*,horario,tarde*/) {
      this._carnet = carnet;
      this._name = name;
      this._lastname = lastname;
      //this._horario = horario;
      //this._tarde = tarde;
  }

  get carnet() { return this._carnet }
  get name() { return this._name }
  get lastname() { return this._lastname }

  // Hacen falta las validaciones antes de la asignación
  set carnet(carnet) { this._carnet = carnet }
  set name(name) { this._name = name }
  set lastname(lastname) { this._lastname = lastname }
}

class StudentsList extends React.Component {

  renderHeader() {
      return Object.keys(new Student()).map((key, index) => {
          return (
              <th 
              key={index}>
                  {key.substring(1)}
              </th>
          );
      });
  }

  renderBody(students) {
      return students.map(({ carnet, name, lastname }) => {
          return (
              <tr 
              className="table-dark"
              key={carnet}>
                  <td>{carnet}</td>
                  <td>{name}</td>
                  <td>{lastname}</td>
                  <td>
                      <button className="btn btn-danger" onClick={() => {this.props.onDelete(carnet)}}>Delete</button>
                  </td>
              </tr>
          );
      });
    
  }

  render() {
      return (
          <div>
              <table>
                  <thead>
                      <tr>
                          {this.renderHeader()}
                          <th> actions</th>
                      </tr>
                  </thead>
                  <tbody>
                       {this.renderBody(this.props.students)}
                  </tbody>
              </table>
          </div>
      );
  }
}

class StudentForm extends React.Component {

  constructor(props) {
      super(props);
      this.state = { carnet: '', name: '', lastname: '' };

      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Manejador del evento de submit, ejecuta la funcion saveStudent
  // Pasada por props
  handleSubmit(event) {
      event.preventDefault();
      // Se necesitan validaciones de entrada
      console.log(this.state.carnet);
     
      var carnet_regex = new RegExp('^[0-9]{8}$');
      //console.log(carnet_regex);
      
      if(this.state.carnet && this.state.name && this.state.lastname){
        let student = new Student(this.state.carnet, this.state.name, this.state.lastname);
        this.props.onSave(student);
       //if de la checked box 
      }else{
        alert("Llene todos los campos")
      }
      
  }

  handleInputChange(event) {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;

      this.setState({
          [name]: value
      });
  }

  // Label + input
  // TODO: Necesita se modificado para funcionar con todos los tipos de entrada
  renderInput(name,placeholder, type = "text") {
      return (
          /* Se un fragmento React, para establecer que este código se hijo directo en el resultado */
          <fieldset>
              <label htmlFor={name}>{name}</label>
              <input
                  className="form-control"
                  type={type}
                  name={name} id={name}
                  value={this.state[name]}
                  placeholder= {placeholder}
                  onChange={this.handleInputChange} />
          </fieldset>
      );
  }

  renderInputSelect(name){
    return(
      <fieldset>
        <label className="schedule">Seleccione el horario:</label>
                <select>
                    <option>Lunes de 9:00 a 11.00</option>
                    <option>Martes de 13:30 a 15:30</option>
                    <option>Miércoles de 9:00 a 11.00</option>
                    <option>Jueves de 13:30 a 15:30</option>
                    <option>Viernes de 9:00 a 11.00</option>
                    <option>Viernes de 15:30 a 17:30</option>
                </select>
      </fieldset>
    );
  }


  render() {
      return (
          <form id="contact" action="" onSubmit={this.handleSubmit}>
              <h3>Student Form</h3>
              {this.renderInput("carnet","^[0-9]{8}$")}
              {this.renderInput("name","Nombre")}
              {this.renderInput("lastname","Apellido")}
              {this.renderInput("Llego Tarde","checkbox",this.state.type="checkbox")}
              {this.renderInputSelect("asd")}
              <fieldset>
                  <button className="btn btn-danger" name="submit" type="submit" id="contact-submit" data-submit="...Sending">Submit</button>
              </fieldset>
          </form>
      );
  }
}

class App extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
          students: [],
          err: ''
      }
  }

  saveStudent(student) {
      const students = this.state.students.slice();
      if (!students.find((current) => {
          return current.carnet === student.carnet;
      })) {
          students.push(student);
          this.setState({ students, err: '' });
      } else {
          this.setState({ err: "El estudiante ya existe" })
      }

  }

  deleteStudent(carnet) {
      const students = this.state.students.filter(function (ele) {
          return ele.carnet !== carnet;
      });
      this.setState({ students });
  }

  render() {
      return (
          <div className="container">
              <div className="jumbotron">
                  <div>{this.state.err}</div>
                  <StudentForm onSave={(student) => {
                      this.saveStudent(student)
                  }} />
              </div>
              <StudentsList students={this.state.students} onDelete={(carnet) => {
                  this.deleteStudent(carnet);
              }} />
          </div>
      );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

/*


class Register extends React.Component{
    render(){
        return(
            <form className="form-group">
                <label>
                Carnet:
                <input type="text" name="name" id="carnet_field" />
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

class Labo9 extends React.Component {
  constructor(props){
    super(props);

  }
  render() {
      return (
        <div className="container">
        <br></br>
        <div className="jumbotron">
            <h1>
            Registro de laboratorio. {this.props.name}
            </h1>
        </div>
          <Register />
        </div>
      );
    }
  }

  ReactDOM.render(
    <Labo9/>,
    document.getElementById('root')
  );
  
  
*/