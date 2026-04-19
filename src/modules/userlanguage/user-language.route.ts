import { Router } from 'express'
import { syncUserLanguagesController, getUserLanguagesController } from './user-language.controller'
const userLanguageRoutes = Router()
// GET /api/user-languages -> Mengambil bahasa di profil saya
userLanguageRoutes.get('/', getUserLanguagesController)
// PUT /api/user-languages -> Sinkronisasi semua bahasa (Tambah/Hapus/Edit)
userLanguageRoutes.put('/', syncUserLanguagesController)

export default userLanguageRoutes
