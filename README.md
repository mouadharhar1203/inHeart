## Full Stack app with Spring Boot/Security, JWT, React JS, ReactStrap, mySQL and Docker



## Steps to Setup the Full Stack application with Docker :

  **Requirements**

	    Docker : download from https://www.docker.com/
	    A server or a virtual machine
	

1. **Clone the application inHeart**

	git clone https://github.com/mouadharhar1203/inHeart
	cd inHEART

2. **Docker Compose**

      ```bash
      docker-compose build
      docker-compose up
      ```


3. **Enjoy the application**

	+ http://localhost:9090/


## Steps to Setup the Full Stack application with Docker :

  **Requirements**

      JDK 11 - IDE (Eclipse, IntelliJ IDEA ...) for backend
      Node - IDE(Vistual Studio Code ...) for frontend
      mySQL database on your server
	
**Run the spring boot application**
	
	First go to the `inHeart-server` folder 
	
	You can run the spring boot app by typing the following command -

	mvn spring-boot:run

	The server will start on port 8090.

	You can also package the application in the form of a `jar` file and then run it like so -

	mvn package
	java -jar target/inHeart-server.jar

**Run the react application**

	First go to the `inHeart-client` folder -

	cd inHeart-client

	Then type the following command to install the dependencies and start the application -

	npm install && npm start

	The front-end server will start on port `3000`.
