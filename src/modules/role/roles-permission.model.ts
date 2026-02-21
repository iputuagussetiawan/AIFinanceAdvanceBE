import mongoose, { Schema, Document } from 'mongoose'
import { Permissions, Roles, type PermissionType, type RoleType } from './role.enum'
import { RolePermissions } from './role-permission.util'

export interface RoleDocument extends Document {
    name: RoleType
    permissions: Array<PermissionType>
}

const roleSchema = new Schema<RoleDocument>(
    {
        name: {
            type: String,
            enum: Object.values(Roles),
            required: true,
            unique: true
        },
        permissions: {
            type: [String],
            enum: Object.values(Permissions),
            required: true,
            default: function (this: RoleDocument) {
                return RolePermissions[this.name]
            }
        }
    },
    {
        timestamps: true
    }
)

const RoleModel = mongoose.model<RoleDocument>('Role', roleSchema)
export default RoleModel
