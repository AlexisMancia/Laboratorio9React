import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';



class Student {
  constructor(carnet, name, lastname,tarde,horario/*,horario,tarde*/) {
      this._carnet = carnet;
      this._name = name;
      this._lastname = lastname;
      this._horario = horario;
      this._tarde = tarde;
  }

  get carnet() { return this._carnet }
  get name() { return this._name }
  get lastname() { return this._lastname }
  get tarde() {return this._tarde}
  get horario() {return this._horario}

  // Hacen falta las validaciones antes de la asignación
  set carnet(carnet) { this._carnet = carnet }
  set name(name) { this._name = name }
  set lastname(lastname) { this._lastname = lastname }
  set tarde(tarde) {this._tarde = tarde} 
  set horario(horario) {this._horario = horario}
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
      return students.map(({ carnet, name, lastname ,tarde,horario}) => {
          return (
              <tr 
              className="table-dark"
              key={carnet}>
                  <td>{carnet}</td>
                  <td>{name}</td>
                  <td>{lastname}</td>
                  <td>{horario}</td>
                  <td>{tarde}</td>
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
      this.state = { carnet: '', name: '', lastname: '',tarde: '' ,horario: ''};

      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Manejador del evento de submit, ejecuta la funcion saveStudent
  // Pasada por props
  handleSubmit(event) {
      event.preventDefault();
      // Se necesitan validaciones de entrada
      //console.log(this.state.carnet);
     
      var carnet_regex = new RegExp('^[0-9]{8}$');
      //console.log(carnet_regex);
      //console.log(this.state.horario);
      
      let parseLateSwitch= (value)=>{
          if(value){
          return "Tardisimo"
          }
          return "A tiempo"
          }
         //console.log(this.state.tarde);
         
      if(this.state.carnet && this.state.name && this.state.lastname){
        let tarde = parseLateSwitch(this.state.tarde)
        let student = new Student(this.state.carnet, this.state.name, this.state.lastname,tarde,this.state.horario);
        this.props.onSave(student);

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
  renderInput(name,placeholder,labelName, type = "text") {
      return (
          /* Se un fragmento React, para establecer que este código se hijo directo en el resultado */
          <fieldset>
              <label htmlFor={name}>{labelName}</label>
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
        <label htmlFor={name} className="schedule">Seleccione el horario:</label>
          <select
          className="form-control selectbox"
          name={name} id={name}
          value={this.state[name]}
          onChange={this.handleInputChange}
          >
            <option value="Lunes de 9:00 a 11.00">Lunes de 9:00 a 11.00</option>
            <option value="Martes de 13:30 a 15:30">Martes de 13:30 a 15:30</option>
            <option value="Miércoles de 9:00 a 11.00">Miércoles de 9:00 a 11.00</option>
            <option value="Jueves de 13:30 a 15:30">Jueves de 13:30 a 15:30</option>
            <option value="Viernes de 15:30 a 17:30">Viernes de 15:30 a 17:30</option>
          </select>
                
            
      </fieldset>
    );
  }


  render() {
      return (
          <form id="contact" action="" onSubmit={this.handleSubmit}>
              <h3>Student Form</h3>
              {this.renderInput("carnet","^[0-9]{8}$","Carnet:")}
              {this.renderInput("name","Nombre","Nombre:")}
              {this.renderInput("lastname","Apellido","Apellido")}
              {this.renderInput("tarde","checkbox","Llego tarde?",this.state.type="checkbox")}
              {this.renderInputSelect("horario")}
              
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