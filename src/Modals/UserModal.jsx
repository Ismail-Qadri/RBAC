import React, { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import useLanguage from '../hooks/useLanguage';
import axios from "axios";

const UserModal = ({ groups, roles, resources, onClose, onSave, user }) => {
  const { language, t } = useLanguage();
  const [nafathId, setNafathId] = useState("");
  const [fetchError, setFetchError] = useState("");
  const [formData, setFormData] = useState(() => {
    // If editing, preselect user's groups
    if (user && Array.isArray(user.groups)) {
      return {
        nafath_id: user.nafath_id || '',
        id_version: user.id_version || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        first_name_ar: user.first_name_ar || '',
        father_name_ar: user.father_name_ar || '',
        grand_name_ar: user.grand_name_ar || '',
        family_name_ar: user.family_name_ar || '',
        first_name_en: user.first_name_en || '',
        father_name_en: user.father_name_en || '',
        grand_name_en: user.grand_name_en || '',
        family_name_en: user.family_name_en || '',
        two_name_ar: user.two_name_ar || '',
        two_name_en: user.two_name_en || '',
        full_name_ar: user.full_name_ar || '',
        full_name_en: user.full_name_en || '',
        gender: user.gender || '',
        id_issue_date_g: user.id_issue_date_g || '',
        id_issue_date_h: user.id_issue_date_h || '',
        id_expiry_date_g: user.id_expiry_date_g || '',
        id_expiry_date_h: user.id_expiry_date_h || '',
        language: user.language || '',
        nationality: user.nationality || '',
        nationality_ar: user.nationality_ar || '',
        nationality_en: user.nationality_en || '',
        dob_g: user.dob_g || '',
        dob_h: user.dob_h || '',
        card_issue_place_ar: user.card_issue_place_ar || '',
        card_issue_place_en: user.card_issue_place_en || '',
        title_desc_ar: user.title_desc_ar || '',
        title_desc_en: user.title_desc_en || '',
        full_name: user.full_name || '',
        status: user.status || '',
        roles: user.roles || [],
        groupIds: user.groups.map(g => g.id),
      };
    }
    // Default for new user
    return {
      nafath_id: '',
      id_version: '',
      email: '',
      phone_number: '',
      first_name_ar: '',
      father_name_ar: '',
      grand_name_ar: '',
      family_name_ar: '',
      first_name_en: '',
      father_name_en: '',
      grand_name_en: '',
      family_name_en: '',
      two_name_ar: '',
      two_name_en: '',
      full_name_ar: '',
      full_name_en: '',
      gender: '',
      id_issue_date_g: '',
      id_issue_date_h: '',
      id_expiry_date_g: '',
      id_expiry_date_h: '',
      language: '',
      nationality: '',
      nationality_ar: '',
      nationality_en: '',
      dob_g: '',
      dob_h: '',
      card_issue_place_ar: '',
      card_issue_place_en: '',
      title_desc_ar: '',
      title_desc_en: '',
      full_name: '',
      status: '',
      roles: [],
      groupIds: [],
    };
  });
  const isNewUser = !user;
  const API_BASE_URL = 'https://dev-api.wedo.solutions:3000/api';

  // If editing, fetch user data from API
  useEffect(() => {
    if (!isNewUser && user?.nafath_id) {
      axios.get(`${API_BASE_URL}/users`)
        .then(res => {
          const users = Array.isArray(res.data) ? res.data : [];
          const data = users.find(u => u.nafath_id === user.nafath_id);
          if (data) {
            setFormData({
              ...formData,
              ...data,
              nafath_id: data.nafath_id || '',
              groups: Array.isArray(data.groups) ? data.groups : [],
              phone: data.phone_number || '',
              arNationality: data.nationality_ar || '',
              enNationality: data.nationality_en || '',
              idVersion: data.id_version || '',
              dobG: data.dob_g || '',
              dobH: data.dob_h || '',
              idIssueDateG: data.id_issue_date_g || '',
              idIssueDateH: data.id_issue_date_h || '',
              idExpiryDateG: data.id_expiry_date_g || '',
              idExpiryDateH: data.id_expiry_date_h || '',
            });
          }
        })
        .catch(() => {
          // Optionally handle error (show message, etc.)
        });
    } else if (user) {
      setFormData({
        ...formData,
        ...user,
        nafath_id: user.nafath_id || '',
        groups: Array.isArray(user.groups) ? user.groups : [],
        phone: user.phone_number || '',
        arNationality: user.nationality_ar || '',
        enNationality: user.nationality_en || '',
        idVersion: user.id_version || '',
        dobG: user.dob_g || '',
        dobH: user.dob_h || '',
        idIssueDateG: user.id_issue_date_g || '',
        idIssueDateH: user.id_issue_date_h || '',
        idExpiryDateG: user.id_expiry_date_g || '',
        idExpiryDateH: user.id_expiry_date_h || '',
      });
    }
  }, [user, isNewUser]);
  
  const getResourcesForGroups = (groupIds) => {
    if (!Array.isArray(groupIds)) return [];
    const allResourceIds = groupIds.flatMap(id => {
      const group = groups.find(g => g.id === id);
      if (group && Array.isArray(group.roles)) {
        return group.roles.flatMap(role => role.resourceIds || []);
      }
      return [];
    });
    return Array.from(new Set(allResourceIds));
  };
  
  const getRoleNamesForGroups = (groupIds) => {
    if (!Array.isArray(groupIds)) return '';
    const uniqueRoleNames = new Set();
    groupIds.forEach(id => {
      const group = groups.find(g => g.id === id);
      if (group && Array.isArray(group.roles)) {
        group.roles.forEach(role => {
          uniqueRoleNames.add(role.name);
        });
      }
    });
    return Array.from(uniqueRoleNames).join(', ');
  };

  const getresourceName = (resourceId) => {
    return resources.find(p => p.id === resourceId)?.name || resourceId;
  };

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'roles') {
      // Multi-select for roles
      const roleId = parseInt(value, 10);
      setFormData(prev => {
        let newRoles;
        if (checked) {
          newRoles = [...(prev.roles || []), roleId];
        } else {
          newRoles = (prev.roles || []).filter(id => id !== roleId);
        }
        return { ...prev, roles: newRoles };
      });
    } else if (name === 'phone_number') {
      setFormData({ ...formData, phone_number: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // If user is entering nafath_id, fetch all users and filter in frontend
    if (name === 'nafath_id' && value.length >= 10) {
      try {
        const res = await axios.get(`${API_BASE_URL}/users`);
        const users = Array.isArray(res.data) ? res.data : [];
        const userData = users.find(u => u.nafath_id === value);
        if (userData) {
          setFetchError("");
          setFormData(prev => ({
            ...prev,
            ...userData,
            nafath_id: userData.nafath_id || value,
            groups: Array.isArray(userData.groups) ? userData.groups : [],
            phone: userData.phone_number || '',
          }));
        } else {
          // Do nothing if not found
        }
      } catch (err) {
        setFetchError("Could not fetch users. Please try again later.");
        console.error('Error fetching users:', err);
      }
    } else if (name === 'nafath_id') {
      setFetchError("");
    }
  };

  const handleGroupChange = (e) => {
    const { value, checked } = e.target;
    const groupId = parseInt(value, 10);
    setFormData(prevData => {
      let newGroupIds;
      if (checked) {
        newGroupIds = [...(prevData.groupIds || []), groupId];
      } else {
        newGroupIds = (prevData.groupIds || []).filter(id => id !== groupId);
      }
      return { ...prevData, groupIds: newGroupIds };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation: nafath_id must be exactly 10 digits for new user
    if (isNewUser) {
      const nafathId = formData.nafath_id;
      if (!nafathId || nafathId.length !== 10 || !/^[0-9]{10}$/.test(nafathId)) {
        alert('National ID (nafath_id) must be exactly 10 digits.');
        return;
      }
    }
    let payload;
    if (isNewUser) {
      // Only nafath_id required for new user
      payload = { nafath_id: formData.nafath_id };
    } else {
      // For edit, send all fields
      const requiredFields = [
        'nafath_id', 'email', 'phone_number', 'first_name_ar', 'father_name_ar', 'grand_name_ar', 'family_name_ar',
        'first_name_en', 'father_name_en', 'grand_name_en', 'family_name_en', 'gender', 'language', 'nationality',
        'dob_g', 'dob_h', 'id_version', 'id_issue_date_g', 'id_issue_date_h', 'id_expiry_date_g', 'id_expiry_date_h',
        'status'
      ];
      payload = {};
      requiredFields.forEach(field => {
        payload[field] = formData[field] !== undefined ? formData[field] : '';
      });
    }

    try {
      // Create or update user
      let userRes;
      if (isNewUser) {
        userRes = await axios.post(`${API_BASE_URL}/users`, payload);
      } else {
        userRes = await axios.put(`${API_BASE_URL}/users/${formData.id}`, payload);
      }
      const userId = userRes.data?.id || formData.id;

      // Remove user from all groups first (for update)
      if (!isNewUser && userId && Array.isArray(groups)) {
        for (const group of groups) {
          try {
            await axios.delete(`${API_BASE_URL}/associations/groups/${group.id}/users/${userId}`);
          } catch (err) {
            // Ignore errors for groups user isn't in
          }
        }
      }

      // Associate user with selected groups
      if (userId && Array.isArray(formData.groupIds)) {
        for (const groupId of formData.groupIds) {
          try {
            await axios.post(`${API_BASE_URL}/associations/groups/${groupId}/users`, { userId });
          } catch (assocErr) {
            console.error(`Error associating user with group ${groupId}:`, assocErr);
          }
        }
      }

      // Call parent's onSave handler to refresh data in UserManagement table
      if (typeof onSave === 'function') {
        onSave(userRes.data); // This should trigger a fetch in UserManagement table
      }
    } catch (err) {
      alert('Error saving user: ' + (err.response?.data?.message || err.message));
      console.error('Error saving user:', err);
    }
  };
  
  // Use groupIds for role/resource mapping
  const currentRoleNames = getRoleNamesForGroups(formData.groupIds || []);
  const currentResources = getResourcesForGroups(formData.groupIds || []);
  
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
        {fetchError && (
          <div className="mb-4 text-red-600 font-semibold text-center">
            {fetchError}
          </div>
        )}
        <form onSubmit={handleSubmit} dir={language === 'ar' ? 'rtl' : 'ltr'} className="overflow-y-auto flex-1">
          <div className="mb-6">
            <h4 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">{t('userIdentifier')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="nafath_id">{t('nationalId')}</label>
                <input
                  type="text"
                  id="nafath_id"
                  name="nafath_id"
                  value={formData.nafath_id}
                  onChange={handleChange}
                  placeholder={formData.nafath_id || t('idPlaceholder')}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${!isNewUser ? 'bg-gray-100 cursor-not-allowed' : ''} ${language === 'ar' ? 'text-right' : ''}`}
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
                    <input type="text" id="arFullName" name="arFullName" value={formData.arFullName} onChange={handleChange} placeholder={formData.full_name_ar || t('arabicFullName')} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} required readOnly/>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="enFullName">{t('englishFullName')}</label>
                    <input type="text" id="enFullName" name="enFullName" value={formData.enFullName} onChange={handleChange} placeholder={formData.full_name_en || t('englishFullName')} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} required readOnly/>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="arFirst">{t('arabicFirstName')}</label>
                    <input type="text" id="arFirst" name="arFirst" value={formData.arFirst} onChange={handleChange} placeholder={formData.first_name_ar || t('arabicFirstName')} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} readOnly/>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="enFirst">{t('englishFirstName')}</label>
                    <input type="text" id="enFirst" name="enFirst" value={formData.enFirst} onChange={handleChange} placeholder={formData.first_name_en || t('englishFirstName')} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} readOnly/>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="arFather">{t('arabicFatherName')}</label>
                    <input type="text" id="arFather" name="arFather" value={formData.arFather} onChange={handleChange} placeholder={formData.father_name_ar || t('arabicFatherName')} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} readOnly/>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="enFather">{t('englishFatherName')}</label>
                    <input type="text" id="enFather" name="enFather" value={formData.enFather} onChange={handleChange} placeholder={formData.father_name_en || t('englishFatherName')} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} readOnly/>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="arGrand">{t('arabicGrandfatherName')}</label>
                    <input type="text" id="arGrand" name="arGrand" value={formData.arGrand} onChange={handleChange} placeholder={formData.grand_name_ar || t('arabicGrandfatherName')} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} readOnly/>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="enGrand">{t('englishGrandfatherName')}</label>
                    <input type="text" id="enGrand" name="enGrand" value={formData.enGrand} onChange={handleChange} placeholder={formData.grand_name_en || t('englishGrandfatherName')} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} readOnly/>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="arFamily">{t('arabicFamilyName')}</label>
                    <input type="text" id="arFamily" name="arFamily" value={formData.arFamily} onChange={handleChange} placeholder={formData.family_name_ar || t('arabicFamilyName')} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} readOnly/>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="enFamily">{t('englishFamilyName')}</label>
                    <input type="text" id="enFamily" name="enFamily" value={formData.enFamily} onChange={handleChange} placeholder={formData.family_name_en || t('englishFamilyName')} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} readOnly/>
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
                {/* <input type="string" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} /> */}
                <input type="string" id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${language === 'ar' ? 'text-right' : ''}`} />
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
                    checked={Array.isArray(formData.groupIds) && formData.groupIds.includes(group.id)}
                    onChange={handleGroupChange}
                    className="form-checkbox text-teal-600 rounded-md transition-colors duration-200"
                  />
                  <span>{group.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="role">{t('assignedRoles')}</label>
            <input
              type="text"
              id="role"
              value={getRoleNamesForGroups(formData.groupIds || [])}
              readOnly
              className={`w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600 focus:outline-none cursor-not-allowed ${language === 'ar' ? 'text-right' : ''}`}
            />
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