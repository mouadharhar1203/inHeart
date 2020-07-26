package com.quest.inHeart.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.quest.inHeart.config.JwtTokenUtil;
import com.quest.inHeart.config.JwtUserDetailsService;
import com.quest.inHeart.model.User;
import com.quest.inHeart.model.UserDetails;
import com.quest.inHeart.repositories.UserRepository;
import com.quest.inHeart.request.JwtRequest;
import com.quest.inHeart.response.JwtResponse;

/**
* inHEART application
* @author  HARHAR Mouâd
* 
* @version 1.0
* @since   26/08/2020 
*/
@RestController
public class AuthenticationController {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	private JwtUserDetailsService jwtUserDetailsService;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@CrossOrigin
	@PostMapping("/register")
	public ResponseEntity<?> createUser(@RequestBody User user) {
		
		if (userRepository.findByUsername(user.getUsername()) != null) {
			Map<String, String> obj = new HashMap<String, String>();
			obj.put("Error", "Username already used");
			return ResponseEntity.status(HttpStatus.CONFLICT).body(obj);
		}

		User finalUser = new User(user.getUsername(), passwordEncoder.encode(user.getPassword()), user.getEmail());
		userRepository.save(finalUser);

//		try {
//			MimeMessage message = emailSender.createMimeMessage();
//			MimeMessageHelper helper = new MimeMessageHelper(message, true, "utf-8");
//			message.setContent(Mailing.signupConfirmation(finalUser), "text/html");
//			helper.setTo(user.getEmail());
//			helper.setSubject("Sign Up Confirmation Mail");
//
//			this.emailSender.send(message);
//
//		} catch (MessagingException e) {
//			throw new RuntimeException(e);
//		}

		return new ResponseEntity<UserDetails>(new UserDetails(finalUser.getUsername(), finalUser.getRole()),
				HttpStatus.CREATED);
	}

	@CrossOrigin
	@RequestMapping(value = "/authenticate", method = RequestMethod.POST)
	public ResponseEntity<?> createAuthenticationToken(@RequestBody JwtRequest authenticationRequest) throws Exception {
		try {
			if (!userRepository.findByUsername(authenticationRequest.getUsername()).isAvailable()) {
				Map<String, String> obj = new HashMap<String, String>();
				obj.put("Message", "Username deleted");
				return ResponseEntity.status(HttpStatus.OK).body(obj);
			}
		} catch (Exception e) {
			throw new RuntimeException(e);
		}

		final Authentication authentication = authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(authenticationRequest.getUsername(),
						authenticationRequest.getPassword()));
		SecurityContextHolder.getContext().setAuthentication(authentication);

		final String token = jwtTokenUtil
				.generateToken(jwtUserDetailsService.loadUserByUsername(authenticationRequest.getUsername()));

		return ResponseEntity.ok(new JwtResponse(token));
	}

	@CrossOrigin
	@RequestMapping(value = "/checkUsernameAvailability", method = RequestMethod.GET)
	public Boolean checkUsernameAvailability(@RequestParam(value = "username") String username) {
		if (userRepository.findByUsername(username) != null)
			return false;
		return true;
	}

	@CrossOrigin
	@RequestMapping(value = "/checkEmailAvailability", method = RequestMethod.GET)
	public Boolean checkEmailAvailability(@RequestParam(value = "email") String email) {
		if (userRepository.findByEmail(email) != null)
			return false;
		return true;
	}

	@CrossOrigin
	@RequestMapping(value = "/me", method = RequestMethod.GET)
	@ResponseBody
	public User me(Authentication authentication) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (!(auth instanceof AnonymousAuthenticationToken)) {
			return userRepository.findByUsername(
					((org.springframework.security.core.userdetails.UserDetails) auth.getPrincipal()).getUsername());
		}
		return null;
	}
}
