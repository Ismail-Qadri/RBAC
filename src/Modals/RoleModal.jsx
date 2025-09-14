// import React, { useState, useEffect } from 'react';
// import { X, Eye, Pencil, Trash2, PlusCircle } from 'lucide-react';
// import useLanguage from '../hooks/useLanguage';
// import axios from 'axios';

// const permissionIcons = {
//   read: Eye,
//   write: Pencil,
//   delete: Trash2,
//   create: PlusCircle,
// };

// const RoleModal = ({ resources, onClose, onSave, role }) => {
//     const { t } = useLanguage();
//     const [permissions, setPermissions] = useState([]);
//     const [formData, setFormData] = useState(role ? { ...role, name: role.name || '', description: role.description || '', access: role.access || {} } : { name: '', description: '', access: {} });

//     useEffect(() => {
//       // Fetch permissions dynamically from API
//       const fetchPermissions = async () => {
//         try {
//           const res = await (window.axios
//             ? window.axios.get('https://dev-api.wedo.solutions:3000/api/permissions')
//             : (await import('axios')).default.get('https://dev-api.wedo.solutions:3000/api/permissions'));
//           setPermissions(res.data);
//         } catch (err) {
//           setPermissions([
//             { id: 1, name: 'read' },
//             { id: 2, name: 'write' },
//             { id: 3, name: 'delete' },
//             { id: 4, name: 'create' },
//           ]);
//         }
//       };
//       fetchPermissions();
//     }, []);

//     const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//     const API_BASE_URL = 'https://dev-api.wedo.solutions:3000/api';

