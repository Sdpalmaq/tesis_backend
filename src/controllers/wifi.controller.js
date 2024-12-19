// Simulación de base de datos en memoria
let wifiConfig = {
  ssid: "",
  password: "",
};

// Controlador para obtener configuración actual
export const getWifiConfig = (req, res) => {
  res.json({
    status: "success",
    message: "Configuración actual.",
    data: wifiConfig,
  });
};

// Controlador para guardar configuración Wi-Fi
export const saveWifiConfig = (req, res) => {
  const { ssid, password } = req.body;

  // Validar datos recibidos
  if (!ssid || !password) {
    return res.status(400).json({
      status: "error",
      message: "Por favor, proporciona SSID y contraseña.",
    });
  }

  // Guardar configuración
  wifiConfig.ssid = ssid;
  wifiConfig.password = password;

  console.log("Nueva configuración Wi-Fi recibida:");
  console.log(`SSID: ${ssid}, Password: ${password}`);

  res.status(200).json({
    status: "success",
    message: "Configuración Wi-Fi guardada correctamente.",
    data: wifiConfig,
  });
};
