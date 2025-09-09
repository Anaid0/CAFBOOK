export const Validators = {
    name: (name: string) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)?$/.test(name.trim()),
    email: (email: string) => /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email.trim()),
    password: (password: string) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,25}$/.test(password.trim()),
    description: (description: string) =>
        /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.,;:()'"¡!¿?\-\s]{10,200}$/.test(description.trim()),
  };