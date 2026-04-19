import { Router } from 'express'
import {
    createLanguageController,
    getLanguagesController,
    updateLanguageController,
    deleteLanguageController
} from './language.controller'

const languageRoutes = Router()

// 1. Create a new language
// POST /api/languages
languageRoutes.post('/', createLanguageController)

// 2. Get all languages (Use ?active=true for frontend dropdowns)
// GET /api/languages
languageRoutes.get('/', getLanguagesController)

// 3. Update a language by ID
// PATCH /api/languages/:id
languageRoutes.patch('/:id', updateLanguageController)

// 4. Delete a language by ID
// DELETE /api/languages/:id
languageRoutes.delete('/:id', deleteLanguageController)

export default languageRoutes
