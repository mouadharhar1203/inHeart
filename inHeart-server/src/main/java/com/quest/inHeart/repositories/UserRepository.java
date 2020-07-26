package com.quest.inHeart.repositories;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.quest.inHeart.model.User;
import com.quest.inHeart.model.User.UserRole;

/**
* inHEART application
* @author  HARHAR Mouâd
* 
* @version 1.0
* @since   26/08/2020 
*/
@Repository
public interface UserRepository extends CrudRepository<User, Integer> {

	@Query("SELECT t FROM User t WHERE t.username LIKE ?1")
	public User findByUsername(String name);
	
	@Query("SELECT t FROM User t WHERE t.email LIKE ?1")
	public User findByEmail(String email);
	
	@Query("SELECT t FROM User t WHERE t.id LIKE ?1")
	public User getOneById(Integer id);
	
	@Modifying
	@Transactional(readOnly=false)
	@Query("update User a set a.username = ?2, a.password = ?3, a.email = ?4, a.role = ?5 where a.id = ?1")
	public void updateUserById(@Param("id") Integer id, String username, String password, String email, UserRole role);
	
	@Modifying
	@Transactional(readOnly=false)
	@Query("update User a set a.username = ?2, a.email = ?3, a.role = ?4 where a.id = ?1")
	public void updateUserByIdWithouPassword(@Param("id") Integer id, String username, String email, UserRole role);

}
