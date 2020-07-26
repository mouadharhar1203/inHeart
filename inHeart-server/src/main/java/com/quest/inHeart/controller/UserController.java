package com.quest.inHeart.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.quest.inHeart.model.JwtUserDetails;
import com.quest.inHeart.model.User;
import com.quest.inHeart.repositories.UserRepository;

/**
* inHEART application
* @author  HARHAR Mouâd
* 
* @version 1.0
* @since   26/08/2020 
*/
@RestController
@RequestMapping(path = "/user")
public class UserController {
	
	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private UserRepository userRepository;

	/**
	   * This method is used to get the list of
	   * all the users in the data base.
	   * @param No params should be given to this method
	   * @return Iterable<User> a list of users
	   */
	@CrossOrigin
	@GetMapping("")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<?> getList() {
		return new ResponseEntity<>(userRepository.findAll(), HttpStatus.OK);
	}
	
	/**
	   * Get Method 
	   * This method is used to get a user by it's
	   * id, if the user is not found the function 
	   * returns an error message saying that.
	   * @param Integer id : the id of the user
	   * @return A ResponseEntity with the user if found
	   */
	@GetMapping("/{id}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<?> getOneById(@PathVariable("id") Integer id) {

		User user = userRepository.getOneById(id);
		Map<String, String> obj = new HashMap<String, String>();

		if (user == null) {
			obj.put("Error", "User not found !");
			return ResponseEntity.status(HttpStatus.CONFLICT).body(obj);
		}
		return new ResponseEntity<User>(user, HttpStatus.OK);
	}

	/**
	   * This is a Put Method
	   * This method is used to modify a user
	   * in the database.
	   * @param Client Json : username, password, role
	   * @return ResponseEntity with the object updated returned
	   */
	@CrossOrigin
	@PutMapping()
	public ResponseEntity<?> modifyUser(@RequestBody User user) {
		
		Map<String, String> obj = new HashMap<String, String>();
		if (userRepository.findById(user.getId()) == null) {
			obj.put("Error", "User not found!");
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(obj);
		}

		JwtUserDetails connectedUser = (JwtUserDetails) SecurityContextHolder.getContext().getAuthentication()
				.getPrincipal();

		if (connectedUser.getRole().toString().equals("ROLE_ADMIN")) {
			if(user.getPassword() == null) {
				userRepository.updateUserByIdWithouPassword(user.getId(), user.getUsername(), user.getEmail(), user.getRole());;
			} else {
				userRepository.updateUserById(user.getId(), user.getUsername(), passwordEncoder.encode(user.getPassword()), user.getEmail(), user.getRole());		
			}
			obj.put("Message", "User updated!");
			return ResponseEntity.status(HttpStatus.ACCEPTED).body(obj);
		}
		
		if (connectedUser.getUsername().equals(user.getUsername())) {
			if(user.getPassword()== "") {
				userRepository.updateUserByIdWithouPassword(user.getId(), user.getUsername(), user.getEmail(), connectedUser.getRole());;
			} else {
				userRepository.updateUserById(user.getId(), user.getUsername(), passwordEncoder.encode(user.getPassword()), user.getEmail(), connectedUser.getRole());		
			}
			obj.put("Message", "User updated!");
			return ResponseEntity.status(HttpStatus.ACCEPTED).body(obj);
		}
		obj.put("Error", "Unauthorized");
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(obj);
	}

	/**
	   * This is a Delete Method
	   * This method is used to delete a user
	   * It doesn't delete the user from database
	   * it only setAvailable on False
	   * @param Integer id of the user to delete
	   * @return ResponseEntity with the confirmation
	   * 	if the user is found and deleted or if the
	   * 	user trying to delete doesn't have the right to do it.
	   */
	@CrossOrigin
	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteUser(@PathVariable("id") Integer id) {

		Map<String, String> obj = new HashMap<String, String>();

		if (!userRepository.existsById(id)) {
			obj.put("Message", "User not found !");
			return ResponseEntity.status(HttpStatus.OK).body(obj);
		}

		try {
			JwtUserDetails user = (JwtUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
			String username = user.getUsername();
			if (username.equals(userRepository.getOneById(id).getUsername())
					|| user.getRole().toString().equals("ROLE_ADMIN")) {
				User connectedUser = userRepository.getOneById(id);
				connectedUser.setAvailable(false);
				userRepository.save(connectedUser);
				obj.put("Message", "User deleted!");
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
