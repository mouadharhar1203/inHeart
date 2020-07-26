import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, InputGroup, CustomInput }  from 'reactstrap';
import { Form, FormControl } from 'react-bootstrap';
import { GoSearch } from 'react-icons/go';
import {  Pagination } from "antd";
import Card from 'react-bootstrap/Card';
import { notification } from 'antd';

import Moment from 'moment';
import { getAllClients } from '../util/APIUtils';
import { addClient, editClient, updateClient, calculate_age, removeClient, activateClient, deleteClient, activateClientRequest} from '../util/CrudUtils';

import 'bootstrap/dist/css/bootstrap.min.css';

import { CSVLink } from 'react-csv';

class Clients extends Component {
    state = {
        // List of clients on database
        clients: [],
        currentUsername: '',

        // New Client data
        newClientData: {
            nom: '',
            prenom: '',
            dateNaissance : null,
            dateProc : null
        },

        // Client's edited data
        editClientData: {
            id: "",
            nom: '',
            prenom: '',
            dateNaissance : null,
            dateProc : null
        },

        // The id of the client to delete
        removeClientId: '',
        activateClientId: '',

        // List of searched clients
        searchClients: [],

        // Min and max value of the table rows
        minValue: 0,
        maxValue: 10,

        // Boolean for different modals on the page
        newClientModal: false,
        editClientModal: false,
        removeClientModal: false,
        activateClientModal: false,

        // Boolean to show the deleted clients too
        deletedList : false
    }

    handleChange = value => {
        if (value <= 1) {
          this.setState({
            minValue: 0,
            maxValue: 10
          });
        } else {
          this.setState({
            minValue: this.state.maxValue,
            maxValue: value * 10
          });
        }
      };

    // toogles to change the value of the boolean to show the modal once we click on a button
    toogleEditClientModal() {
        this.setState({
            editClientModal: ! this.state.editClientModal
        });
    }

    toogleRemoveClientModal() {
        this.setState({
            removeClientModal: ! this.state.removeClientModal
        });
    }

    toogleActivateClientModal() {
        this.setState({
            activateClientModal: ! this.state.activateClientModal
        });
    }

    toogleNewClientModal() {
        this.setState({
            newClientModal: ! this.state.newClientModal
        });
    }

    // After every change on the page (components)
    componentWillMount() {
        getAllClients().then(response => {       
            this.setState({clients: response, searchClients: response});
            }).catch(error => {
                notification.error({
                    message: 'SPREACT SHOP',
                    description: 'You have been disconnected, try to connect again !'
                });
            });
    }
    
    // Function to filter the list of the clients on the table
    filterList = (event) => {
        let clients = this.state.clients;
        clients = clients.filter((client) => {
            return client.nom.toLowerCase().trim().search(event.target.value.toLowerCase().trim()) !== -1 || client.prenom.toLowerCase().trim().search(event.target.value.toLowerCase().trim()) !== -1
        });
        this.setState({searchClients : clients});
    }

    // Function to show the deleted clients too
    deletedList = (event) => {
        this.setState({deletedList: !this.state.deletedList});
    }