//     // After successful API response, optionally refetch role data
//     const handleAccessChange = async (resourceId, permissionName) => {
//         // Find permissionId from permissions list
//         const permissionObj = permissions.find(p => p.name === permissionName);
//         if (!permissionObj) {
//             console.warn('Permission object not found for:', permissionName);
//             return;
//         }
//         const permissionId = permissionObj.id;
//         console.log('Assigning permission:', { roleId: role?.id, resourceId, permissionId, permissionName });
//         // If editing an existing role, call the API to assign permission
//         if (role && role.id) {
//             try {
//                 const res = await axios.post(`${API_BASE_URL}/associations/roles/${role.id}/permissions`, {
//                     resourceId: Number(resourceId),
//                     permissionId: Number(permissionId)
//                 });
//                 console.log('API response:', res.data);
//                 // Refetch updated role data to sync UI
//                 const updatedRole = await axios.get(`${API_BASE_URL}/roles/${role.id}`);
//                 setFormData(prev => ({ ...prev, access: updatedRole.data.access || {} }));
//             } catch (err) {
//                 console.error('Error assigning permission:', err);
//                 alert('Error assigning permission: ' + (err.response?.data?.message || err.message));
//             }
//         } else {
//             // Update local state for UI feedback
//             setFormData(prev => {
//                 const newAccess = { ...prev.access };
//                 const currentActions = newAccess[resourceId] || [];
//                 if (currentActions.includes(permissionName)) {
//                     newAccess[resourceId] = currentActions.filter(a => a !== permissionName);
//                     if (newAccess[resourceId].length === 0) {
//                         delete newAccess[resourceId];
//                     }
//                 } else {
//                     newAccess[resourceId] = [...currentActions, permissionName];
//                 }
//                 return { ...prev, access: newAccess };
//             });
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const payload = {
//             name: formData.name,
//             description: formData.description || '',
//             access: formData.access
//         };
//         try {
//             let res;
//             if (role && role.id) {
//                 res = await axios.put(`${API_BASE_URL}/roles/${role.id}`, payload);
//             } else {
//                 res = await axios.post(`${API_BASE_URL}/roles`, payload);
//             }
//             if (typeof onSave === 'function') {
//                 await onSave(res.data); // Parent will refetch all data
//             }
//             onClose();
//         } catch (err) {
//             alert('Error saving role: ' + (err.response?.data?.message || err.message));
//         }
//     };

//     // Map permission IDs to names for editing
//     const getResourcePermissions = (resourceId) => {
//         if (!role || !Array.isArray(role.resources)) return [];
//         const resourceObj = role.resources.find(r => String(r.resource_id) === String(resourceId));
//         if (!resourceObj || !Array.isArray(resourceObj.permissions)) return [];
//         return resourceObj.permissions.map(permId => {
//             if (!permissions || !Array.isArray(permissions)) return permId;
//             const permObj = permissions.find(p => String(p.id) === String(permId));
//             return permObj ? permObj.name : permId;
//         });
//     };

//     const ActionIcon = ({ resourceId, permission }) => {
//         const Icon = permissionIcons[permission.name] || Eye;
//         // Defensive: ensure permissions and resource permissions are arrays
//         let activePermissions = [];
//         if (role && Array.isArray(role.resources)) {
//             activePermissions = getResourcePermissions(resourceId);
//         } else if (formData.access && typeof formData.access === 'object') {
//             activePermissions = formData.access[resourceId] || [];
//         }
//         const isActive = Array.isArray(activePermissions) && activePermissions.includes(permission.name);
//         return (
//             <button
//                 type="button"
//                 onClick={() => handleAccessChange(resourceId, permission.name)}
//                 className={`p-1 rounded-full transition-colors duration-200 border ${isActive ? 'bg-teal-100 border-teal-500 text-teal-700' : 'bg-gray-50 border-gray-300 text-gray-400'} hover:bg-teal-200 hover:text-teal-900`}
//                 title={permission.name}
//                 aria-pressed={isActive}
//             >
//                 <Icon size={18} />
//             </button>
//         );
//     };

//     return (
//         <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 mt-10 transform transition-transform scale-100 max-h-[75vh] flex flex-col">
//                 <div className="flex justify-between items-center mb-6">
//                     <h3 className="text-2xl font-bold text-gray-800">{role ? t('editRoleModal') : t('addRoleModal')}</h3>
//                     <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors duration-200"><X size={24} /></button>
//                 </div>
//                 <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
//                     <div className="mb-6">
//                         <label className="block text-gray-800 font-bold mb-2" htmlFor="name">{t('roleName')}</label>
//                         <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
//                     </div>
//                     <div className="mb-6">
//                         <label className="block text-gray-800 font-bold mb-2" htmlFor="description">{t('description')}</label>
//                         <input type="text" id="description" name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
//                     </div>
//                     <div className="mb-6">
//                         <label className="block text-gray-800 font-bold mb-2">{t('permissionsLabel')}</label>
//                         <div className="space-y-2">
//                             {resources.map(resource => (
//                                 <div key={resource.id} className="flex items-center justify-between p-2 border rounded-lg">
//                                     <span className="text-sm text-gray-700">{resource.name}</span>
//                                     <div className="flex items-center space-x-2">
//                                         {permissions.map(permission => (
//                                             <ActionIcon resourceId={resource.id} permission={permission} key={permission.id} />
//                                         ))}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                     <div className="flex justify-end space-x-4">
//                         <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 font-semibold hover:bg-gray-100 transition-colors duration-200">{t('cancel')}</button>                     
//                         <button type="submit" className="px-6 py-2 bg-[#166a45] text-white font-semibold rounded-full shadow-md hover:bg-[#104631] transition-colors duration-200">{t('save')}</button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default RoleModal;




// import React, { useState, useEffect } from 'react';
// import { X, Eye, Pencil, Trash2, PlusCircle } from 'lucide-react';
// import useLanguage from '../hooks/useLanguage';
// import axios from 'axios';

// const permissionIcons = {
//   read: Eye,
//   write: Pencil,
//   delete: Trash2,
//   create: PlusCircle,
// };

// const RoleModal = ({ resources, onClose, onSave, role }) => {
//     const { t } = useLanguage();
//     const [permissions, setPermissions] = useState([]);
//     const [formData, setFormData] = useState({ name: '', description: '', access: {} });

//     useEffect(() => {
//       // Fetch permissions dynamically from API
//       const fetchPermissions = async () => {
//         try {
//           const res = await (window.axios
//             ? window.axios.get('https://dev-api.wedo.solutions:3000/api/permissions')
//             : (await import('axios')).default.get('https://dev-api.wedo.solutions:3000/api/permissions'));
//           setPermissions(res.data);
//         } catch (err) {
//           setPermissions([
//             { id: 1, name: 'read' },
//             { id: 2, name: 'write' },
//             { id: 3, name: 'delete' },
//             { id: 4, name: 'create' },
//           ]);
//         }
//       };
//       fetchPermissions();
//     }, []);

//     useEffect(() => {
//       if (role) {
//         const resourceNameToId = resources.reduce((acc, r) => {
//           acc[r.name] = r.id;
//           return acc;
//         }, {});

//         const access = {};
//         (role.policies || []).forEach(policy => {
//           const [sub, obj, act] = policy;
//           const resId = resourceNameToId[obj];
//           if (resId) {
//             if (!access[resId]) access[resId] = [];
//             access[resId].push(act);
//           }
//         });

//         setFormData({
//           name: role.name || '',
//           description: role.description || '',
//           access,
//         });
//       } else {
//         setFormData({ name: '', description: '', access: {} });
//       }
//     }, [role, resources, permissions]);

//     const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//     const API_BASE_URL = 'https://dev-api.wedo.solutions:3000/api';

//     const handleAccessChange = async (resourceId, permissionName) => {
//         const permissionObj = permissions.find(p => p.name === permissionName);
//         if (!permissionObj) {
//             console.warn('Permission object not found for:', permissionName);
//             return;
//         }
//         const permissionId = permissionObj.id;

//         const currentPermissions = formData.access[resourceId] || [];
//         const isCurrentlyActive = currentPermissions.includes(permissionName);

//         if (role && role.id) {
//             try {
//                 let res;
//                 if (isCurrentlyActive) {
//                     // Assume DELETE endpoint exists symmetrically
//                     res = await axios.delete(`${API_BASE_URL}/associations/roles/${role.id}/permissions`, {
//                         data: {
//                             resourceId: Number(resourceId),
//                             permissionId: Number(permissionId)
//                         }
//                     });
//                 } else {
//                     res = await axios.post(`${API_BASE_URL}/associations/roles/${role.id}/permissions`, {
//                         resourceId: Number(resourceId),
//                         permissionId: Number(permissionId)
//                     });
//                 }
//                 console.log('API response:', res.data);

//                 // Refetch updated role data
//                 const updatedRoleRes = await axios.get(`${API_BASE_URL}/roles/${role.id}`);
//                 const updatedRole = updatedRoleRes.data;

//                 // Recompute access from policies
//                 const resourceNameToId = resources.reduce((acc, r) => {
//                   acc[r.name] = r.id;
//                   return acc;
//                 }, {});
//                 const newAccess = {};
//                 (updatedRole.policies || []).forEach(policy => {
//                   const [sub, obj, act] = policy;
//                   const resId = resourceNameToId[obj];
//                   if (resId) {
//                     if (!newAccess[resId]) newAccess[resId] = [];
//                     newAccess[resId].push(act);
//                   }
//                 });

//                 setFormData(prev => ({ ...prev, access: newAccess }));
//             } catch (err) {
//                 console.error('Error assigning/removing permission:', err);
//                 alert('Error assigning/removing permission: ' + (err.response?.data?.message || err.message));
//             }
//         } else {
//             // Local toggle for new role
//             setFormData(prev => {
//                 const newAccess = { ...prev.access };
//                 const currentActions = newAccess[resourceId] || [];
//                 if (currentActions.includes(permissionName)) {
//                     newAccess[resourceId] = currentActions.filter(a => a !== permissionName);
//                     if (newAccess[resourceId].length === 0) {
//                         delete newAccess[resourceId];
//                     }
//                 } else {
//                     newAccess[resourceId] = [...currentActions, permissionName];
//                 }
//                 return { ...prev, access: newAccess };
//             });
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const payload = {
//             name: formData.name,
//             description: formData.description || '',
//         };
//         try {
//             let res;
//             let roleId;
//             if (role && role.id) {
//                 res = await axios.put(`${API_BASE_URL}/roles/${role.id}`, payload);
//                 roleId = role.id;
//             } else {
//                 res = await axios.post(`${API_BASE_URL}/roles`, payload);
//                 roleId = res.data.id;

//                 // Assign permissions for new role
//                 const permNameToId = permissions.reduce((acc, p) => {
//                   acc[p.name] = p.id;
//                   return acc;
//                 }, {});
//                 for (let resId in formData.access) {
//                     for (let permName of formData.access[resId]) {
//                         const permId = permNameToId[permName];
//                         if (permId) {
//                             await axios.post(`${API_BASE_URL}/associations/roles/${roleId}/permissions`, {
//                                 resourceId: Number(resId),
//                                 permissionId: Number(permId)
//                             });
//                         }
//                     }
//                 }
//             }
//             if (typeof onSave === 'function') {
//                 await onSave(res.data); // Parent will refetch all data
//             }
//             onClose();
//         } catch (err) {
//             alert('Error saving role: ' + (err.response?.data?.message || err.message));
//         }
//     };

//     const ActionIcon = ({ resourceId, permission }) => {
//         const Icon = permissionIcons[permission.name] || Eye;
//         const activePermissions = formData.access[resourceId] || [];
//         const isActive = activePermissions.includes(permission.name);
//         return (
//             <button
//                 type="button"
//                 onClick={() => handleAccessChange(resourceId, permission.name)}
//                 className={`p-1 rounded-full transition-colors duration-200 border ${isActive ? 'bg-teal-100 border-teal-500 text-teal-700' : 'bg-gray-50 border-gray-300 text-gray-400'} hover:bg-teal-200 hover:text-teal-900`}
//                 title={permission.name}
//                 aria-pressed={isActive}
//             >
//                 <Icon size={18} />
//             </button>
//         );
//     };

//     return (
//         <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 mt-10 transform transition-transform scale-100 max-h-[75vh] flex flex-col">
//                 <div className="flex justify-between items-center mb-6">
//                     <h3 className="text-2xl font-bold text-gray-800">{role ? t('editRoleModal') : t('addRoleModal')}</h3>
//                     <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors duration-200"><X size={24} /></button>
//                 </div>
//                 <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
//                     <div className="mb-6">
//                         <label className="block text-gray-800 font-bold mb-2" htmlFor="name">{t('roleName')}</label>
//                         <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" required />
//                     </div>
//                     <div className="mb-6">
//                         <label className="block text-gray-800 font-bold mb-2" htmlFor="description">{t('description')}</label>
//                         <input type="text" id="description" name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
//                     </div>
//                     <div className="mb-6">
//                         <label className="block text-gray-800 font-bold mb-2">{t('permissionsLabel')}</label>
//                         <div className="space-y-2">
//                             {resources.map(resource => (
//                                 <div key={resource.id} className="flex items-center justify-between p-2 border rounded-lg">
//                                     <span className="text-sm text-gray-700">{resource.name}</span>
//                                     <div className="flex items-center space-x-2">
//                                         {permissions.map(permission => (
//                                             <ActionIcon resourceId={resource.id} permission={permission} key={permission.id} />
//                                         ))}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                     <div className="flex justify-end space-x-4">
//                         <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 font-semibold hover:bg-gray-100 transition-colors duration-200">{t('cancel')}</button>                     
//                         <button type="submit" className="px-6 py-2 bg-[#166a45] text-white font-semibold rounded-full shadow-md hover:bg-[#104631] transition-colors duration-200">{t('save')}</button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default RoleModal;







import React, { useState, useEffect } from 'react';
import { X, Eye, Edit, Trash2 } from 'lucide-react';
import useLanguage from '../hooks/useLanguage';
import axios from 'axios';

const RoleModal = ({ resources, onClose, onSave, role }) => {
    const { t } = useLanguage();
    const [permissions, setPermissions] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '', access: {} });

    useEffect(() => {
      // Fetch permissions dynamically from API
      const fetchPermissions = async () => {
        try {
          const res = await (window.axios
            ? window.axios.get('https://dev-api.wedo.solutions:3000/api/permissions')
            : (await import('axios')).default.get('https://dev-api.wedo.solutions:3000/api/permissions'));
          setPermissions(res.data);
        } catch (err) {
          setPermissions([
            { id: 1, name: 'read' },
            { id: 2, name: 'write' },
            { id: 3, name: 'delete' },
          ]);
        }
      };
      fetchPermissions();
    }, []);

    useEffect(() => {
      if (role) {
        const access = {};
        (role.resources || []).forEach(resource => {
          access[resource.resource_id] = resource.permissions.map(permId => {
            const perm = permissions.find(p => p.id === permId);
            return perm ? perm.name : permId;
          });
        });

        setFormData({
          name: role.name || '',
          description: role.description || '',
          access,
        });
      } else {
        setFormData({ name: '', description: '', access: {} });
      }
    }, [role, resources, permissions]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const API_BASE_URL = 'https://dev-api.wedo.solutions:3000/api';

    const handleAccessChange = async (resourceId, permissionName) => {
        const permissionObj = permissions.find(p => p.name === permissionName);
        if (!permissionObj) {
            console.warn('Permission object not found for:', permissionName);
            return;
        }
        const permissionId = permissionObj.id;

        const currentPermissions = formData.access[resourceId] || [];
        const isCurrentlyActive = currentPermissions.includes(permissionName);

        if (role && role.id) {
            try {
                let res;
                if (isCurrentlyActive) {
                    res = await axios.delete(`${API_BASE_URL}/associations/roles/${role.id}/permissions`, {
                        data: {
                            resourceId: Number(resourceId),
                            permissionId: Number(permissionId)
                        }
                    });
                } else {
                    res = await axios.post(`${API_BASE_URL}/associations/roles/${role.id}/permissions`, {
                        resourceId: Number(resourceId),
                        permissionId: Number(permissionId)
                    });
                }
                console.log('API response:', res.data);

                const updatedRoleRes = await axios.get(`${API_BASE_URL}/roles/${role.id}`);
                const updatedRole = updatedRoleRes.data;

                const newAccess = {};
                (updatedRole.resources || []).forEach(resource => {
                  newAccess[resource.resource_id] = resource.permissions.map(permId => {
                    const perm = permissions.find(p => p.id === permId);
                    return perm ? perm.name : permId;
                  });
                });

                setFormData(prev => ({ ...prev, access: newAccess }));
            } catch (err) {
                console.error('Error assigning/removing permission:', err);
                alert('Error assigning/removing permission: ' + (err.response?.data?.message || err.message));
            }
        } else {
            setFormData(prev => {
                const newAccess = { ...prev.access };
                const currentActions = newAccess[resourceId] || [];
                if (currentActions.includes(permissionName)) {
                    newAccess[resourceId] = currentActions.filter(a => a !== permissionName);
                    if (newAccess[resourceId].length === 0) {
                        delete newAccess[resourceId];
                    }
                } else {
                    newAccess[resourceId] = [...currentActions, permissionName];
                }
                return { ...prev, access: newAccess };
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            name: formData.name,
            description: formData.description || '',
        };
        try {
            let res;
            let roleId;
            if (role && role.id) {
                res = await axios.put(`${API_BASE_URL}/roles/${role.id}`, payload);
                roleId = role.id;
            } else {
                res = await axios.post(`${API_BASE_URL}/roles`, payload);
                roleId = res.data.id;

                const permNameToId = permissions.reduce((acc, p) => {
                  acc[p.name] = p.id;
                  return acc;
                }, {});
                for (let resId in formData.access) {
                    for (let permName of formData.access[resId]) {
                        const permId = permNameToId[permName];
                        if (permId) {
                            await axios.post(`${API_BASE_URL}/associations/roles/${roleId}/permissions`, {
                                resourceId: Number(resId),
                                permissionId: Number(permId)
                            });
                        }
                    }
                }
            }
            if (typeof onSave === 'function') {
                await onSave(res.data);
            }
            onClose();
        } catch (err) {
            alert('Error saving role: ' + (err.response?.data?.message || err.message));
        }
    };

    const ActionIcon = ({ resourceId, permission }) => {
        const Icon = {
            read: Eye,
            write: Edit,
            delete: Trash2,
        }[permission.name] || Eye;
        const activePermissions = formData.access[resourceId] || [];
        const isActive = activePermissions.includes(permission.name);
        return (
            <button
                type="button"
                onClick={() => handleAccessChange(resourceId, permission.name)}
                className={`p-1 rounded-full transition-colors duration-200 border ${isActive ? 'bg-teal-100 border-teal-500 text-teal-700' : 'bg-gray-50 border-gray-300 text-gray-400'} hover:bg-teal-200 hover:text-teal-900`}
                title={permission.name}
                aria-pressed={isActive}
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
                        <label className="block text-gray-800 font-bold mb-2" htmlFor="description">{t('description')}</label>
                        <input type="text" id="description" name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-800 font-bold mb-2">{t('permissionsLabel')}</label>
                        <div className="space-y-2">
                            {resources.map(resource => (
                                <div key={resource.id} className="flex items-center justify-between p-2 border rounded-lg">
                                    <span className="text-sm text-gray-700">{resource.name}</span>
                                    <div className="flex items-center space-x-2">
                                        {permissions.map(permission => (
                                            <ActionIcon key={permission.id} resourceId={resource.id} permission={permission} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
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