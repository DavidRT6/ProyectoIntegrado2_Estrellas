import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Tus recursos de traducción
const resources = {
  en: {
    translation: {
        "SERVICIOS": "SERVICES",
        "Piscina exterior": "Pool",
        "Zona de masajes" : "Massages",
        " Piscina climatizada de gran capacidad abierta las 24 horas para que puedas relajarte en cualquier momento del día." : "Large capacity heated pool open 24 hours a day so you can relax at any time of the day.",
        "Cerrar": "Close",
        "Disponemos de masajistas con gran experiencia que te asegurarán una estancia tranquila y relajante." : "We have masseuses with great experience who will They will ensure a peaceful and relaxing stay.",
        "Para ver la informacion del perfil inicia sesión" : "To view profile information, log in",
        "Iniciar Sesión": "Log In",
        "Información Personal" : "Personal information",
        "Nombre Completo" : "Full name",
        "Correo electrónico": "E-mail",
        "Reservas Activas" : "Active Reserves",
        "No hay reservas disponibles" : "There are no reservations available",
        "Has iniciado sesión!" : "You are logged in!",
        "Error: La fecha de entrada no puede ser anterior a la fecha actual." : "Error: The entry date cannot be before the current date." ,
        "Error: La fecha de entrada no puede ser igual o mayor que la fecha de salida." : "Error: The check-in date cannot be equal to or greater than the check-out date.",
        "Error: La fecha de salida no puede ser anterior a la fecha actual.": "Error: The departure date cannot be earlier than the current date.",
        "La fecha de entrada es mayor que la fecha de salida." : "The check-in date is greater than the check-out date.",
        "No hay habitaciones disponibles para las fechas seleccionadas." : "There are no rooms available for the selected dates.",
        "RESERVA HABITACIONES" : "BOOK ROOMS",
        "Introduce fechas" : "Enter dates",
        "Fecha de entrada:" : "Entry date:",
        "Fecha de salida:" : "Departure date:",
        "Cantidad de personas" : "Amount of people",
        "Adultos" : "Adults",
        "Niños" : "Children",
        "APLICAR FILTROS" : "APPLY FILTERS",
        "HABITACIONES DISPONIBLES" : "AVAILABLE ROOMS",
        "Camas" : "Beds",
        "Personas" : "People",
        "Desde" : "From",
        "MÁS INFORMACIÓN" : "MORE INFORMATION",
        "Descripción": "Description",
        "Información" : "Information",
        "RESERVAR" : "BOOK",
        "Pago realizado": "Payment made",
        "¡Tu pago ha sido procesado correctamente!": "Your payment has been processed successfully!",
        "Pago realizado"  : "Payment not made",
        "Se ha producido un error al momento de pagar.": "An error occurred while paying.",
        "Realizar Pago" : "Make payment",
        "PAGAR": "PAY",
        "Cambiar idioma:": "Change language:",
        "Modo oscuro:": "Dark mode:",
        "Configuraciones": "Settings",
        "Zona común" : "Common zone",
        "Gimnasio":"Gym",
        "Comedor":"Lunch room",
        "Parque infantil": "Playground"
        

    }
  },
  es: {
    translation: {     
           "SERVICIOS": "SERVICIOS",
           "Piscina exterior" : "Piscina exterior",
           "Zona de masajes" : "Zona de masajes",
           " Piscina climatizada de gran capacidad abierta las 24 horas para que puedas relajarte en cualquier momento del día." :  " Piscina climatizada de gran capacidad abierta las 24 horas para que puedas relajarte en cualquier momento del día." ,
           "Cerrar" : "Cerrar",
           "Disponemos de masajistas con gran experiencia que te asegurarán una estancia tranquila y relajante." : "Disponemos de masajistas con gran experiencia que te asegurarán una estancia tranquila y relajante.",
           "Para ver la informacion del perfil inicia sesión" : "Para ver la informacion del perfil inicia sesión",
           "Iniciar Sesión" : "Iniciar Sesión",
           "Información Personal" : "Información Personal",
           "Nombre Completo" :"Nombre Completo" ,
           "Correo electrónico" : "Correo electrónico",
           "Reservas Activas" : "Reservas Activas",
           "No hay reservas disponibles" : "No hay reservas disponibles",
           "Has iniciado sesión!" : "Has iniciado sesión!" ,
           "Error: La fecha de entrada no puede ser anterior a la fecha actual." :  "Error: La fecha de entrada no puede ser anterior a la fecha actual." ,
           "Error: La fecha de entrada no puede ser igual o mayor que la fecha de salida." : "Error: La fecha de entrada no puede ser igual o mayor que la fecha de salida.",
           "Error: La fecha de salida no puede ser anterior a la fecha actual." : "Error: La fecha de salida no puede ser anterior a la fecha actual.",
          "translation:La fecha de entrada es mayor que la fecha de salida." : "translation:La fecha de entrada es mayor que la fecha de salida.",
          "No hay habitaciones disponibles para las fechas seleccionadas." : "No hay habitaciones disponibles para las fechas seleccionadas.",
          "RESERVA HABITACIONES" : "RESERVA HABITACIONES",
          "Introduce fechas":"Introduce fechas",
          "Fecha de entrada:" : "Fecha de entrada:",
          "Fecha de salida:" : "Fecha de salida:",
          "Cantidad de personas" : "Cantidad de personas",
          "Adultos" : "Adultos",
          "Niños": "Niños",
          "APLICAR FILTROS" : "APLICAR FILTROS",
          "HABITACIONES DISPONIBLES" : "HABITACIONES DISPONIBLES",
          "Camas": "Camas",
          "Personas" :"Personas",
          "Desde" : "Desde",
          "MÁS INFORMACIÓN" : "MÁS INFORMACIÓN",
          "Descripción" : "Descripción",
          "Información" : "Información",
          "RESERVAR" : "RESERVAR",
          "Pago realizado"  : "Pago realizado",
          "¡Tu pago ha sido procesado correctamente!": "¡Tu pago ha sido procesado correctamente!",
          "Pago no realizado"  : "Pago no realizado",
          "Se ha producido un error al momento de pagar.": "Se ha producido un error al momento de pagar.",
          "Realizar Pago" :  "Realizar Pago" ,
          "PAGAR": "PAGAR",
          "Cambiar idioma:":"Cambiar idioma:",
          "Modo oscuro:": "Modo oscuro:",
          "Configuraciones" : "Configuraciones",
          "Zona común":"Zona común",
          "Gimnasio":"Gimnasio",
          "Comedor":"Comedor",
          "Parque infantil":"Parque infantil"
    }
  },

};

console.log('Idioma local detectado:', Localization.locale);
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.locale,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;
