import { checkClientAvailability, addNewClient, editClientRequest, deleteClientRequest, 
        activateClientReq, editUserRequest } from './APIUtils';
import { notification } from 'antd';
import { ACCESS_TOKEN } from '../constants';

// CRUD functions for user //

export function editUser(id, username,email, password, role) {
    this.setState({
        editUserData: {id, username, email, password, role},
        editUserModal: ! this.state.editUserModal
    });
}

export function updateUser() {
    if( this.state.editUserData.username.length < 5 || this.state.editUserData.email.length < 5) {
        notification.warning({
            message: 'SPREACT SHOP',
            description: "Username & email must have at least 5 characters. Please try again !",
        });
        this.toogleEditUserModal();  
        return
    }
    editUserRequest(this.state.editUserData)
    .then(response => {
        notification.success({
            message: 'SPREACT SHOP',
            description: "User updated  successfully, you will be disconnected !",
        });
        this.toogleEditUserModal();  
        this.setState( { editUserData : {
            id: '',
            username: '',
            email: '',
            password: '',
            role: ''
        }}); 
        setTimeout(function() { window.location.reload(); }, 1000);           
    }).catch(error => {
        notification.error({
            message: 'SPREACT SHOP',
            description: "User not edited. You can't edit other users unless you are ADMIN !"
        });
        this.toogleEditUserModal();  
    });
}


// CRUD functions for clients //

export function addClient() {
    if(this.state.newClientData.nom.length === 0 || this.state.newClientData.prenom.length === 0 
        || this.state.newClientData.dateNaissance === null || this.state.newClientData.dateProc === null) {
            this.toogleNewClientModal();
            notification.error({
                message: 'SPREACT SHOP',
                description: "Fields can't be empty !",
            });
            return  
    }   
    checkClientAvailability(this.state.newClientData.nom, this.state.newClientData.prenom)
    .then(response => {
        if(!response) {
            this.toogleNewClientModal();
            notification.error({
                message: 'SPREACT SHOP',
                description: "Client " + this.state.newClientData.nom.toUpperCase() + " " + this.state.newClientData.prenom.toUpperCase() + " already exists !",
            });
            return  
        } else {
            addNewClient(this.state.newClientData)
                .then(response => {
                    notification.success({
                        message: 'SPREACT SHOP',
                        description: "Client added successfully !",
                    });
                    this.toogleNewClientModal(); 
                    setTimeout(function() { window.location.reload(); }, 1000);                 
                }).catch(error => {
                    notification.error({
                        message: 'SPREACT SHOP',
                        description: error.Message
                    });
                });
        
                this.setState( { newClientData : {
                    nom: '',
                    prenom: '',
                    dateNaissance: null
                }}); 
        }
    })
}

export function updateClient() {
    if( this.state.editClientData.nom.length <= 3 || this.state.editClientData.prenom.length <= 3) {
        this.toogleEditClientModal();  
        notification.warning({
            message: 'SPREACT SHOP',
            description: "First name & last name must have at least 3 characters each. Please try again !",
        });
        return
    }
    if( this.state.editClientData.dateNaissance === null || this.state.editClientData.dateProc === null) {
        this.toogleEditClientModal(); 
        notification.warning({
            message: 'SPREACT SHOP',
            description: "Dates of birth and procedure can't be empty. Please try again !",
        }); 
        return
    }
    editClientRequest(this.state.editClientData)
    .then(response => {
        notification.success({
            message: 'SPREACT SHOP',
            description: "Client updated  successfully !",
        });
        this.toogleEditClientModal();  
        this.setState( { editClientData : {
            id: '',
            nom: '',
            prenom: '',
            dateNaissance: null,
            dateProc: null
        }}); 
        setTimeout(function() { window.location.reload(); }, 1000);           
    }).catch(error => {
        notification.error({
            message: 'SPREACT SHOP',
            description: error.Error
        });
        this.toogleEditClientModal();  
    });
}

export function editClient(id, nom, prenom, dateNaissance, dateProc) {
    this.setState({
        editClientData: {id, nom, prenom, dateNaissance, dateProc},
        editClientModal: ! this.state.editClientModal
    });
}

export function removeClient(id) {
    this.setState({
        removeClientId: id,
        removeClientModal: ! this.state.removeClientModal
    });
}

export function activateClient(id) {
    this.setState({
        activateClientId: id,
        activateClientModal: ! this.state.activateClientModal
    });
}

export function deleteClient() {
    deleteClientRequest(this.state.removeClientId)
    .then(response => {
        if(response.message === "out") {
            localStorage.removeItem(ACCESS_TOKEN);
        } 
        
        notification.success({
            message: 'SPREACT SHOP',
            description: "Client deleted successfully !",
        });
        setTimeout(function() { window.location.reload(); }, 1000);
    }).catch(error => {
        notification.error({
            message: 'SPREACT SHOP',
            description: "You can't delete clients unless you are ADMIN !"
        });
    });
    this.setState({
        removeClientId: '',
        removeClientModal: ! this.state.removeClientModal
    });
}

export function activateClientRequest() {
    activateClientReq(this.state.activateClientId)
    .then(response => {
        if(response.message === "in") {
            localStorage.removeItem(ACCESS_TOKEN);
        } 
        
        notification.success({
            message: 'SPREACT SHOP',
            description: "Client activated successfully !",
        });
        setTimeout(function() { window.location.reload(); }, 1000);
    }).catch(error => {
        notification.error({
            message: 'SPREACT SHOP',
            description: "You can't activate clients unless you are ADMIN !"
        });
    });
    this.setState({
        activateClientId: '',
        activateClientModal: ! this.state.activateClientModal
    });
}

// Calcul age function //

export function calculate_age(date) {
    var today = new Date();
    var birthDate = new Date(date);  // create a date object directly from `date` argument
    var age_now = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age_now--;
    }
    return age_now;
}

export default {
    formatCurrency: function (num) {
        return '€' + Number(num.toFixed(1)).toLocaleString() + ' ';
    }
}
