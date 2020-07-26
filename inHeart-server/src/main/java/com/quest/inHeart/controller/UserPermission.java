package com.quest.inHeart.controller;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.quest.inHeart.model.JwtUserDetails;

/**
* inHEART application
* @author  HARHAR Mouâd
* 
* @version 1.0
* @since   26/08/2020 
*/
@Service
public class UserPermission {

	/**
	   * This method is used to check if the user
	   * is sending a request about himself
	   * @return Boolean true is it's the same user.
	   */
	public boolean isSameUser(Integer id , Authentication authentication ) {
		JwtUserDetails details = (JwtUserDetails) authentication.getPrincipal(); 
		return 	details.isSameUser(id) ;
	}
}
