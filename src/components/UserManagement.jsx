import React from 'react';
import { Plus, Edit, Trash2, Search, Users } from 'lucide-react';
import useLanguage from '../hooks/useLanguage';

const UserManagement = ({ users, groups, roles, onEdit, onDelete, onAdd }) => {
  const { language, t } = useLanguage();
  const getGroupNames = (groupIds) => groupIds.map(id => groups.find(g => g.id === id)?.name || 'N/A').join(', ');
  const getRoleNames = (groupIds) => {
    const uniqueRoleNames = new Set(
      groupIds.flatMap(id => {
        const group = groups.find(g => g.id === id);
        return roles.filter(r => r.id === group?.roleId).map(r => r.name);
      })
    );
    return Array.from(uniqueRoleNames).join(', ');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-700">{t('allUsers')}</h2>
        <div className={`flex items-center space-x-4 ${language === 'ar' ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <div className="relative">
            <input
              type="text"
              placeholder={t('searchUsers')}
              className={`ps-10 pe-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200 ${language === 'ar' ? 'text-right' : ''}`}
            />
            <Search size={18} className={`absolute start-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
          </div>
          <button
            onClick={onAdd}
            className="flex items-center px-4 py-2 bg-[#166a45] text-white font-semibold rounded-full shadow-md hover:bg-[#104631] transition duration-300"
          >
            <Plus size={16} className="me-2" /> {t('addUser')}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className={`px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider`}>{t('nationalId')}</th>
              <th className={`px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider`}>{t('groupsLabel')}</th>
              <th className={`px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider`}>{t('rolesLabel')}</th>
              <th className={`px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider`}>{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                   <div className="flex items-center text-sm">
                     <Users size={16} className="me-2" />
                     {getGroupNames(user.groupIds)}
                   </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex flex-wrap gap-1">
                    {getRoleNames(user.groupIds).split(', ').map((roleName, index) => (
                      <span key={index} className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        roleName === 'Admin' ? 'bg-red-100 text-red-800' :
                        roleName === 'Editor' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-teal-100 text-teal-800'
                      }`}>
                        {roleName}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => onEdit(user)} className="text-teal-600 hover:text-teal-900 transition-colors duration-200 me-4">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => onDelete(user.id)} className="text-red-600 hover:text-red-900 transition-colors duration-200">
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

export default UserManagement;