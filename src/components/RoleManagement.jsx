// import React from 'react';
// import { Plus, Edit, Trash2, Eye, Pencil, Trash2 as TrashIcon, PlusCircle } from 'lucide-react';
// import useLanguage from '../hooks/useLanguage';

// const permissionIcons = {
//   read: Eye,
//   write: Pencil,
//   delete: TrashIcon,
//   create: PlusCircle,
// };

// const RoleManagement = ({ roles, resources,permissions, onEdit, onAdd, onDelete }) => {
//     const { t } = useLanguage();

//     // Show permissions as icons and names in the table using role.resources
//     const getAccessSummaryIcons = (resourcesArr) => {
//         if (!Array.isArray(resourcesArr) || resourcesArr.length === 0) return <span className="text-gray-400">No permissions</span>;
//         return resourcesArr.map((resourceObj) => {
//             const resource = resources.find(r => r.id === resourceObj.resource_id || r.id === Number(resourceObj.resource_id));
//             if (!resource) return null;
//             return (
//                 <div key={resourceObj.resource_id} className="mb-1">
//                     <span className="font-semibold text-gray-700 mr-2">{resource.name}:</span>
//                     {Array.isArray(resourceObj.permissions) && resourceObj.permissions.map((permId, idx) => {
//                         // Find permission name by ID
//                         const permObj = permissions.find(p => String(p.id) === String(permId));
//                         const permName = permObj ? permObj.name : permId;
//                         const Icon = permissionIcons[permName] || Eye;
//                         return (
//                             <span key={permId + idx} className="inline-flex items-center px-2 py-1 mr-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200" title={permName}>
//                                 <Icon size={16} className="mr-1" />{permName}
//                             </span>
//                         );
//                     })}
//                 </div>
//             );
//         });
//     };

//     // Delete role
//     const handleDelete = (id) => {
//         if (onDelete) {
//             onDelete(id);
//         }
//     };

//     return (
//         <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//             <div className="p-6 border-b border-gray-200 flex justify-between items-center">
//                 <h2 className="text-xl font-semibold text-gray-700">{t('allRoles')}</h2>
//                 <button onClick={onAdd} className="flex items-center px-4 py-2 bg-[#166a45] text-white font-semibold rounded-full shadow-md hover:bg-[#166a45] transition">
//                     <Plus size={16} className="me-2" /> {t('addRole')}
//                 </button>
//             </div>
//             <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                         <tr>
//                             <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('roleName')}</th>
//                             <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
//                             <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                         {roles && roles.length === 0 && (
//                             <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No roles found</td></tr>
//                         )}
//                         {roles && roles.map((role) => (
//                             <tr key={role.id}>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{role.name}</td>
//                                 <td className="px-6 py-4 text-sm text-gray-500">{getAccessSummaryIcons(role.resources)}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                     <button onClick={() => { onEdit(role); }} className="text-teal-600 hover:text-teal-900 me-4"><Edit size={18} /></button>
//                                     <button onClick={() => { handleDelete(role.id); }} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default RoleManagement;



import React from 'react';
import { Plus, Edit, Trash2, Eye, Pencil, Trash2 as TrashIcon, PlusCircle } from 'lucide-react';
import useLanguage from '../hooks/useLanguage';

const permissionIcons = {
  read: Eye,
  write: Pencil,
  delete: TrashIcon,
  create: PlusCircle,
};

const RoleManagement = ({ roles, resources, permissions, onEdit, onAdd, onDelete }) => {
    const { t } = useLanguage();

    // const getAccessSummaryIcons = (role) => {
    //     const byResource = {};
    //     (role.policies || []).forEach(policy => {
    //         const [sub, obj, act] = policy;
    //         if (!byResource[obj]) byResource[obj] = [];
    //         byResource[obj].push(act);
    //     });

    //     const entries = Object.entries(byResource);
    //     if (entries.length === 0) return <span className="text-gray-400">No permissions</span>;

    //     return entries.map(([resName, perms]) => (
    //         <div key={resName} className="mb-1">
    //             <span className="font-semibold text-gray-700 mr-2">{resName}:</span>
    //             {perms.map((permName, idx) => {
    //                 const Icon = permissionIcons[permName] || Eye;
    //                 return (
    //                     <span key={idx} className="inline-flex items-center px-2 py-1 mr-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200" title={permName}>
    //                         <Icon size={16} className="mr-1" />{permName}
    //                     </span>
    //                 );
    //             })}
    //         </div>
    //     ));
    // };

    // Delete role
    const getAccessSummaryIcons = (role) => {
    const byResource = {};
    (role.policies || []).forEach(policy => {
        const [sub, obj, act] = policy;
        if (!byResource[obj]) byResource[obj] = [];
        byResource[obj].push(act);
    });

    const entries = Object.entries(byResource);
    if (entries.length === 0) return <span className="text-gray-400">No permissions</span>;

    return entries.map(([resName, perms]) => (
        <div key={resName} className="mb-1">
           <span className="font-semibold text-gray-700 mr-2">{resName}:</span>
            {perms.map((permId, idx) => {
                // Extract permission ID from "permission::1"
                const idMatch = String(permId).match(/permission::(\d+)/);
                const permObj = (Array.isArray(permissions) && idMatch)
                    ? permissions.find(p => String(p.id) === idMatch[1])
                    : null;
                const permName = permObj ? permObj.name : permId;
                const Icon = permissionIcons[permName] || Eye;
                return (
                    <span key={idx} className="inline-flex items-center px-2 py-1 mr-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200" title={permName}>
                        <Icon size={16} className="mr-1" />{permName}
                    </span>
                );
            })}
        </div>
    ));
};



    const handleDelete = (id) => {
        if (onDelete) {
            onDelete(id);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-700">{t('allRoles')}</h2>
                <button onClick={onAdd} className="flex items-center px-4 py-2 bg-[#166a45] text-white font-semibold rounded-full shadow-md hover:bg-[#166a45] transition">
                    <Plus size={16} className="me-2" /> {t('addRole')}
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('roleName')}</th>
                            <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                            <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {roles && roles.length === 0 && (
                            <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No roles found</td></tr>
                        )}
                        {roles && roles.map((role) => (
                            <tr key={role.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{role.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{getAccessSummaryIcons(role)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onClick={() => { onEdit(role); }} className="text-teal-600 hover:text-teal-900 me-4"><Edit size={18} /></button>
                                    <button onClick={() => { handleDelete(role.id); }} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RoleManagement;


