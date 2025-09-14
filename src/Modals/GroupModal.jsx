import React, { useState } from 'react';
import { X } from 'lucide-react';
import useLanguage from '../hooks/useLanguage';
import axios from 'axios';

const GroupModal = ({ roles, onClose, onSave, group }) => {
  const { language, t } = useLanguage();
  console.log('GroupModal props:', { roles, group });

  const [formData, setFormData] = useState(() => {
    if (group) {
      console.log('Initializing formData for edit:', group);
      // If editing existing group, preselect its first role or fallback to first available role
      const roleId =
        group.roles && group.roles.length > 0
          ? group.roles[0].id
          : roles.length > 0
          ? roles[0].id
          : '';
      return {
        name: group.name || '',
        description: group.description || '',
        roleId,
      };
    }
    console.log('Initializing formData for add:', roles);
    return {
      name: '',
      description: '',
      roleId: roles.length > 0 ? roles[0].id : '',
    };
  });

  const handleChange = (e) => {
  const { name, value } = e.target;
  console.log('Form field changed:', name, '=', value);
  setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit called');
    console.log('Current formData:', formData);
    console.log('Current group:', group);
    const API_BASE_URL = 'https://dev-api.wedo.solutions:3000/api';

    const groupData = {
      name: formData.name,
      description: formData.description || '',
    };
    console.log('Group payload to send:', groupData);

    try {
      let res;
      if (group && group.id) {
        console.log('Updating group:', group.id);
        res = await axios.put(`${API_BASE_URL}/groups/${group.id}`, groupData);
        console.log('PUT response:', res);
      } else {
        console.log('Creating new group');
        res = await axios.post(`${API_BASE_URL}/groups`, groupData);
        console.log('POST response:', res);
      }

      const groupId = res.data?.id;
      console.log('Received groupId:', groupId);
      if (!groupId) {
        console.error('Group ID is missing from API response:', res.data);
        throw new Error('Group ID is missing from API response');
      }

      // Assign role if selected
      if (formData.roleId) {
        const roleId = parseInt(formData.roleId, 10);
        console.log('Assigning role to group:', { groupId, roleId });
        try {
          const roleRes = await axios.post(`${API_BASE_URL}/associations/groups/${groupId}/roles`, { roleId });
          console.log('Role assignment response:', roleRes);
        } catch (roleErr) {
          console.error('Error assigning role:', roleErr.response || roleErr);
        }
      } else {
        console.log('No role selected for assignment.');
      }

      onSave(res.data);
      onClose();
    } catch (err) {
      console.error('Error saving group:', err.response || err);
      alert('Error saving group: ' + (err.response?.data?.message || err.message));
    }
  };

  // return (
  // console.log('Rendering GroupModal, formData:', formData);
  return (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 transform transition-transform scale-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">
            {group ? t('editGroupModal') : t('addGroupModal')}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">
              {t('groupName')}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200 ${
                language === 'ar' ? 'text-right' : ''
              }`}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="description">
              {t('description')}
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200 ${
                language === 'ar' ? 'text-right' : ''
              }`}
              placeholder={t('descriptionPlaceholder') || 'Enter group description'}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="role">
              {t('assignedRole')}
            </label>
            <select
              id="role"
              name="roleId"
              value={formData.roleId}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200 ${
                language === 'ar' ? 'text-right' : ''
              }`}
              required
            >
              <option value="">Select a role...</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
           
          </div>
          <div
            className={`flex justify-end space-x-4 ${
              language === 'ar' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#166a45] text-white font-semibold rounded-full shadow-md hover:bg-[#104631] transition-colors duration-200"
            >
              {t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupModal;
