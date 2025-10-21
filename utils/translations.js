// Backend translations for SDP Server API responses

const translations = {
  en: {
    // Authentication messages
    userLoggedIn: "User logged in successfully",
    userNotFound: "User Doesn't Exist!",
    invalidCredentials: "Email and Password do not match",
    loginRequired: "Email and Password Both are Required",

    // Patient messages
    patientCreated: "Patient created successfully",
    patientUpdated: "Patient Updated successfully",
    patientDeleted: "Patient Deleted successfully",
    errorCreatingPatient: "error creating patient",
    errorUpdatingPatient: "error updating patient",
    errorDeletingPatient: "error deleting patient",
    errorGettingPatient: "Error getting patient",
    patientGetSuccessful: "patient get successfully",

    // Common messages
    success: "Success",
    error: "Error",
    badRequest: "Bad Request",
    internalServerError: "Internal server error",
    notAuthorized: "Not authorized",
    databaseError: "Database temporarily unavailable - please try again in a few moments",
  },

  kn: {
    // Authentication messages (Kannada)
    userLoggedIn: "ಬಳಕೆದಾರರು ಯಶಸ್ವಿಯಾಗಿ ಲಾಗಿನ್ ಆಗಿದ್ದಾರೆ",
    userNotFound: "ಬಳಕೆದಾರರು ಅಸ್ತಿತ್ವದಲ್ಲಿಲ್ಲ!",
    invalidCredentials: "ಇಮೇಲ್ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ಹೊಂದಾಣಿಕೆಯಾಗುತ್ತಿಲ್ಲ",
    loginRequired: "ಇಮೇಲ್ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ಎರಡೂ ಅಗತ್ಯವಿದೆ",

    // Patient messages (Kannada)
    patientCreated: "ರೋಗಿ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ",
    patientUpdated: "ರೋಗಿ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ",
    patientDeleted: "ರೋಗಿ ಯಶಸ್ವಿಯಾಗಿ ಅಳಿಸಲಾಗಿದೆ",
    errorCreatingPatient: "ರೋಗಿ ರಚನೆಯಲ್ಲಿ ದೋಷ",
    errorUpdatingPatient: "ರೋಗಿ ನವೀಕರಣದಲ್ಲಿ ದೋಷ",
    errorDeletingPatient: "ರೋಗಿ ಅಳಿಸುವಿಕೆಯಲ್ಲಿ ದೋಷ",
    errorGettingPatient: "ರೋಗಿ ಪಡೆಯುವಲ್ಲಿ ದೋಷ",
    patientGetSuccessful: "ರೋಗಿ ಯಶಸ್ವಿಯಾಗಿ ಪಡೆಯಲಾಗಿದೆ",

    // Common messages (Kannada)
    success: "ಯಶಸ್ಸು",
    error: "ದೋಷ",
    badRequest: "ಕೆಟ್ಟ ವಿನಂತಿ",
    internalServerError: "ಆಂತರಿಕ ಸರ್ವರ್ ದೋಷ",
    notAuthorized: "ಅಧಿಕೃತವಲ್ಲ",
    databaseError: "ಡೇಟಾಬೇಸ್ ತಾತ್ಕಾಲಿಕವಾಗಿ ಲಭ್ಯವಿಲ್ಲ - ದಯವಿಟ್ಟು ಕೆಲವು ಕ್ಷಣಗಳ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
  }
};

// Translation helper function for backend
export const translate = (key, language = 'en') => {
  return translations[language]?.[key] || translations.en[key] || key;
};

// Get language from request headers or default to English
export const getLanguageFromRequest = (req) => {
  const acceptLanguage = req.headers['accept-language'];
  const preferredLanguage = req.headers['x-preferred-language'];

  if (preferredLanguage && translations[preferredLanguage]) {
    return preferredLanguage;
  }

  if (acceptLanguage) {
    const lang = acceptLanguage.split(',')[0].split('-')[0];
    if (translations[lang]) {
      return lang;
    }
  }

  return 'en';
};

export default translations;