    render() {
        // Check if the user is still connected, else redirect to login page
        if(!localStorage.getItem('token')){
            this.props.history.push("/login");
        }

        // Check if the list of clients is empty
        if(!this.state.clients) {
            return <div></div>
        }

        // Get the list of rows customized
        let clients = this.state.searchClients.sort().slice(this.state.minValue, this.state.maxValue).map((client) => {
            if(client.available) {
                return (
                    <tr key={client.id}>
                      <td>{client.nom}</td>
                      <td>{client.prenom}</td>
                      <td>{calculate_age(client.dateNaissance)}</td>
                      <td>{Moment(client.dateProc).format('DD MMM YYYY')}</td>
                      <td>
                        <Button outline color="success" className="mr-2" size="lr" 
                              onClick={editClient.bind(this, client.id, client.nom, client.prenom, client.dateNaissance, client.dateProc)} >Edit</Button>
                        <Button outline color="danger" className="mr-2" size="lr" 
                              onClick={removeClient.bind(this, client.id)} >Delete</Button>
                      </td>
                    </tr>
                  )
            } else {
                if(this.state.deletedList) {
                    return (
                        <tr key={client.id}>
                            <td>{client.nom}</td>
                            <td>{client.prenom}</td>
                            <td>{calculate_age(client.dateNaissance)}</td>
                            <td>{Moment(client.dateProc).format('DD MMM YYYY')}</td>
                            <td>
                                <Button outline color="danger" size="lr" onClick={activateClient.bind(this, client.id)}>Client Deleted</Button>
                            </td>
                        </tr>
                    )
                } else {
                    return (null);
                }
            }            
          });

        return (
            <div className="row">
            <div className="col-md-1" />
                <div className="col-md-10"><br/><br/>
                    <div>
                        <Button outline color="primary" onClick={this.toogleNewClientModal.bind(this)}>New client</Button>
                    </div>
                    <br/>

                    {/* Modal of the form to create a new client */}
                    <Modal isOpen={this.state.newClientModal} toggle={this.toogleNewClientModal.bind(this)}>
                        <ModalHeader toggle={this.toogleNewClientModal.bind(this)}>New Client :</ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <Label for="nom">Last name :</Label>
                                <Input required id="nom" value={this.state.newClientData.nom} onChange={(e) => {
                                    let { newClientData } = this.state;
                                    newClientData.nom = e.target.value;
                                    this.setState({ newClientData });
                                }} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="prenom">First name :</Label>
                                <Input required id="prenom" value={this.state.newClientData.prenom} onChange={(e) => {
                                    let { newClientData } = this.state;
                                    newClientData.prenom = e.target.value;
                                    this.setState({ newClientData });
                                }} />
                            </FormGroup>
                            <FormGroup >
                                <Label for="dateNaissance">Date of birth :</Label>
                                <Input required type="date" id="dateNaissance" value={this.state.newClientData.dateNaissance} onChange={(e) => {
                                    let { newClientData } = this.state;
                                    newClientData.dateNaissance = e.target.value;
                                    this.setState({ newClientData });
                                }} />
                            </FormGroup>
                            <FormGroup >
                                <Label for="dateProc">Date of procedure :</Label>
                                <Input required type="date" id="dateProc" value={this.state.newClientData.dateProc} onChange={(e) => {
                                    let { newClientData } = this.state;
                                    newClientData.dateProc = e.target.value;
                                    this.setState({ newClientData });
                                }} />
                            </FormGroup><br/>
                            {/* <FormGroup>
                                <Label for="photo">Photo</Label>
                                    <Input type="file" name="photo" id="photo" />
                                <FormText color="muted">
                                    You can upload a photo te help you reconize your client.
                                </FormText>
                            </FormGroup> */}
                            <FormGroup>
                                <Button color="success" type="submit" onClick={addClient.bind(this)} >Add client</Button>{' '}
                                <Button style={{ position:'absolute', right:'30px' }} color="danger" onClick={this.toogleNewClientModal.bind(this)}>Cancel</Button>
                            </FormGroup>
                        </ModalBody>
                    </Modal>

                    {/* Modal of the form to edit a client */}
                    <Modal isOpen={this.state.editClientModal} toggle={this.toogleEditClientModal.bind(this)} >
                        <ModalHeader toggle={this.toogleEditClientModal.bind(this)}>Edit client :</ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <Label for="nom">Last name :</Label>
                                <InputGroup>
                                    <Input id="nom" value={this.state.editClientData.nom} onChange={(e) => {
                                    let { editClientData } = this.state;
                                    editClientData.nom = e.target.value;
                                    this.setState({ editClientData });
                                }} />
                                </InputGroup>
                            </FormGroup>
                            <FormGroup>
                                <Label for="prenom">First name :</Label>
                                <InputGroup>
                                    <Input id="prenom" value={this.state.editClientData.prenom} onChange={(e) => {
                                    let { editClientData } = this.state;
                                    editClientData.prenom = e.target.value;
                                    this.setState({ editClientData });
                                }} />
                                </InputGroup>
                            </FormGroup>
                            <FormGroup>
                                <Label for="dateNaissance">Date of birth :</Label>
                                <InputGroup>
                                    <Input type="date" id="dateNaissance" value={Moment(this.state.editClientData.dateNaissance).format('YYYY-MM-DD')} onChange={(e) => {
                                    let { editClientData } = this.state;
                                    editClientData.dateNaissance = e.target.value;
                                    this.setState({ editClientData });
                                }} />
                                </InputGroup>
                            </FormGroup>
                            <FormGroup>
                                <Label for="dateProc">Date of procedure :</Label>
                                <InputGroup>
                                    <Input type="date" id="dateProc" value={Moment(this.state.editClientData.dateProc).format('YYYY-MM-DD')} onChange={(e) => {
                                    let { editClientData } = this.state;
                                    editClientData.dateProc = e.target.value;
                                    this.setState({ editClientData });
                                }} />
                                </InputGroup>
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button outline color="primary" onClick={updateClient.bind(this)}>Edit Client</Button>{' '}
                            <Button outline color="secondary" onClick={this.toogleEditClientModal.bind(this)}>Cancel</Button>
                        </ModalFooter>
                    </Modal>

                    {/* Modal to confirm the delete of a client */}
                    <Modal isOpen={this.state.removeClientModal} toggle={this.toogleRemoveClientModal.bind(this)} >
                        <ModalHeader toggle={this.toogleRemoveClientModal.bind(this)}>Remove client : <i>Are you sure ?</i></ModalHeader>
                        <ModalFooter>
                            <Button color="danger" onClick={deleteClient.bind(this)}>Remove Client</Button>{' '}
                            <Button color="success" onClick={this.toogleRemoveClientModal.bind(this)}>Cancel</Button>
                        </ModalFooter>
                    </Modal>

                    {/* Modal to confirm the activation of a client */}
                    <Modal isOpen={this.state.activateClientModal} toggle={this.toogleActivateClientModal.bind(this)} >
                        <ModalHeader toggle={this.toogleActivateClientModal.bind(this)}>Activate : <i>Are you sure ?</i></ModalHeader>
                        <ModalFooter>
                            <Button color="success" onClick={activateClientRequest.bind(this)}>Activate Client</Button>{' '}
                            <Button color="danger" onClick={this.toogleActivateClientModal.bind(this)}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                        
                   
                    <br/>
                    {/* Card that contains the table of clients */}
                    <Card>
                        <Card.Header>
                            <div style={{display: 'flex',  justifyContent:'center', height: '4vh'}}>
                                <Button outline color="primary">List of clients</Button>
                                <div style={{ position:'absolute', right:'110px' }}>
                                    <CustomInput type="switch" id="exampleCustomSwitch" name="customSwitch" label="Deleted clients" onChange={this.deletedList}/>
                                </div>
                            </div>
                            <div style={{display: 'flex', height: '4vh'}}>
                                <Button outline color="primary"><CSVLink data={this.state.searchClients}>Export CSV</CSVLink></Button>
                                <Form inline style={{ position:'absolute', right:'30px' }}>
                                    <FormControl type="text" placeholder="Search" className="mr-sm-2" onChange={this.filterList} /><GoSearch/>
                                </Form>
                                
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <blockquote className="blockquote mb-0">
                                <Table striped>
                                    <thead>
                                        <tr>
                                            <th><i>Last name</i></th>
                                            <th><i>First Name</i></th>
                                            <th><i>Age</i></th>
                                            <th><i>Procedure's date</i></th>
                                            <th><i>Actions</i></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clients}
                                    </tbody>
                                </Table>
                            </blockquote>
                        </Card.Body>
                    </Card>
                    <br/>
                    <div style={{display: 'flex',  justifyContent:'center', alignItems:'center' }}>
                        <Pagination defaultCurrent={1} defaultPageSize={10} onChange={this.handleChange} total={15}/>
                    </div><br/><br/>
                </div>  
                </div>         
        );
    }
}

export default withRouter(Clients);