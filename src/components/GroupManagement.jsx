import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import useLanguage from '../hooks/useLanguage';

const GroupManagement = ({ groups, roles, users, onEdit, onDelete, onAdd }) => {
  const { language, t } = useLanguage();
  const getRoleName = (roleId) => roles.find(r => r.id === roleId)?.name || 'N/A';
  const getUserCount = (groupId) => users.filter(u => u.groupIds.includes(groupId)).length;

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
            {groups.map((group) => (
              <tr key={group.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{group.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getRoleName(group.roleId)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getUserCount(group.id)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => onEdit(group)} className="text-teal-600 hover:text-teal-900 transition-colors duration-200 me-4">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => onDelete(group.id)} className="text-red-600 hover:text-red-900 transition-colors duration-200">
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