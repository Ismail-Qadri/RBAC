
import React, { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import useLanguage from '../hooks/useLanguage';
import axios from "axios";

const UserModal = ({ groups, roles, resources, onClose, onSave, user }) => {
  const { language, t } = useLanguage();
  const [nafathId, setNafathId] = useState("");
  const [formData, setFormData] = useState({
    id: '',
    nafath_id: '',
    email: '',
    full_name_en: '',
    status: '',
    roles: [],
    groups: [],
    groupIds: [],
    phone: '',
    // ...other fields as needed
  });
  const isNewUser = !user;
  const API_BASE_URL = 'https://dev-api.wedo.solutions:3000/api';

  // If editing, fetch user data from API
  useEffect(() => {
    if (!isNewUser && user?.id) {
      fetch(`${API_BASE_URL}/users/${nafathId}}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            ...data,
            groupIds: Array.isArray(data.groupIds) ? data.groupIds : [],
          });
        })
        .catch(() => {
          // Optionally handle error (show message, etc.)
        });
    } else if (user) {
      setFormData({
        ...user,
        groupIds: Array.isArray(user.groupIds) ? user.groupIds : [],
      });
    }
  }, [user, isNewUser]);
  
  const getresourcesForGroups = (groupIds) => {
    if (!Array.isArray(groupIds)) return [];
    const allresourceIds = groupIds.flatMap(id => {
      const group = groups.find(g => g.id === id);
      const role = roles.find(r => r.id === group?.roleId);
      return role?.resourceIds || [];
    });
    return Array.from(new Set(allresourceIds));
  };
  
  const getRoleNamesForGroups = (groupIds) => {
    if (!Array.isArray(groupIds)) return '';
    const uniqueRoleNames = new Set(
      groupIds.map(id => {
        const group = groups.find(g => g.id === id);
        return roles.find(r => r.id === group?.roleId)?.name || 'N/A';
      })
    );
    return Array.from(uniqueRoleNames).join(', ');
  };

  const getresourceName = (resourceId) => {
    return resources.find(p => p.id === resourceId)?.name || resourceId;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGroupChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prevData => {
      const newGroupIds = checked
        ? [...prevData.groupIds, parseInt(value, 10)]
        : prevData.groupIds.filter(id => id !== parseInt(value, 10));
      return { ...prevData, groupIds: newGroupIds };
    });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (isNewUser) {
  //     fetch(`${API_BASE_URL}/users`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(formData)
  //     })
  //       .then(async res => {
  //         if (!res.ok) {
  //           const errorText = await res.text();
  //           throw new Error(errorText || 'Failed to create user');
  //         }
  //         return res.json();
  //       })
  //       .then(newUser => {
  //         onSave(newUser);
  //       })
  //       .catch(err => {
  //         alert('Error creating user: ' + err.message);
  //       });
  //   } else {
  //     // For edit, just call onSave with updated formData (API PUT not specified)
  //     onSave(formData);
  //   }
  // };
  
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (isNewUser) {
    // Fetch user details by Nafath ID
    try {
      const res = await fetch(`${API_BASE_URL}/users/${formData.nafath_id}`);
      if (!res.ok) throw new Error('User not found');
      const userData = await res.json();
      // Populate the form with fetched user data
      setFormData({
        ...formData,
        ...userData,
        groupIds: userData.groupIds || [],
      });
      console.log("Fetched user data:", userData);
      // Optionally, you can set a state to switch to edit mode if needed
      // setIsEditMode(true);
    } catch (err) {
      alert('User not found or error: ' + err.message);
    }
  } else {
    // ...existing save logic for edit...
    onSave(formData);
  }
};

  const currentRoleNames = getRoleNamesForGroups(formData.groupIds);
  const currentresources = getresourcesForGroups(formData.groupIds);
  
  const resourcesByCategory = resources.reduce((acc, p) => {
    (acc[p.category] = acc[p.category] || []).push(p);
    return acc;
  }, {});
  
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 mt-10 transform transition-transform scale-100 max-h-[75vh] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">{isNewUser ? t('addUserModal') : t('editUserModal')}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
            <X size={24} />
          </button>
        </div>
  <form onSubmit={handleSubmit} dir={language === 'ar' ? 'rtl' : 'ltr'} className="overflow-y-auto flex-1">
          <div className="mb-6">
            <h4 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">{t('userIdentifier')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="id">{t('nationalId')}</label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  placeholder={t('idPlaceholder')}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${!isNewUser ? 'bg-gray-100 cursor-not-allowed' : ''} ${language === 'ar' ? 'text-right' : ''}`}
                  required
                  pattern="^[12]\d{9}$"
                  title={t('nationalIdTitle')}
                  minLength="10"
                  maxLength="10"
                  readOnly={!isNewUser}
                />
              </div>
            </div>
          </div>
          
          {!isNewUser && (
            <>
              <div className="mb-6">
                <h4 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">{t('names')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="arFullName">{t('arabicFullName')}</label>
                    <input type="text" id="arFullName" name="arFullName" value={formData.arFullName} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} required readOnly/>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="enFullName">{t('englishFullName')}</label>
                    <input type="text" id="enFullName" name="enFullName" value={formData.enFullName} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} required readOnly/>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="arFirst">{t('arabicFirstName')}</label>
                    <input type="text" id="arFirst" name="arFirst" value={formData.arFirst} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} readOnly/>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="enFirst">{t('englishFirstName')}</label>
                    <input type="text" id="enFirst" name="enFirst" value={formData.enFirst} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} readOnly/>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="arFather">{t('arabicFatherName')}</label>
                    <input type="text" id="arFather" name="arFather" value={formData.arFather} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} readOnly/>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="enFather">{t('englishFatherName')}</label>
                    <input type="text" id="enFather" name="enFather" value={formData.enFather} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} readOnly/>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="arGrand">{t('arabicGrandfatherName')}</label>
                    <input type="text" id="arGrand" name="arGrand" value={formData.arGrand} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} readOnly/>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="enGrand">{t('englishGrandfatherName')}</label>
                    <input type="text" id="enGrand" name="enGrand" value={formData.enGrand} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} readOnly/>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="arFamily">{t('arabicFamilyName')}</label>
                    <input type="text" id="arFamily" name="arFamily" value={formData.arFamily} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} readOnly/>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="enFamily">{t('englishFamilyName')}</label>
                    <input type="text" id="enFamily" name="enFamily" value={formData.enFamily} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} readOnly/>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">{t('dates')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="dobG">{t('gregorianDob')}</label>
                    <input type="date" id="dobG" name="dobG" value={formData.dobG} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} readOnly/>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="dobH">{t('hijriDob')}</label>
                    <input type="number" id="dobH" name="dobH" value={formData.dobH} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} readOnly/>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="idIssueDateG">{t('gregorianIdIssueDate')}</label>
                    <input type="date" id="idIssueDateG" name="idIssueDateG" value={formData.idIssueDateG} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} readOnly/>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="idIssueDateH">{t('hijriIdIssueDate')}</label>
                    <input type="number" id="idIssueDateH" name="idIssueDateH" value={formData.idIssueDateH} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} readOnly/>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="idExpiryDateG">{t('gregorianIdExpiryDate')}</label>
                    <input type="date" id="idExpiryDateG" name="idExpiryDateG" value={formData.idExpiryDateG} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} readOnly/>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="idExpiryDateH">{t('hijriIdExpiryDate')}</label>
                    <input type="number" id="idExpiryDateH" name="idExpiryDateH" value={formData.idExpiryDateH} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} readOnly/>
                  </div>
                </div>
              </div>

               

              <div className="mb-6">
                <h4 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">{t('otherDetails')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="gender">{t('gender')}</label>
                    <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} disabled>
                      <option value="M">{t('male')}</option>
                      <option value="F">{t('female')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="language">{t('preferredLanguage')}</label>
                    <input type="text" id="language" name="language" value={formData.language} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} readOnly/>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="nationality">{t('nationalityCode')}</label>
                    <input type="number" id="nationality" name="nationality" value={formData.nationality} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} readOnly/>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="arNationality">{t('arabicNationality')}</label>
                    <input type="text" id="arNationality" name="arNationality" value={formData.arNationality} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} readOnly/>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="enNationality">{t('englishNationality')}</label>
                    <input type="text" id="enNationality" name="enNationality" value={formData.enNationality} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} readOnly/>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="idVersion">{t('idVersion')}</label>
                    <input type="number" id="idVersion" name="idVersion" value={formData.idVersion} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} readOnly/>
                  </div>
                </div>
              </div>

              {/* <div className="mb-6">
                <h4 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">{t('contactDetails')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">{t('email')}</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="phone">{t('phone')}</label>
                    <input type="number" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} />
                  </div>
                </div>
              </div> */}

            </>
          )}

 <div className="mb-6">
            <h4 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">{t('contactDetails')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">{t('email')}</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="phone">{t('phone')}</label>
                <input type="number" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} />
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">{t('groupsLabel')}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {groups.map(group => (
                <label key={group.id} className={`flex items-center space-x-2 text-gray-700 ${language === 'ar' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <input
                    type="checkbox"
                    value={group.id}
                    checked={formData.groupIds.includes(group.id)}
                    onChange={handleGroupChange}
                    className="form-checkbox text-teal-600 rounded-md transition-colors duration-200"
                  />
                  <span>{group.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="role">{t('assignedRole')}</label>
            <input
              type="text"
              id="role"
              value={currentRoleNames}
              readOnly
              className={`w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600 focus:outline-none cursor-not-allowed ${language === 'ar' ? 'text-right' : ''}`}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">{t('resourcesLabel')}</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(resourcesByCategory).map(([category, perms]) => (
                <div key={category} className="mb-3">
                  <h4 className="text-sm font-bold text-gray-500 mb-1">{category}</h4>
                  {perms.map(p => (
                    <div key={p.id} className={`flex items-center space-x-2 text-gray-700 ${language === 'ar' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <CheckCircle2
                        size={16}
                        className={currentresources.includes(p.id) ? "text-green-500" : "text-gray-300"}
                      />
                      <span>{p.name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className={`flex justify-end space-x-4 ${language === 'ar' ? 'flex-row-reverse space-x-reverse' : ''}`}>
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

export default UserModal;