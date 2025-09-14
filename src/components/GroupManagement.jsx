import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import useLanguage from '../hooks/useLanguage';

const GroupManagement = ({ groups, roles, users, onEdit, onAdd, onDelete }) => {
  const { language, t } = useLanguage();

  // Get role name from group.roles array if present, else fallback to roleId lookup
  const getRoleName = (group) => {
    if (Array.isArray(group.roles) && group.roles.length > 0) {
      return group.roles.map(r => r.name).join(', ');
    }
    // fallback to roleId lookup if roles array is missing
    return roles.find(r => r.id === group.roleId)?.name || 'N/A';
  };
  const getUserCount = (groupId) => {
    if (!Array.isArray(users)) return 0;
    return users.filter(u => {
      if (Array.isArray(u.groups)) {
        return u.groups.some(g => g.id === groupId || g === groupId);
      }
      if (Array.isArray(u.groupIds)) {
        return u.groupIds.includes(groupId);
      }
      return false;
    }).length;
  };

  // Delete group
  const handleDelete = (id) => {
    if (onDelete) {
      onDelete(id);
    }
  };

  // return (
    // Log groups before rendering table
    // console.log('Rendering table, groups:', groups);
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-700">{t('allGroups')}</h2>
        <button
          onClick={onAdd}
          className="flex items-center px-4 py-2 bg-[#166a45] text-white font-semibold rounded-full shadow-md hover:bg-[#104631] transition duration-300"
        >
          <Plus size={16} className="me-2" /> {t('addGroup')}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className={`px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider`}>{t('groupName')}</th>
              <th className={`px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider`}>{t('assignedRole')}</th>
              <th className={`px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider`}>{t('userCount')}</th>
              <th className={`px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider`}>{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {groups && groups.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No groups found</td></tr>
            )}
            {groups && groups.map((group) => (
              <tr key={group.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{group.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getRoleName(group)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getUserCount(group.id)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => { console.log('Edit group:', group); onEdit(group); }} className="text-teal-600 hover:text-teal-900 transition-colors duration-200 me-4">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => { console.log('Delete group:', group.id); handleDelete(group.id); }} className="text-red-600 hover:text-red-900 transition-colors duration-200">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GroupManagement;