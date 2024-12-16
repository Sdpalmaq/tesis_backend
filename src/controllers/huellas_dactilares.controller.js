import HuellaDactilar from "../models/huellas_dactilares.model.js";

export const createHuella = async (req, res) => {
  try {
    const huella = await HuellaDactilar.create(req.body);
    res.status(201).json(huella);
  } catch (error) {
    if (error.constraint === "huellas_dactilares_usuario_cedula_key") {
      return res
        .status(400)
        .json({
          message: "La huella dactilar ya está registrada para este usuario",
        });
    }
    console.error("Create huella error:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const getHuellas = async (req, res) => {
  try {
    const huellas = await HuellaDactilar.findAll();
    res.json(huellas);
  } catch (error) {
    console.error("Get huellas error:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const deleteHuella = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await HuellaDactilar.delete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Huella dactilar no encontrada" });
    }

    res.json({ message: "Huella dactilar eliminada correctamente" });
  } catch (error) {
    console.error("Delete huella error:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
