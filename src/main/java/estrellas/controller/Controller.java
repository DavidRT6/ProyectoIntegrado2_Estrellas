package estrellas.controller;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.Properties;
import java.util.Random;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import estrellas.model.Bookings;
import estrellas.model.Rooms;
import estrellas.model.Users;
import estrellas.repository.BookingsRepository;
import estrellas.repository.RoomsRepository;
import estrellas.repository.UsersRepository;

@RestController
public class Controller {
	@Autowired
	private UsersRepository usersRepository;
	@Autowired
	private RoomsRepository roomsRepository;
	@Autowired
	private BookingsRepository bookingsRepository;

	/**
	 * Mètode per a registrar un usuari que mapeja la URL "/ESTRELLAS/register" a
	 * aquest mètode del controlador que maneja les sol·licituds POST.
	 *
	 * @param newUser S'espera un objecte JSON 'Users' en el cos de la sol·licitud,
	 *                que es registra a la base de dades a través de
	 *                'usersRepository.save(newUser)'.
	 * @return Retorna una resposta amb codi d'estat '204 No Content' si el registre
	 *         és exitós, en cas contrari, retorna un error intern del servidor.
	 */
	@PostMapping("ESTRELLAS/register")
	ResponseEntity<Object> register(@RequestBody Users newUser) {
		try {
			newUser.setIdUser(getNextUserId());
			usersRepository.save(newUser);
			return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}

	/**
	 * Métode per a iniciar sessió que mapeja la URL "/ESTRELLAS/login" a aquest
	 * mètode del controlador que maneja les sol·licituds POST.
	 * 
	 * @param user S'espera un objecte JSON 'Users' en el cos de la sol·licitud, que
	 *             s'utilitza per buscar a la base de dades si existeix un usuari
	 *             amb el correu electrònic i la contrasenya proporcionats.
	 * @return Si l'usuari està autoritzat, retorna un codi d'estat '202 Accepted'
	 *         amb l'ID de l'usuari en format JSON, en cas contrari, retorna un codi
	 *         d'estat '401 Unauthorized'.
	 */
	@PostMapping("/ESTRELLAS/login")
	ResponseEntity<Object> login(@RequestBody Users user) {
		try {
			Optional<Users> authorized = usersRepository.findByUserAndPassword(user.getEmail(), user.getPassword());
			List<Users> userInfo = usersRepository.findByEmail(user.getEmail());

			String idUser = "{\n\t\"id\": ";
			idUser += userInfo.get(0).getIdUser();
			idUser += "\n}";

			if (authorized.isPresent()) {
				return ResponseEntity.status(HttpStatus.ACCEPTED).body(String.valueOf(idUser));
			} else {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
			}
		} catch (Exception e) {
//			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}

	/**
	 * Mètode per a buscar la informació d´un usuari que mapeja la URL
	 * "/ESTRELLAS/userInformation" a aquest mètode del controlador que maneja les
	 * sol·licituds GET.
	 * 
	 * @param userId S'espera el paràmetre 'id' a la URL que especifica l'ID de
	 *               l'usuari del qual es vol obtenir la informació.
	 * @return Retorna la informació de l'usuari en format JSON si es troba a la
	 *         base de dades, en cas contrari, retorna un error '404 Not Found'.
	 */
	@GetMapping("/ESTRELLAS/userInformation")
	ResponseEntity<Object> userInformation(@RequestParam(value = "id") String userId) {
		try {
			List<Users> user = usersRepository.findById(Integer.parseInt(userId));
			if (!user.isEmpty()) {
				String name = user.get(0).getName();
				String surname = user.get(0).getSurname();
				String email = user.get(0).getEmail();
				String userJson = "{";
				userJson += "\n\t\"name\": \"" + name + "\",";
				userJson += "\n\t\"surname\": \"" + surname + "\",";
				userJson += "\n\t\"email\": \"" + email + "\"";
				userJson += "\n}";
				return ResponseEntity.ok(userJson);
			} else {
				return ResponseEntity.notFound().header("Content-Length", "0").build();
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}

	/**
	 * Mètode per a buscar informació d´una habitació que mapeja la URL
	 * "/ESTRELLAS/roomInformation" a aquest mètode del controlador que maneja les
	 * sol·licituds GET.
	 * 
	 * @param roomId S'espera el paràmetre 'id' a la URL que especifica l'ID de
	 *               l'habitació de la qual es vol obtenir la informació.
	 * @return Retorna la informació de l'habitació en format JSON si es troba a la
	 *         base de dades, en cas contrari, retorna un error '404 Not Found'.
	 */
	@GetMapping("/ESTRELLAS/roomInformation")
	ResponseEntity<Object> roomInformation(@RequestParam(value = "id") String roomId) {
		try {
			boolean isFirstImage = true;
			List<Rooms> room = roomsRepository.findById(Integer.parseInt(roomId));
			if (!room.isEmpty()) {
				int idRoom = room.get(0).getIdRoom();
				int peopleNumber = room.get(0).getPeopleNumber();
				String title = room.get(0).getTitle();
				String description = room.get(0).getDescription();
				Double price = room.get(0).getPrice();
				Integer beds = room.get(0).getBeds();
				Integer m2 = room.get(0).getM2();
				String[] images = room.get(0).getImages();
				String roomJson = "{";
				roomJson += "\n\t\"idRoom\": \"" + idRoom + "\",";
				roomJson += "\n\t\"title\": \"" + title + "\",";
				roomJson += "\n\t\"description\": \"" + description + "\",";
				roomJson += "\n\t\"peopleNumber\": \"" + peopleNumber + "\",";
				roomJson += "\n\t\"price\": \"" + price + "\",";
				roomJson += "\n\t\"beds\": \"" + beds + "\",";
				roomJson += "\n\t\"m2\": \"" + m2 + "\",";
				roomJson += "\n\t\"images\": [\n";
				for (String image : images) {
					if (!isFirstImage) {
						roomJson += ",\n";
					} else {
						isFirstImage = false;
					}
					roomJson += "\t\"" + image + "\"";
				}
				roomJson += "\n\t]";
				roomJson += "\n}";
				return ResponseEntity.ok(roomJson);
			} else {
				return ResponseEntity.notFound().header("Content-Length", "0").build();
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}

	/**
	 * Mètode que mapeja la URL "/ESTRELLAS/filterRooms" a aquest mètode del
	 * controlador que maneja les sol·licituds GET.
	 * 
	 * @param entranceDate Data d´entrada
	 * @param exitDate     Data d´eixida
	 * @param peopleNumber Número de persones de la reserva
	 * @return Retorna una llista d'habitacions disponibles que compleixen els
	 *         criteris de data i nombre de persones especificats
	 */

	@GetMapping("/ESTRELLAS/filterRooms")
	ResponseEntity<String> filterRooms(
			@RequestParam(value = "entranceDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date entranceDate,
			@RequestParam(value = "exitDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date exitDate,
			@RequestParam(value = "peopleNumber") Integer peopleNumber) {

		if (entranceDate.after(exitDate)) {
			return ResponseEntity.badRequest().body("Error");
		}
		try {
			List<Rooms> filteredRooms = new ArrayList<>();
			List<Bookings> filteredBookings = new ArrayList<>();
			// Filtrar parametro fecha de entrada. Si esta entre las fechas indicadas la
			// fecha de entrada.
			List<Bookings> filteredEntranceBookings = bookingsRepository
					.findByEntranceDateLessThanAndExitDateGreaterThan(entranceDate, entranceDate);
			// Filtrar por fecha de salida. Si esta entre las fechas indicadas la fecha de
			// salida.
			List<Bookings> filteredExitBookings = bookingsRepository
					.findByEntranceDateLessThanAndExitDateGreaterThan(exitDate, exitDate);
			filteredBookings.addAll(filteredEntranceBookings);
			filteredBookings.addAll(filteredExitBookings);
			// Filtrar por número de personas
			filteredRooms = roomsRepository.findByPeopleNumber(peopleNumber);

			Iterator<Rooms> iterator = filteredRooms.iterator();
			while (iterator.hasNext()) {
				Rooms room = iterator.next();
				for (Bookings book : filteredBookings) {
					if (book.getIdRoom() == room.getIdRoom()) {
						iterator.remove();
						break;
					}
				}
			}
			String jsonFinally = "[";
			boolean isFirstRoom = true;

			if (!filteredRooms.isEmpty()) {
				for (Rooms room : filteredRooms) {
					String title = room.getTitle();
					String description = room.getDescription();
					int peopleNum = room.getPeopleNumber();
					int idRoom = room.getIdRoom();
					Double price = room.getPrice();
					Integer beds = room.getBeds();
					Integer m2 = room.getM2();
					String[] images = room.getImages();
					if (!isFirstRoom) {
						jsonFinally += ",";
					} else {
						isFirstRoom = false;
					}
					jsonFinally += "{";
					jsonFinally += "\"idRoom\":" + idRoom + ",";
					jsonFinally += "\"title\": \"" + title + "\",";
					jsonFinally += "\"description\": \"" + description + "\",";
					jsonFinally += "\"peopleNumber\":" + peopleNum + ",";
					jsonFinally += "\"price\":" + price + ",";
					jsonFinally += "\"beds\":" + beds + ",";
					jsonFinally += "\"m2\":" + m2 + ",";
					jsonFinally += "\"images\": [";
					boolean isFirstImage = true;
					for (String image : images) {
						if (!isFirstImage) {
							jsonFinally += ",";
						} else {
							isFirstImage = false;
						}
						jsonFinally += "\"" + image + "\"";
					}

					jsonFinally += "]";
					jsonFinally += "}";
				}
				jsonFinally += "]";
				if (!isFirstRoom) {
					System.out.println(jsonFinally);
					return ResponseEntity.ok(jsonFinally.toString());
				} else {
					return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
				}
			} else {
				return ResponseEntity.notFound().header("Content-Length", "0").build();
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}

	/**
	 * Mètode per a guardar una reserva nova que mapeja la URL "/ESTRELLAS/bookRoom"
	 * a aquest mètode del controlador que maneja les sol·licituds POST.
	 * 
	 * @param newBook Habitació que anem a reservar
	 * @return S'espera un objecte JSON 'Bookings' en el cos de la sol·licitud, que
	 *         es guarda a la base de dades a través de
	 *         'bookingsRepository.save(newBook)'.
	 */
	@PostMapping("ESTRELLAS/bookRoom")
	ResponseEntity<Object> bookRoom(@RequestBody Bookings newBook) {
		try {
			newBook.setIdBook(getNextBookId());
			bookingsRepository.save(newBook);
			return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}

	/**
	 * Mètode per a mostrar habitacions reservades per un usuari que mapeja la URL
	 * "/ESTRELLAS/userBookedRooms" a aquest mètode del controlador // que maneja
	 * les sol·licituds GET.
	 * 
	 * @param userId Paràmetre 'id' a la URL que especifica l'ID de l'usuari del
	 *               qual es desitgen obtenir les habitacions reservades.
	 * @return Llista d'habitacions reservades per l'usuari en format JSON.
	 */
	@GetMapping("/ESTRELLAS/userBookedRooms")
	ResponseEntity<Object> userBookedRooms(@RequestParam(value = "id") String userId) {
		try {
			boolean isFirstImage = true;
			List<Bookings> userBookings = bookingsRepository.findRoomsByIdUser(Integer.parseInt(userId));
			if (!userBookings.isEmpty()) {
				Integer idRoom;
				Date entranceDate;
				Date exitDate;
				List<Integer> bookedIdRooms = new ArrayList<Integer>();
				List<Date> bookedDatesRooms = new ArrayList<Date>();
				for (int i = 0; i < userBookings.size(); i++) {
					idRoom = userBookings.get(i).getIdRoom();
					entranceDate = userBookings.get(i).getEntranceDate();
					exitDate = userBookings.get(i).getExitDate();
					bookedIdRooms.add(idRoom);
					bookedDatesRooms.add(entranceDate);
					bookedDatesRooms.add(exitDate);
				}
				List<Rooms> bookedRooms;
				String userBookedRoomsJson = "[";
				for (int i = 0; i < bookedIdRooms.size(); i++) {
					bookedRooms = roomsRepository.findById(bookedIdRooms.get(i));
					idRoom = bookedRooms.get(0).getIdRoom();
					String title = bookedRooms.get(0).getTitle();
					String description = bookedRooms.get(0).getDescription();
					Integer peopleNumber = bookedRooms.get(0).getPeopleNumber();
					Double price = bookedRooms.get(0).getPrice();
					String[] images = bookedRooms.get(0).getImages();
					entranceDate = bookedDatesRooms.get(i);
					exitDate = bookedDatesRooms.get(i + 1);
					userBookedRoomsJson += "\n\t{";
					userBookedRoomsJson += "\n\t\t\"idRoom\": \"" + idRoom + "\",";
					userBookedRoomsJson += "\n\t\t\"title\": \"" + title + "\",";
					userBookedRoomsJson += "\n\t\t\"description\": \"" + description + "\",";
					userBookedRoomsJson += "\n\t\t\"peopleNumber\": \"" + peopleNumber + "\",";
					userBookedRoomsJson += "\n\t\t\"price\": \"" + price + "\",";
					userBookedRoomsJson += "\n\t\"images\": [\n";
					for (String image : images) {
						if (!isFirstImage) {
							userBookedRoomsJson += ",\n";
						} else {
							isFirstImage = false;
						}
						userBookedRoomsJson += "\t\"" + image + "\"";
					}
					userBookedRoomsJson += "\n\t],";
					userBookedRoomsJson += "\n\t\t\"entranceDate\": \"" + entranceDate + "\",";
					userBookedRoomsJson += "\n\t\t\"exitDate\": \"" + exitDate + "\"";
					userBookedRoomsJson += "\n\t},";
					isFirstImage = true;
				}
				userBookedRoomsJson = userBookedRoomsJson.substring(0, userBookedRoomsJson.length() - 1);
				userBookedRoomsJson += "\n]";
				return ResponseEntity.ok(userBookedRoomsJson);
			} else {
				return ResponseEntity.notFound().header("Content-Length", "0").build();
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}

	/**
	 * S'utilitza per obtenir l'usuari amb la ID d'usuari màxima, i orElse(0)
	 * s'utilitza per manejar el cas en què no hi hagi usuaris a la base de dades.
	 * 
	 * @return El següent ID d'usuari disponible.
	 */

	private int getNextUserId() {
		Integer maxUserId = usersRepository.findTopByOrderByIdUserDesc().map(Users::getIdUser).orElse(0);
		return maxUserId + 1;
	}

	/**
	 * Obté el següent ID de reserva disponible. Es basa en l'ID de reserva més alt
	 * trobat a la base de dades.
	 *
	 * @return El següent ID de reserva disponible.
	 */
	private int getNextBookId() {
		Integer maxBookId = bookingsRepository.findTopByOrderByIdRoomDesc().map(Bookings::getIdBook).orElse(0);
		return maxBookId + 1;
	}

	/**
	 * Gestiona la confirmació de correu electrònic mitjançant una sol·licitud POST.
	 * Cerca el correu electrònic proporcionat a la base de dades i, si existeix,
	 * envia un codi de confirmació per correu electrònic.
	 *
	 * @param email_desti El correu electrònic proporcionat per a la confirmació.
	 * @return ResponseEntity amb el codi de confirmació si el correu existeix,
	 *         ResponseEntity not found si el correu no existeix, ResponseEntity amb
	 *         error intern del servidor si hi ha un problema en el processament.
	 */
	@PostMapping("/ESTRELLAS/emailConfirmation")
	ResponseEntity<String> handleEmailConfirmation(@RequestBody String email_desti) {
		try {
			List<Users> confirmEmail = usersRepository.findByEmail(email_desti);
			if (!confirmEmail.isEmpty()) {
				String code = envieMail(email_desti);
				return ResponseEntity.ok(code);
			} else {
				return ResponseEntity.notFound().header("Content-Length", "0").build();
			}
		} catch (UnsupportedEncodingException | MessagingException e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}

	/**
	 * Gestiona la confirmació de correu electrònic en el procés de registre
	 * mitjançant una sol·licitud POST. Cerca el correu electrònic proporcionat a la
	 * base de dades i, si no existeix, envia un codi de confirmació per correu
	 * electrònic.
	 *
	 * @param email_desti El correu electrònic proporcionat per a la confirmació del
	 *                    registre.
	 * @return ResponseEntity amb el codi de confirmació si el correu no existeix,
	 *         ResponseEntity not found si el correu ja existeix, ResponseEntity amb
	 *         error intern del servidor si hi ha un problema en el processament.
	 */
	@PostMapping("/ESTRELLAS/emailConfirmationSignUp")
	ResponseEntity<String> handleEmailConfirmationSignUp(@RequestBody String email_desti) {
		try {
			List<Users> confirmEmail = usersRepository.findByEmail(email_desti);
			if (confirmEmail.isEmpty()) {
				String code = envieMail(email_desti);
				return ResponseEntity.ok(code);
			} else {
				return ResponseEntity.notFound().header("Content-Length", "0").build();
			}
		} catch (UnsupportedEncodingException | MessagingException e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}

	/**
	 * Actualitza la contrasenya de l'usuari mitjançant una sol·licitud PUT.
	 *
	 * @param user Les dades de l'usuari que contenen el correu electrònic i la nova
	 *             contrasenya.
	 * @return ResponseEntity sense contingut si l'usuari existeix i la contrasenya
	 *         s'actualitza correctament, ResponseEntity not found si l'usuari no
	 *         existeix, ResponseEntity amb error intern del servidor si hi ha un
	 *         problema en el processament.
	 */
	@PutMapping("ESTRELLAS/updatePassword")
	ResponseEntity<Object> updatePassword(@RequestBody Users user) {
		try {
			List<Users> userOptional = usersRepository.findByEmail(user.getEmail());
			if (!userOptional.isEmpty()) {
				Users userUp = userOptional.get(0);
				userUp.setPassword(user.getPassword());
				usersRepository.save(userUp);
				return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
			} else {
				return ResponseEntity.notFound().build();
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}

	/**
	 * Genera un codi aleatori per a la confirmació del correu electrònic amb el
	 * següent format: LNNNLNNN, on L és una lletra aleatòria i N són dígits
	 * aleatoris.
	 *
	 * @return Codi generat aleatòriament.
	 */
	public static String generateCode() {
		String letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		char randomLetter = letters.charAt(new Random().nextInt(letters.length()));
		int randomNum1 = 100 + new Random().nextInt(900);
		int randomNum2 = 100 + new Random().nextInt(900);
		String code = randomLetter + String.valueOf(randomNum1) + randomLetter + String.valueOf(randomNum2);
		return code;
	}

	/**
	 * Envia un correu electrònic amb un codi de verificació generat aleatòriament.
	 *
	 * @param email_desti L'adreça de correu electrònic de destinació.
	 * @return Codi de verificació generat.
	 * @throws UnsupportedEncodingException Si es produeix un error d'encodificació
	 *                                      no compatible.
	 * @throws MessagingException           Si es produeix un error en el procés de
	 *                                      missatgeria.
	 */
	public static String envieMail(String email_desti) throws UnsupportedEncodingException, MessagingException {
		String code = generateCode();
		String missatge = "Hola " + email_desti + "! \nTu código de verificación es: " + code;
		String host_email = "SMTP.GMAIL.COM";
		String port_email = "587";
		String assumpte = "Confirmación de correo";
		String email_remitent = "cuatroestrellassoporte@gmail.com";
		String email_remitent_pass = "ewrz favf zipx dpwq";

		Properties props = System.getProperties();
		props.put("mail.smtp.host", host_email);
		props.put("mail.smtp.user", email_remitent);
		props.put("mail.smtp.clave", email_remitent_pass);
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.smtp.port", port_email);
		Session session = Session.getDefaultInstance(props);
		MimeMessage message = new MimeMessage(session);
		message.setFrom(new InternetAddress(email_remitent));
		message.addRecipients(Message.RecipientType.TO, email_desti);
		message.setSubject(assumpte);
		Multipart multipart = new MimeMultipart();
		BodyPart messageBodyPart1 = new MimeBodyPart();
		messageBodyPart1.setText(missatge);
		multipart.addBodyPart(messageBodyPart1);
		message.setContent(multipart);
		Transport transport = session.getTransport("smtp");
		transport.connect(host_email, email_remitent, email_remitent_pass);
		transport.sendMessage(message, message.getAllRecipients());
		transport.close();
		return code;
	}
}
