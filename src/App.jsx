import React, { useState } from 'react';
import useLanguage from './hooks/useLanguage';
import { User, Users, Shield, Settings } from 'lucide-react';
import UserManagement from './components/UserManagement';
import GroupManagement from './components/GroupManagement';
import RoleManagement from './components/RoleManagement';
import ResourceManagement from './components/ResourceManagement';
import UserModal from './Modals/UserModal';
import GroupModal from './Modals/GroupModal';
import RoleModal from './Modals/RoleModal';
import ResourceModal from './Modals/ResourceModal';
import Navbar from './components/Navbar';
// import ParticleBackground from './components/ParticleBackground';


const App = () => {

  const [resources, setResources] = useState([
    { id: 'p-1001', name: 'Users', category: 'User Management' },
    { id: 'p-1002', name: 'Content', category: 'Content' },
    { id: 'p-1003', name: 'Reports', category: 'Reporting' },
    { id: 'p-1004', name: 'Invoices', category: 'Finance' },
  ]);

 const [roles, setRoles] = useState([
  { id: 1, name: 'Admin', access: { 'p-1001': ['create', 'read', 'update', 'delete'], 'p-1002': ['create', 'read', 'update', 'delete'], 'p-1003': ['read'], 'p-1004': ['create', 'read', 'update', 'delete'] } },
  { id: 2, name: 'Finance', access: { 'p-1003': ['read'], 'p-1004': ['create', 'read', 'update'] } },
  { id: 3, name: 'Editor', access: { 'p-1002': ['create', 'read', 'update'], 'p-1003': ['read'] } },
  { id: 4, name: 'Viewer', access: { 'p-1003': ['read'] } },
]);

  const [groups, setGroups] = useState([
    { id: 101, name: 'Management', roleId: 1 },
    { id: 102, name: 'Sales & Finance', roleId: 2 },
    { id: 103, name: 'Content Team', roleId: 3 },
    { id: 104, name: 'General Staff', roleId: 4 },
  ]);
  
  const [users, setUsers] = useState([
    { id: '1000000001', groupIds: [101], arFullName: 'أحمد سعيد', enFullName: 'Ahmed Saeed', dobH: 14000101, dobG: '1979-11-20', gender: 'M', arFirst: 'أحمد', enFirst: 'Ahmed', arFamily: 'سعيد', enFamily: 'Saeed', arFather: 'محمد', enFather: 'Mohammed', arGrand: 'علي', enGrand: 'Ali', idVersion: 1, idIssueDateG: '2020-01-01', idIssueDateH: 14410505, idExpiryDateG: '2030-01-01', idExpiryDateH: 14510505, nationality: 1, enNationality: 'Saudi Arabian', arNationality: 'سعودي', language: 'ar' },
    { id: '2000000002', groupIds: [103], arFullName: 'فاطمة خالد', enFullName: 'Fatima Khalid', dobH: 14100101, dobG: '1989-11-20', gender: 'F', arFirst: 'فاطمة', enFirst: 'Fatima', arFamily: 'خالد', enFamily: 'Khalid', arFather: 'عبدالله', enFather: 'Abdullah', arGrand: 'سعود', enGrand: 'Saud', idVersion: 1, idIssueDateG: '2020-01-01', idIssueDateH: 14410505, idExpiryDateG: '2030-01-01', idExpiryDateH: 14510505, nationality: 1, enNationality: 'Saudi Arabian', arNationality: 'سعودي', language: 'en' },
    { id: '1000000003', groupIds: [104, 102], arFullName: 'علياء ناصر', enFullName: 'Alia Nasser', dobH: 14200101, dobG: '1999-11-20', gender: 'F', arFirst: 'علياء', enFirst: 'Alia', arFamily: 'ناصر', enFamily: 'Nasser', arFather: 'فهد', enFather: 'Fahad', arGrand: 'خالد', enGrand: 'Khalid', idVersion: 1, idIssueDateG: '2020-01-01', idIssueDateH: 14410505, idExpiryDateG: '2030-01-01', idExpiryDateH: 14510505, nationality: 1, enNationality: 'Saudi Arabian', arNationality: 'سعودي', language: 'en' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const { language, setLanguage, t } = useLanguage();

  const handleAddUser = (userData) => {
    setUsers([...users, userData]);
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleEditUser = (userData) => {
    setUsers(users.map(u => (u.id === userData.id ? userData : u)));
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteUser = (itemId) => {
    setUsers(users.filter(u => u.id !== itemId));
  };

  const handleAddGroup = (groupData) => {
    setGroups([...groups, { ...groupData, id: groups.length + 101 }]);
    setIsModalOpen(false);
    setEditingItem(null);
  };
  
  const handleEditGroup = (groupData) => {
    setGroups(groups.map(g => (g.id === groupData.id ? groupData : g)));
    setIsModalOpen(false);
    setEditingItem(null);
  };
  
  const handleDeleteGroup = (itemId) => {
    setGroups(groups.filter(g => g.id !== itemId));
  };
  
  const handleAddRole = (roleData) => {
    setRoles([...roles, { ...roleData, id: roles.length + 1 }]);
    setIsModalOpen(false);
    setEditingItem(null);
  };
  
  const handleEditRole = (roleData) => {
    setRoles(roles.map(r => (r.id === roleData.id ? roleData : r)));
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteRole = (itemId) => {
    setRoles(roles.filter(r => r.id !== itemId));
  };

  const handleAddResource = (resourceData) => {
    // Generate next id in the format p-100X
    const lastId = resources.length > 0
      ? Math.max(...resources.map(r => parseInt(r.id.replace('p-', ''), 10)))
      : 1000;
    const nextId = `p-${lastId + 1}`;
    setResources([...resources, { ...resourceData, id: nextId }]);
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleEditResource = (resourceData) => {
    setResources(resources.map(p => (p.id === resourceData.id ? resourceData : p)));
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteResource = (itemId) => {
    setResources(resources.filter(p => p.id !== itemId));
  };

  const openAddModal = (type) => {
    setEditingItem(null);
    setIsModalOpen({ type });
  };
  
  const openEditModal = (type, item) => {
    setEditingItem(item);
    setIsModalOpen({ type });
  };

  const renderCurrentScreen = () => {
    switch (activeTab) {
      case 'groups':
        return (
          <GroupManagement 
            groups={groups} 
            roles={roles} 
            users={users}
            onEdit={(item) => openEditModal('group', item)} 
            onDelete={handleDeleteGroup}
            onAdd={() => openAddModal('group')}
          />
        );
     case 'roles':
        return <RoleManagement roles={roles} resources={resources} onEdit={(item) => openEditModal('role', item)} onDelete={handleDeleteRole} onAdd={() => openAddModal('role')} />;
      case 'resources':
        return <ResourceManagement resources={resources} onEdit={(item) => openEditModal('resource', item)} onDelete={handleDeleteResource} onAdd={() => openAddModal('resource')} />;
      case 'users':
      default:
        return (
          <UserManagement 
            users={users} 
            groups={groups} 
            roles={roles} 
            onEdit={(item) => openEditModal('user', item)} 
            onDelete={handleDeleteUser} 
            onAdd={() => openAddModal('user')}
          />
        );
    }
  };

  const renderModal = () => {
    if (!isModalOpen) return null;

    switch (isModalOpen.type) {
      case 'user':
        return (
          <UserModal
            groups={groups}
            roles={roles}
            resources={resources}
            onClose={() => setIsModalOpen(false)}
            onSave={editingItem ? handleEditUser : handleAddUser}
            user={editingItem}
          />
        );
      case 'group':
        return (
          <GroupModal
            groups={groups}
            roles={roles}
            onClose={() => setIsModalOpen(false)}
            onSave={editingItem ? handleEditGroup : handleAddGroup}
            group={editingItem}
          />
        );
     case 'role':
        return <RoleModal resources={resources} onClose={() => setIsModalOpen(false)} onSave={editingItem ? handleEditRole : handleAddRole} role={editingItem} />;
      case 'resource':
        return <ResourceModal onClose={() => setIsModalOpen(false)} onSave={editingItem ? handleEditResource : handleAddResource} resource={editingItem} />;
      default:
        return null;
    }
  };

 
  return (
    <>
    {/* <div className="min-h-screen relative"> */}
      <Navbar />
        {/* <ParticleBackground /> */}
          <div className="relative z-10">   
            <div className="bg-gray-100 p-8 pb-12 font-sans antialiased m-36 rounded-2xl shadow-xl" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              <div className="max-w-6xl mx-auto mt-4">
                <header className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <Shield className="me-2" size={32} /> {t('permissionManagement')}
                  </h1>
                  <nav className={`flex items-center space-x-2 p-1 bg-white rounded-full shadow-lg ${language === 'ar' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <button
                      onClick={() => setActiveTab('users')}
                      className={`flex items-center px-4 py-2 rounded-full font-semibold transition-colors duration-200 ${
                        activeTab === 'users' ? 'bg-[#166a45] text-white' : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <User size={18} className="me-2" /> {t('users')}
                    </button>
                    <button
                      onClick={() => setActiveTab('groups')}
                      className={`flex items-center px-4 py-2 rounded-full font-semibold transition-colors duration-200 ${
                        activeTab === 'groups' ? 'bg-[#166a45] text-white' : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Users size={18} className="me-2" /> {t('groups')}
                    </button>
                    <button onClick={() => setActiveTab('roles')} className={`flex items-center px-4 py-2 rounded-full font-semibold transition-colors duration-200 ${activeTab === 'roles' ? 'bg-[#166a45] text-white' : 'text-gray-700 hover:bg-gray-200'}`}>
              <Shield size={18} className="me-2" /> {t('roles')}
            </button>
            <button onClick={() => setActiveTab('resources')} className={`flex items-center px-4 py-2 rounded-full font-semibold transition-colors duration-200 ${activeTab === 'resources' ? 'bg-[#166a45] text-white' : 'text-gray-700 hover:bg-gray-200'}`}>
              <Settings size={18} className="me-2" /> {t('resources')}
            </button>
                  </nav>
                </header>
                {renderCurrentScreen()}
              </div>
              {renderModal()}
            </div>
          </div>
          {/* </div> */}
          </>
  );
};

export default App;


