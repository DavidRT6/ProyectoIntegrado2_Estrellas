package estrellas.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import estrellas.model.Rooms;

public interface RoomsRepository extends MongoRepository<Rooms, String> {
	@Query(value = "{'idRoom': ?0}")
	List<Rooms> findById(Integer id);

	List<Rooms> findByPeopleNumber(Integer peopleNumber);
}