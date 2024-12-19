import { Router } from 'express';
import { getWifiConfig, saveWifiConfig } from '../controllers/wifi.controller.js';

const router = Router();

// Rutas para configuración Wi-Fi
router.get('/configurar-wifi', getWifiConfig);
router.post('/configurar-wifi', saveWifiConfig);

export default router;