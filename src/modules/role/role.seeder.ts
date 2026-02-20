import { ClientSession } from 'mongoose'
import RoleModel from './roles-permission.model'
import { RolePermissions } from './role-permission.util'

export const seedRoles = async (session: ClientSession) => {
    console.log('🧹 Clearing existing roles...')
    await RoleModel.deleteMany({}, { session })

    for (const roleName in RolePermissions) {
        const role = roleName as keyof typeof RolePermissions
        const permissions = RolePermissions[role]

        const newRole = new RoleModel({
            name: role,
            permissions: permissions
        })

        await newRole.save({ session })
        console.log(`🌱 [Seeder] Role "${role}" added.`)
    }
}
