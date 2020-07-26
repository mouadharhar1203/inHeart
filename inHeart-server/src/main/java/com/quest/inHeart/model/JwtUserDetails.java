package com.quest.inHeart.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

/**
* inHEART application
* @author  HARHAR Mouâd
* 
* @version 1.0
* @since   26/08/2020 
*/
public class JwtUserDetails extends UserDetails
		implements org.springframework.security.core.userdetails.UserDetails, Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private User user;

	public JwtUserDetails(User user) {
		this.username = user.getUsername();
		this.role = user.getRole();
		this.user = user;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		List<SimpleGrantedAuthority> authorities = new ArrayList<SimpleGrantedAuthority>();
		authorities.add(new SimpleGrantedAuthority(role.toString()));
//		Collection<GrantedAuthority> authorities = new HashSet<GrantedAuthority>();
//      authorities.add(new SimpleGrantedAuthority(this.role.toString()));
		return authorities;
	}

	@Override
	public String getPassword() {
		return this.user.getPassword();
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}
	

	public boolean isSameUser(Integer id) {
		return id == user.getId() ;
	}
	
}
