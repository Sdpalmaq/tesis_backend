import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // Usamos Gmail
  auth: {
    user: "pruebaiselcon@gmail.com", // Reemplaza con tu correo
    pass: "ljfj olqz qtjl qgxt", // Reemplaza con la contraseña de aplicación generada
  },
});

export const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: "pruebaiselcon@gmail.com", // Remitente
      to, // Destinatario
      subject, // Asunto
      text, // Contenido del correo
    });
    console.log("Correo enviado con éxito");
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error("No se pudo enviar el correo");
  }
};

export default transporter;
