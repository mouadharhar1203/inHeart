import { API_BASE_URL, ACCESS_TOKEN } from '../constants';

// Make sur that all the requests are sent with the token //
const request = (options) => {

    const headers = new Headers({
        'Content-Type': 'application/json',
    })
    
    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response => 
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};

// API functions for register and authenticate //

export function login(loginRequest) {
    localStorage.removeItem(ACCESS_TOKEN);
    return request({
        url: API_BASE_URL + "/authenticate",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }
    return request({
        url: API_BASE_URL + "/me",
        method: 'GET'
    });
}

export function signup(signupRequest) {
    localStorage.removeItem(ACCESS_TOKEN);
    return request({
        url: API_BASE_URL + "/register",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}

export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/checkUsernameAvailability?username=" + username,
        method: 'GET'
    });
}

// Clients CRUD API //
export function getAllClients() {

    return request({
        url: API_BASE_URL + "/client" ,
        method: 'GET'
    });
}

export function checkClientAvailability(nom, prenom) {
    return request({
        url: API_BASE_URL + "/client/checkClientAvailability?nom=" + nom + "&prenom=" + prenom,
        method: 'GET'
    });
}

export function addNewClient(newClientRequest) {
    return request({
        url: API_BASE_URL + "/client/newClient",
        method: 'POST',
        body: JSON.stringify(newClientRequest)
    });
}

export function editClientRequest(editedClientRequest) {
    return request({
        url: API_BASE_URL + "/client",
        method: 'PUT',
        body: JSON.stringify(editedClientRequest)
    });
}

export function deleteClientRequest(id) {
    return request({
        url: API_BASE_URL + "/client/" + id,
        method: 'DELETE',
    });
}

export function activateClientReq(id) {
    return request({
        url: API_BASE_URL + "/client/activate/" + id,
        method: 'POST',
    });
}

// API functions for users //

export function addNewUser(newUserRequest) {
    return request({
        url: API_BASE_URL + "/register",
        method: 'POST',
        body: JSON.stringify(newUserRequest)
    });
}

export function editUserRequest(editedUserRequest) {
    return request({
        url: API_BASE_URL + "/user",
        method: 'PUT',
        body: JSON.stringify(editedUserRequest)
    });
}