package estrellas.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import estrellas.model.Users;

public interface UsersRepository extends MongoRepository<Users, String> {
	@Query("{'email': ?0, 'password': ?1 }")
	Optional<Users> findByUserAndPassword(String email, String password);

	Optional<Users> findTopByOrderByIdUserDesc();	

	@Query(value = "{'idUser': ?0}")
	List<Users> findById(Integer id);
	
	@Query(value = "{'email': ?0}")
	List<Users> findByEmail(String email);
}