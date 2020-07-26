package com.quest.inHeart.repositories;

import java.util.Date;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.quest.inHeart.model.Client;

/**
* inHEART application
* @author  HARHAR Mouâd
* 
* @version 1.0
* @since   26/08/2020 
*/
@Repository
public interface ClientRepository extends CrudRepository<Client, Integer> {
	
	@Query("SELECT t FROM Client t WHERE t.id LIKE ?1")
	public Client getOneById(Integer id);
	
	@Query("SELECT t FROM Client t WHERE TRIM(LOWER(t.nom)) LIKE ?1 AND TRIM(LOWER(t.prenom)) LIKE ?2")
	public Client findByNomPrenom(String nom, String prenom);
	
	@Modifying
	@Transactional(readOnly=false)
	@Query("update Client a set a.nom = ?2, a.prenom = ?3, a.dateNaissance = ?4, a.dateProc = ?5 where a.id = ?1")
	public void updateClientById(@Param("id") Integer id, String nom, String prenom, Date dateNaissance, Date dateProc);

}
