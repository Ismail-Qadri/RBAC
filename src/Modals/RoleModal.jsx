import React, { useState } from 'react';
import { X,  Eye, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import useLanguage from '../hooks/useLanguage';

const RoleModal = ({ resources, onClose, onSave, role }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState(role || { name: '', access: {} });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleAccessChange = (resourceId, action) => {
        setFormData(prev => {
            const newAccess = { ...prev.access };
            const currentActions = newAccess[resourceId] || [];
            if (currentActions.includes(action)) {
                newAccess[resourceId] = currentActions.filter(a => a !== action);
                if (newAccess[resourceId].length === 0) {
                    delete newAccess[resourceId];
                }
            } else {
                newAccess[resourceId] = [...currentActions, action];
            }
            return { ...prev, access: newAccess };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const ActionIcon = ({ resourceId, action, icon: Icon }) => {
        const hasAccess = formData.access[resourceId]?.includes(action);
        return (
            <button
                type="button"
                onClick={() => handleAccessChange(resourceId, action)}
                className={`p-1 rounded-full transition-colors duration-200 ${hasAccess ? 'text-white bg-[#166a45]' : 'text-gray-400'} hover:bg-[#166a45] hover:text-white`}
            >
                <Icon size={18} />
            </button>
        );
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 mt-10 transform transition-transform scale-100 max-h-[75vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">{role ? t('editRoleModal') : t('addRoleModal')}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors duration-200"><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
                    <div className="mb-6">
                        <label className="block text-gray-800 font-bold mb-2" htmlFor="name">{t('roleName')}</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-800 font-bold mb-2">{t('permissionsLabel')}</label>
                        {/* Group resources by category */}
                        {Array.from(new Set(resources.map(r => r.category))).map(category => (
                            <div key={category} className="mb-4">
                                <h4 className="text-md font-bold text-gray-500 mb-2">{category}</h4>
                                <div className="space-y-2">
                                    {resources.filter(r => r.category === category).map(resource => (
                                        <div key={resource.id} className="flex items-center justify-between p-2 border rounded-lg">
                                            <span className="text-sm text-gray-700">{resource.name}</span>
                                            <div className="flex items-center space-x-2">
                                                <ActionIcon resourceId={resource.id} action="create" icon={PlusCircle} />
                                                <ActionIcon resourceId={resource.id} action="read" icon={Eye} />
                                                <ActionIcon resourceId={resource.id} action="update" icon={Pencil} />
                                                <ActionIcon resourceId={resource.id} action="delete" icon={Trash2} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 font-semibold hover:bg-gray-100 transition-colors duration-200">{t('cancel')}</button>
                        <button type="submit" className="px-6 py-2 bg-[#166a45] text-white font-semibold rounded-full shadow-md hover:bg-[#104631] transition-colors duration-200">{t('save')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default RoleModal;
