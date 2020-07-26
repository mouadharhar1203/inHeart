package com.quest.inHeart.mailing;
import com.quest.inHeart.model.User;

/**
* inHEART application
* @author  HARHAR Mouâd
* 
* @version 1.0
* @since   26/08/2020 
*/
public class Mailing {
	 
	/**
	   * This method sends a mail to each user 
	   * after sign up
	   */
	public static final String signupConfirmation(User user) {
		return "<h3>Sign Up Confirmation :</h3><br/>"
        		+"Hello " + "<b><i>" + user.getUsername() + "</b></i>" +".<br/><br/>"
        		+"Thank you for creating an account on our website SPREACT SHOP.<br/><br/><br/>"
        		+"<h4>Your informations : </h4>"
        		+"<h5>Your username : <i>" + user.getUsername() + "</i></h5>"
        		+"<h5>Your email : <i>" + user.getEmail() + "</i></h5>"
        		+"<h5>Sign Up Date : <i>" + user.getCreationDate() + "</i></h5>"
                +"<br/><img src='https://i.ibb.co/GThnPhy/logo.png'>";
	}

}
