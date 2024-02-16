package estrellas.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import estrellas.model.Bookings;

public interface BookingsRepository extends MongoRepository<Bookings, String> {
	@Query(value = "{'idUser': ?0}")
	List<Bookings> findRoomsByIdUser(Integer id);

	Optional<Bookings> findTopByOrderByIdRoomDesc();

	List<Bookings> findByEntranceDateLessThanAndExitDateGreaterThan(Date entranceDate, Date entranceDateParam);

}
