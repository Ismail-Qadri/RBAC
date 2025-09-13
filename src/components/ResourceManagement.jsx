import React from 'react';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';
import useLanguage from '../hooks/useLanguage';

const ResourceManagement = ({ resources, onEdit, onDelete, onAdd }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700">{t('allResources')}</h2>
            <button onClick={onAdd} className="flex items-center px-4 py-2 bg-[#166a45] text-white font-semibold rounded-full shadow-md hover:bg-[#104631] transition">
                <Plus size={16} className="me-2" /> {t('addResource')}
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('resourceId')}</th>
                        <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('name')}</th>
                        <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('category')}</th>
                        <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {resources.map((p) => (
                        <tr key={p.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs">{p.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button onClick={() => onEdit(p)} className="text-teal-600 hover:text-teal-900 me-4"><Edit size={18} /></button>
                                <button onClick={() => onDelete(p.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};
export default ResourceManagement;