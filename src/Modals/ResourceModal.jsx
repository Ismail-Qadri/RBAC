import React, { useState } from 'react';
import { X } from 'lucide-react';
import useLanguage from '../hooks/useLanguage';
import axios from 'axios';

const ResourceModal = ({ onClose, onSave, resource }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState(resource || { name: '', category: '', description: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      category: formData.category || '',
      description: formData.description || ''
    };
    // Optimistic UI: update parent immediately
    if (typeof onSave === 'function') {
      // Create a temporary resource object
      const tempResource = {
        id: Date.now(), // Temporary ID
        ...payload,
        _optimistic: true
      };
      onSave(tempResource);
    }
    try {
      const API_BASE_URL = 'https://dev-api.wedo.solutions:3000/api/resources';
      let res;
      if (resource && resource.id) {
        // Edit resource
        res = await axios.put(`${API_BASE_URL}/${resource.id}`, payload);
        if (typeof onSave === 'function') {
          onSave(res.data);
        }
      } else {
        // Create new resource
        res = await axios.post(`${API_BASE_URL}`, payload);
        if (typeof onSave === 'function') {
          onSave(res.data);
        }
      }
      onClose();
    } catch (err) {
      alert('Error saving resource: ' + (err.response?.data?.message || err.message));
      console.error('Error saving resource:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">{resource ? t('editResourceModal') : t('addResourceModal')}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">{t('name')}</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="category">{t('category')}</label>
            <input type="text" id="category" name="category" value={formData.category || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="description">{t('description')}</label>
            <input type="text" id="description" name="description" value={formData.description || ''} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-6 py-2 border rounded-full">{t('cancel')}</button>
            <button type="submit" className="px-6 py-2 bg-[#166a45] text-white rounded-full">{t('save')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ResourceModal;