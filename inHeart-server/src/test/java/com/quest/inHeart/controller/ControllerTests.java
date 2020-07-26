package com.quest.inHeart.controller;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quest.inHeart.config.JwtTokenUtil;
import com.quest.inHeart.model.JwtUserDetails;
import com.quest.inHeart.model.User;
import com.quest.inHeart.model.User.UserRole;
import com.quest.inHeart.repositories.UserRepository;

/**
* inHEART application
* @author  HARHAR Mouâd
* 
* @version 1.0
* @since   26/08/2020 
*/
@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class ControllerTests {
	
	private static String token = "";

	@Autowired
	protected MockMvc mockmvc;
	
	@Autowired
	private JwtTokenUtil jwtTokenUtil;
	
	@Autowired
	private UserRepository userRepository;

	@Test
	public void testAuthenticate() throws Exception {
		
		User user = new User("usernameTest", "passwordTest", "emailTeqst");
		
		// La route /register répond bien en 201
		mockmvc.perform(MockMvcRequestBuilders.post("/register")
				.content(asJsonString(user))
				.contentType(MediaType.APPLICATION_JSON).accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isCreated());
		
		// register avec les mêmes paramètres répond 500 car l’utilisateur existe déjà.
		mockmvc.perform(MockMvcRequestBuilders.post("/register")
				.content(asJsonString(user))
				.contentType(MediaType.APPLICATION_JSON).accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isConflict());
		
		// La route /authenticate renvoie un statut 200 et retourne bien notre token
		mockmvc.perform(MockMvcRequestBuilders.post("/authenticate")
				.content(asJsonString(user))
				.contentType(MediaType.APPLICATION_JSON).accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(MockMvcResultMatchers.jsonPath("$.token").exists());
		
		JwtUserDetails jwtUserDetails = new JwtUserDetails(user);
		token = jwtTokenUtil.generateToken(jwtUserDetails);
		
		// La route /me retourne un statut 200 avec les informations de l’utilisateur
		mockmvc.perform(MockMvcRequestBuilders.get("/me")
				.header("Authorization", "Bearer " + token)
	            .accept(MediaType.APPLICATION_JSON))
	            .andExpect(status().isOk())
	            .andExpect(MockMvcResultMatchers.jsonPath("$.username").value(user.getUsername()))
	            .andReturn();
	}
	
	@Test
	public void testUser() throws Exception {
		
		User userTest = new User("userTest", "userTest", "emailTest");
		userRepository.save(userTest);
		JwtUserDetails jwtUserDetails = new JwtUserDetails(userTest);
		token = jwtTokenUtil.generateToken(jwtUserDetails);
		
		// La route /user retourne bien un statut 401 sans Token Bearer
		mockmvc.perform(MockMvcRequestBuilders.get("/user")
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isUnauthorized());

		
		// La route /user retourne bien un statut 200 avec Token Bearer valide
		mockmvc.perform(MockMvcRequestBuilders.get("/user")
				.header("Authorization", "Bearer " + token)
			    .accept(MediaType.APPLICATION_JSON))
	            .andExpect(status().isOk());
		
		User userToDelete = new User("userToDelete", "userToDelete", "userToDelete");
		userRepository.save(userToDelete);
		
		// ROLE_USER : la suppression retourne un statut 401
		mockmvc.perform(MockMvcRequestBuilders.delete("/user/{id}", userToDelete.getId())
				.header("Authorization", "Bearer " + token)
			    .accept(MediaType.APPLICATION_JSON))
	            .andExpect(status().isUnauthorized());
		
		User userAdmin = new User("userAdmin", "userAdmin", "userAdmin");
		userAdmin.setRole(UserRole.ROLE_ADMIN);
		userRepository.save(userAdmin);
		jwtUserDetails = new JwtUserDetails(userAdmin);
		token = jwtTokenUtil.generateToken(jwtUserDetails);
		
		// ROLE_ADMIN : la suppression retourne bien un statut 200.
		mockmvc.perform(MockMvcRequestBuilders.delete("/user/{id}", userToDelete.getId())
				.header("Authorization", "Bearer " + token)
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk());
	}
	
	public static String asJsonString(final Object obj) {
			try {
				return new ObjectMapper().writeValueAsString(obj);
			} catch (Exception e) {
				throw new RuntimeException(e);
			}
	}
	
}
