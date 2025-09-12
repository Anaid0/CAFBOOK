export const Validators = {
    name: (name: string) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)?$/.test(name.trim()),
    email: (email: string) => /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email.trim()),
    password: (password: string) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,25}$/.test(password.trim()),
    description: (description: string) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.,;:()'"¡!¿?\-\s]{3,200}$/.test(description.trim()),
    street: (street: string) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,#-]{3,100}$/.test(street.trim()),
    vereda: (vereda: string) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,50}$/.test(vereda.trim()),
    postalCode: (postalCode: string) => /^[0-9]{4,10}$/.test(postalCode.trim()),
    numberTypeId: (numberTypeId: string) => /^[1-9][0-9]*$/.test(numberTypeId.trim()),
    phoneId: (phoneId: string) => /^[1-9][0-9]*$/.test(phoneId.trim()),
    companyId: (companyId: string) => /^[1-9][0-9]*$/.test(companyId.trim()),
  };