import { Router } from 'express'
import { getAllSession, getSession, deleteSession } from './session.controller'

const sessionRoutes = Router()
sessionRoutes.get('/all', getAllSession)
sessionRoutes.get('/', getSession)
sessionRoutes.delete('/:id', deleteSession)
export default sessionRoutes
