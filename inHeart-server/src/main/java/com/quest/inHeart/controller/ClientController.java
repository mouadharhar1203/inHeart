package com.quest.inHeart.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.quest.inHeart.model.Client;
import com.quest.inHeart.model.JwtUserDetails;
import com.quest.inHeart.repositories.ClientRepository;

/**
* inHEART application
* @author  HARHAR Mouâd
* 
* @version 1.0
* @since   26/08/2020 
*/
@RestController
@RequestMapping(path = "/client")
public class ClientController {
	
	@Autowired
	private ClientRepository clientRepository;
	
	/**
	   * This method is used to get the list of
	   * all the clients in the data base.
	   * @param No params should be given to this method
	   * @return Iterable<Client> a list of clients
	   */
	@CrossOrigin
	@GetMapping("")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<?> getList() {
		Iterable<Client> myList = clientRepository.findAll();
		return new ResponseEntity<>(myList, HttpStatus.OK);
	}
	
	/**
	   * Get Method 
	   * This method is used to get a client by it's
	   * id, if the client is not found the function 
	   * returns an error message saying that.
	   * @param Integer id : the id of the client
	   * @return A ResponseEntity with the client if found
	   */
	@GetMapping("/{id}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<?> getOneById(@PathVariable("id") Integer id) {
		
		Client client = clientRepository.getOneById(id);
		Map<String, String> obj = new HashMap<String, String>();

		if (client == null) {
			obj.put("Error", "Client not found !");
			return ResponseEntity.status(HttpStatus.CONFLICT).body(obj);
		}
		return new ResponseEntity<Client>(client, HttpStatus.OK);
	}
	
	/**
	   * This is a POST Method
	   * This method is used to create a new client
	   * in the database.
	   * @param Client Json : firstName, lastName, dayOfBirth, dayOfProc
	   * @return ResponseEntity with the object created returned
	   */
	@CrossOrigin
	@PostMapping("/newClient")
	public ResponseEntity<?> createClient(@RequestBody Client client) {
		
		if(client.getNom().isEmpty() || client.getPrenom().isEmpty() || client.getDateNaissance() == null || client.getDateProc() == null ) {
			Map<String, String> obj = new HashMap<String, String>();
			obj.put("Message", "Fields can't be empty !");
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(obj);
		}

		Client newClient = new Client(client.getNom(), client.getPrenom(), client.getDateNaissance(), client.getDateProc());
		newClient.setAvailable(true);
		clientRepository.save(newClient);

		return new ResponseEntity<Client>(newClient, HttpStatus.CREATED);
	}
	
	/**
	   * Get Method
	   * This method is used to check if the client (firstName, lastName)
	   * are already used in with another client in the database.
	   * @param String firstName, lastName
	   * @return Boolean saying if the we can create another client with those params
	   */
	@CrossOrigin
	@RequestMapping(value = "/checkClientAvailability", method = RequestMethod.GET)
	public Boolean checkClientAvailability(@RequestParam(value = "nom") String nom, @RequestParam(value = "prenom") String prenom) {
		if (clientRepository.findByNomPrenom(nom.toLowerCase().trim(), prenom.toLowerCase().trim()) != null)
			return false;
		return true;
	}
	
	/**
	   * This is a Put Method
	   * This method is used to modify a client
	   * in the database.
	   * @param Client Json : firstName, lastName, dayOfBirth, dayOfProc
	   * @return ResponseEntity with the object updated returned
	   */
	@CrossOrigin
	@PutMapping()
	public ResponseEntity<?> modifyClient(@RequestBody Client client) {

		Map<String, String> obj = new HashMap<String, String>();
		if (clientRepository.findById(client.getId()) == null) {
			obj.put("Error", "Client not found!");
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(obj);
		}
		
		if (client.getDateNaissance() == null || client.getClass() ==  null) {
			obj.put("Error", "Dates of birth and procedure can't be empty !");
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(obj);
		}
		
		JwtUserDetails connectedUser = (JwtUserDetails) SecurityContextHolder.getContext().getAuthentication()
				.getPrincipal();

		if (connectedUser.getRole().toString().equals("ROLE_ADMIN")) {
			clientRepository.updateClientById(client.getId(), client.getNom(), client.getPrenom(), client.getDateNaissance(), client.getDateProc()); 
			obj.put("Message", "Client updated!");
			return ResponseEntity.status(HttpStatus.ACCEPTED).body(obj);
		}
		obj.put("Error", "Unauthorized");
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(obj);
	}

	/**
	   * This is a Delete Method
	   * This method is used to delete a client
	   * It doesn't delete the client from database
	   * it only setAvailable on False
	   * @param Integer id of the client to delete
	   * @return ResponseEntity with the confirmation
	   * 	if the client is found and deleted or if the
	   * 	user trying to delete doesn't have the right to do it.
	   */
	@CrossOrigin
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteClient(@PathVariable("id") Integer id) {

		Map<String, String> obj = new HashMap<String, String>();

		if (!clientRepository.existsById(id)) {
			obj.put("Message", "Client not found !");
			return ResponseEntity.status(HttpStatus.OK).body(obj);
		}

		try {
			JwtUserDetails user = (JwtUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
			if (user.getRole().toString().equals("ROLE_ADMIN")) {
				Client client = clientRepository.getOneById(id);
				client.setAvailable(false);
				clientRepository.save(client);
				obj.put("Message", "Client deleted!");
				return ResponseEntity.status(HttpStatus.OK).body(obj);
			}
		} catch (Exception e) {
			obj.put("Error", e.getMessage());
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(obj);
		}
		obj.put("Error", "Unauthorized");
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(obj);
	}
	
	/**
	   * This is a Post Method
	   * This method is used to activate a deleted client
	   * it only setAvailable on True
	   * @param Integer id of the client to delete
	   * @return ResponseEntity with the confirmation
	   * 	if the client is found and activated or if the
	   * 	user trying to activate it doesn't have the right to do it.
	   */
	@CrossOrigin
	@PostMapping("/activate/{id}")
	public ResponseEntity<?> activateClient(@PathVariable("id") Integer id) {

		Map<String, String> obj = new HashMap<String, String>();

		if (!clientRepository.existsById(id)) {
			obj.put("Message", "Client not found !");
			return ResponseEntity.status(HttpStatus.OK).body(obj);
		}

		try {
			JwtUserDetails user = (JwtUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
			if (user.getRole().toString().equals("ROLE_ADMIN")) {
				Client client = clientRepository.getOneById(id);
				client.setAvailable(true);
				clientRepository.save(client);
				obj.put("Message", "Client activated !");
				return ResponseEntity.status(HttpStatus.OK).body(obj);
			}
		} catch (Exception e) {
			obj.put("Error", e.getMessage());
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(obj);
		}
		obj.put("Error", "Unauthorized");
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(obj);
	}
}
