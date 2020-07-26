import React, { Component } from 'react';
import { getCurrentUser } from '../../util/APIUtils';
import { editUser, updateUser } from '../../util/CrudUtils';
import { Avatar } from 'antd';
import { getAvatarColor } from '../../util/Colors';
import './Profile.css';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';
import { ListGroup, ListGroupItem, Row, Col } from 'reactstrap';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, InputGroup, InputGroupAddon, InputGroupText }  from 'reactstrap';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            addresses: [],
            editUserData: {
                id: "",
                username: '',
                email: '',
                password: '',
                role: ''
            },
            editUserModal:false
        }
        this.loadUserProfile = this.loadUserProfile.bind(this);
    }

    toogleEditUserModal() {
        this.setState({
            editUserModal: ! this.state.editUserModal
        });
    }

    loadUserProfile() {

        getCurrentUser()
        .then(response => {
            this.setState({
                user: response,
                addresses: response.adresses
            });
        }).catch(error => {
            if(error.status === 404) {
                this.setState({
                    notFound: true
                });
            } else {
                this.setState({
                    serverError: true
                });        
            }
        });        
    }
      
    componentDidMount() {
        this.loadUserProfile();
    }

    componentDidUpdate(nextProps) {
        if(this.props.match.params.username !== nextProps.match.params.username) {
            this.loadUserProfile();
        }        
    }

    render() {

        if(this.state.notFound) {
            return <NotFound />;
        }

        if(this.state.serverError) {
            return <ServerError />;
        }

        return (
            
            <div>
                        { 
                            this.state.user ? (
                                <div className="user-profile">
                                    <div className="user-details">
                                        <div className="user-avatar">
                                            <Avatar className="user-avatar-circle" style={{ backgroundColor: getAvatarColor(this.state.user.username)}}>
                                                {this.state.user.username[0].toUpperCase()}
                                            </Avatar>
                                        </div>
                                        <div className="user-summary">
                                            <div className="full-name">{this.state.user.username.toUpperCase()}</div>
                                            <div className="username">@{' '}{this.state.user.username}</div>
                                        </div>
                                    </div><br/>
                                    <Row>
                                        <Col sm="4">
                                        </Col>
                                        <Col sm="4">
                                            <ListGroup>
                                                <ListGroupItem tag="a" >Username : <i><b>{this.state.user.username.toUpperCase()}</b></i></ListGroupItem>
                                                <ListGroupItem tag="a" >Email : <i><b>{this.state.user.email}</b></i></ListGroupItem>
                                                <ListGroupItem tag="a" >Role : <i><b>{this.state.user.role}</b></i></ListGroupItem>
                                                <ListGroupItem style={{display: 'flex',  justifyContent:'center'}} tag="a" active onClick={editUser.bind(this, this.state.user.id, this.state.user.username, this.state.user.email, '', this.state.user.role)}>Modify</ListGroupItem>
                                            </ListGroup>
                                        </Col>
                                    </Row>

                                    <Modal isOpen={this.state.editUserModal} toggle={this.toogleEditUserModal.bind(this)} >
                                        <ModalHeader toggle={this.toogleEditUserModal.bind(this)}>Edit user :</ModalHeader>
                                        <ModalBody>
                                        <FormGroup>
                                                <Label for="username">Username :</Label>
                                                <InputGroup>
                                                    <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>$</InputGroupText>
                                                    </InputGroupAddon>
                                                    <Input id="username" value={this.state.editUserData.username} onChange={(e) => {
                                                    let { editUserData } = this.state;
                                                    editUserData.username = e.target.value;
                                                    this.setState({ editUserData });
                                                }} />
                                                </InputGroup>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="email">Email :</Label>
                                                <InputGroup>
                                                    <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>@</InputGroupText>
                                                    </InputGroupAddon>
                                                    <Input id="email" value={this.state.editUserData.email} onChange={(e) => {
                                                    let { editUserData } = this.state;
                                                    editUserData.email = e.target.value;
                                                    this.setState({ editUserData });
                                                }} />
                                                </InputGroup>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label type="password" for="password">New password : <small>(Empty if u don't want to change it)</small></Label>
                                                <Input type="password" id="password" /*value={this.state.editUserData.password}*/ onChange={(e) => {
                                                    let { editUserData } = this.state;
                                                    editUserData.password = e.target.value;
                                                    this.setState({ editUserData });
                                                }} />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="role">Role :</Label>
                                                <Input type="select" name="select" id="role" value={this.state.editUserData.role} onChange={(e) => {
                                                        let { editUserData } = this.state;
                                                        editUserData.role = e.target.value;
                                                        this.setState({ editUserData });
                                                        }} >
                                                    <option>ROLE_USER</option>
                                                    <option>ROLE_ADMIN</option>
                                                </Input>
                                            </FormGroup>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button outline color="primary" onClick={updateUser.bind(this)}>Edit User</Button>{' '}
                                            <Button outline color="secondary" onClick={this.toogleEditUserModal.bind(this)}>Cancel</Button>
                                        </ModalFooter>
                                    </Modal>

                                </div>  
                            ): null               
                        }
                        
            </div>
        );
    }
}

export default Profile;