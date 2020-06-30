import { Collection, Role } from 'discord.js';

export interface RoleCheck {
  userRoles: Collection<string, Role>;
  validRoles: string[];
}

export const canUserExecuteCommand = ({ userRoles, validRoles }: RoleCheck): boolean => {
  const [caguamolandAuthRoleId, testingArenaAuthRolId] = validRoles;
  return userRoles.has(caguamolandAuthRoleId) || userRoles.has(testingArenaAuthRolId);
};
